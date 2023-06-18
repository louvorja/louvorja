import { app, protocol, BrowserWindow, screen, ipcMain, desktopCapturer } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
//import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const Config = require("./backend/Config");
const Fs = require("./backend/Fs");
const JSONData = require("./backend/JSONData");

const http = require('http');
const fs = require('fs');

const { localStorage } = require('electron-browser-storage');

var request = require('request');
var __lang;

const isDevelopment = Config.isDevelopment()
const isPortable = Config.isPortable();

let loadingScreen;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

app.setAppPath(process.cwd());


/* ************* SALVAR LOGS EM ARQUIVO ******************** */
const util = require('util');

let log_file = fs.createWriteStream(Fs.getAppBasePath('debug.log'), { flags: 'w' });
let log_stdout = process.stdout;

function saveConsole(args) {
  const date = new Date();
  const datetime = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

  let output = datetime + ' | ' + args.join(' ');
  log_file.write(util.format(output) + '\r\n');
  log_stdout.write(util.format(output) + '\r\n');
}
console.log = function (...args) {
  saveConsole(args);
};
console.error = function (...args) {
  saveConsole(args);
};
console.warn = function (...args) {
  saveConsole(args);
};
/* ****************************************************************** */

if (fs.existsSync(Fs.getAppPath('public/buildcode.txt'))) {
  let buildCode = fs.readFileSync(Fs.getAppPath('public/buildcode.txt'));
  console.log("Build Code:", buildCode);
} else {
  console.log("Build Code não localizado");
}
if (fs.existsSync(Fs.getAppBasePath('.debug'))) {
  console.log("Arquivo", Fs.getAppBasePath('.debug'), "localizado", "<< MODO DESENVOLVIMENTO ATIVADO >>")
}
console.log("É ambiente de desenvolvimento?", isDevelopment);
console.log("É portable?", isPortable);
console.log("Plataforma", process.platform);
console.log("Diretório do Aplicativo (getAppPath):", Fs.getAppPath());
console.log("Diretório Local (getAppBasePath):", Fs.getAppBasePath());
console.log("Diretório Portable (PORTABLE_EXECUTABLE_DIR):", process.env.PORTABLE_EXECUTABLE_DIR);
console.log("Diretório Fonte:", Fs.getAppPath("fonts/din-condensed-bold.ttf"));

let win = {};
async function activeWindow() {

  console.log("Inicializando Janela");
  // Create the browser window.
  createWindow(0);
}
function createLoadingScreen() {
  console.log("Inicializando Tela de Carregamento:", Fs.getAppPath('public/loading.html'));

  loadingScreen = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: true,
    frame: false,
    icon: Fs.getAppPath('public/favicon.png'),
  });
  loadingScreen.maximize()

  loadingScreen.loadFile(Fs.getAppPath('public/loading.html'));
  loadingScreen.on('closed', () => (loadingScreen = null));
}
function closeLoadingScreen() {
  console.log("Fechando Tela de Carregamento");
  loadingScreen.close();
}

async function createWindow(i, route, current_screen) {
  i = +i;
  route = "#/" + (route == undefined ? "" : route);

  let width, height, x, y, alwaysOnTop;
  if (i > 0) {
    let displays = screen.getAllDisplays();
    let display = displays.find(display => display.id == i);
    width = display.size.width;
    height = display.size.height;
    x = display.bounds.x;
    y = display.bounds.y;
    alwaysOnTop = current_screen.always_on_top || false;
  } else {
    width = 800;
    height = 600;
    x = 0;
    y = 0;
    alwaysOnTop = false;
  }

  let create = false;

  console.log('Janela', i, 'Route', route, 'win[i]', win[i], 'current_screen', current_screen)
  if (typeof win[i] == 'undefined') {
    create = true;
    win[i] = new BrowserWindow({
      width,
      height,
      x,
      y,
      alwaysOnTop,
      resizable: true,
      backgroundColor: '#000000',
      autoHideMenuBar: false,
      titlebarStyle: 'hidden',
      frame: false,
      show: false,
      icon: Fs.getAppPath('public/favicon.png'),
      title: "Louvor JA",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        icon: Fs.getAppPath('public/favicon.png'),
        preload: Fs.getAppPath('public/preload.js'),
      },
    })

    win[i].webContents.on('did-finish-load', () => {
      console.log('Janela', i, 'carregada 100%')
      win[i].webContents.send('loaded', i);
      win[i].webContents.send('development', isDevelopment);
      win[i].webContents.send('current_screen', current_screen);
    })
  }

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win[i].loadURL(process.env.WEBPACK_DEV_SERVER_URL + route)
    if (!process.env.IS_TEST) win[i].webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win[i].loadURL('app://./index.html' + route)
    if (isDevelopment) {
      win[i].webContents.openDevTools()
    }
  }

  console.log("Janela Criada?", create)
  if (i && i > 0) {
    win[0].webContents.send('screen', true, i, route);
  }
  printScreen();

  if (create) {
    win[i].maximize()
    win[i].show()
    if (loadingScreen) {
      closeLoadingScreen();
    }

    win[i].on('resize', function () {
      if (BrowserWindow.getFocusedWindow()) {
        win[i].webContents.send('maximize', BrowserWindow.getFocusedWindow().isMaximized() || false);
      }
    });
  }

  win[i].on('close', () => {
    if (i == 0) {
      Object.keys(win).map((id) => {
        if (id > 0) {
          win[id].close();
        }
      });
    }
    win[0].webContents.send('screen', false, i, route);
    delete win[i];
  });

  win[i].on('focus', () => {
    printScreen();
  });

  win[i].on('blur', () => {
    printScreen();
  });

}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  console.log('app ==> activate')

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) activeWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  console.log('app ==> ready')

  screen.on('display-added', refreshDisplays);
  screen.on('display-removed', refreshDisplays);
  /*
  if (isDevelopment && !process.env.IS_TEST) {
    console.log('Ambiente de DEV. Instalando VUEJS_DEVTOOLS.')

    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }*/
  createLoadingScreen();
  activeWindow()
})

app.on('browser-window-ready-to-show', () => {
  console.log('app ==> browser-window-ready-to-show')

  if (loadingScreen) {
    closeLoadingScreen()
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize()
})
ipcMain.on('maximize', () => {
  if (BrowserWindow.getFocusedWindow()) {
    if (!BrowserWindow.getFocusedWindow().isMaximized()) {
      BrowserWindow.getFocusedWindow().maximize();
    } else {
      BrowserWindow.getFocusedWindow().unmaximize();
    }
  }
})
ipcMain.on('close', () => {
  BrowserWindow.getFocusedWindow().close()
})

ipcMain.on('config', (event, app_lang) => {
  const ip = require("ip")

  if (app_lang) {
    lang(app_lang);
  }

  event.reply('portable', isPortable);
  event.reply('development', isDevelopment);
  event.reply('ip', ip.address());
  event.reply('platform', process.platform);
  event.reply('data', JSONData.getFile(Fs.getAppBasePath('config.json')));
  event.reply('path', {
    app_path: Fs.getAppPath(),
    base: Fs.getAppBasePath(),
    files: Fs.getAppFilesPath(),
    files_lang: Fs.getAppFilesLangPath(lang())
  });
  event.reply('debug', isDevelopment);
  refreshDisplays();
})

ipcMain.on('displays', (event) => {
  refreshDisplays();
});

ipcMain.on('start_db', async (event, port) => {
  await localStorage.setItem("db-port", port);
  await localStorage.setItem("db-status", "pending");
  var dbStatus = setInterval(async function () {
    let status = await localStorage.getItem("db-status");
    port = await localStorage.getItem("db-port");
    let message = await localStorage.getItem("db-message");
    console.log("Tentando conectar ao Banco de Dados.... Status: ", status, " - Porta: ", port, " - Mensagem: ", message)
    if (status !== "pending") {
      event.reply('start_db', status, port, message);
      clearInterval(dbStatus);
    } else {
      //Não teve retorno, verifica se está no ar mesmo assim
      const url = `http://localhost:${port}/`;
      console.log("Verifica se BD está no ar", url)
      http.get(url, res => {
        console.log("BD no ar!")
        event.reply('start_db', true, port, "");
        clearInterval(dbStatus);
      }).on('error', err => {
        console.log("BD fora do ar!", err.message)
      })
    }
  }, 1000);
  const db = require("./database/server");
})

ipcMain.on('config_web', (event) => {
  var data = null;
  if (fs.existsSync(Fs.getAppFilesPath('config.json'))) {
    data = JSONData.getFile(Fs.getAppFilesPath('config.json'));
  }

  event.reply('config_web', data);
})

ipcMain.on('get_json', (event, filename) => {
  var data = null;
  if (fs.existsSync(Fs.getAppFilesPath(filename + '.json'))) {
    data = JSONData.getFile(Fs.getAppFilesPath(filename + '.json'));
  }

  event.reply('get_json', data);
})

ipcMain.on('save_json', (event, filename, data, dir) => {
  var str = JSONData.toJSONFile(data);
  if (dir == 'filedir') {
    dir = Fs.getAppFilesPath()
  } else {
    dir = Fs.getAppBasePath()
  }
  fs.writeFileSync(dir + filename + '.json', str);
})

ipcMain.on('save_data', (event, data) => {
  //var str = JSONData.toJSONFile(data);
  var str = data;
  fs.writeFileSync(Fs.getAppBasePath() + 'config.json', str);
  console.log('Dados Salvos', Fs.getAppBasePath() + 'config.json')
  event.reply('save_data');
})

ipcMain.on('download', (event, file) => {
  let url = `${file.base_url}${file.subdirectory}${file.file_name}`;
  let path = Fs.getAppFilesLangPath(lang(), `${file.subdirectory}`);
  let file_name = file.file_name;

  let received_bytes = 0;
  let total_bytes = 0;

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log("Diretório criado", fs.existsSync(path), path);
  }

  let req = request({
    method: 'GET',
    uri: url
  });

  let out = fs.createWriteStream(`${path}${file_name}`);
  req.pipe(out);

  req.on('response', function (data) {
    // Change the total bytes value to get progress later.
    total_bytes = parseInt(data.headers['content-length']);
    event.reply('download', 'size', total_bytes);
  });

  req.on('data', function (chunk) {
    // Update the received bytes
    received_bytes += chunk.length;
    event.reply('download', 'progress', received_bytes);
  });

  req.on('end', function () {
    event.reply('download', 'complete');
  });
});

ipcMain.on('devtools', (event, file) => {
  console.log("DevTools")
  if (win[0].webContents.isDevToolsOpened()) {
    console.log("Fecha DevTools")
    win[0].webContents.closeDevTools();
  } else {
    console.log("Abre DevTools")
    win[0].webContents.openDevTools();
  }
});

ipcMain.on('screen', (event, id, route, data) => {
  createWindow(id, route, data);
  event.reply('displays', screen.getAllDisplays());
})

ipcMain.on('current_screen', (event, id, data) => {
  if (win[id]) {
    win[id].webContents.send('current_screen', data);
  }
})

ipcMain.on('close_screen', (event, id) => {
  if (win[id]) {
    win[id].close();
  }
})

ipcMain.on('data_screen', (event, screen, data) => {
  Object.keys(win).map((id) => {
    if (id > 0) {
      win[id].webContents.send(screen, data);
    }
  });
})

ipcMain.on('print', (event) => {
  printScreen();
})

ipcMain.on('identify_monitors', (event, screens) => {
  let displays = screen.getAllDisplays();
  displays.map(display => {
    let label = display.label;
    let name = (screens[display.id] && screens[display.id].label) || display.label;
    let size = display.size.width + ' x ' + display.size.height;
    if (label == name) {
      label = "";
    }

    let width = display.size.width / 3;
    let height = display.size.height / 4;
    let x = display.bounds.x;
    let y = Math.round(display.bounds.y + (display.size.height * .1));
    let opacity = .9;

    if (width < 450) {
      width = Math.min(450, display.size.width);
    }
    if (height < 200) {
      height = Math.min(200, display.size.height);
    }
    if (display.size.height < 400) {
      y = display.bounds.y;
    }

    let window = new BrowserWindow({
      width,
      height,
      x,
      y,
      alwaysOnTop: true,
      transparent: true,
      frame: false,
      icon: Fs.getAppPath('public/favicon.png'),
      opacity
    });

    window.loadFile(Fs.getAppPath('public/identify-monitors.html'), { query: { label, name, size } });

    window.once('ready-to-show', () => {
      printScreen(100);

      setTimeout(function () {
        window.close();
        printScreen(100);
      }, 5000);
    });

  });
})


function lang(app_lang = null) {
  if (app_lang) {
    __lang = app_lang;
  } else {
    app_lang = __lang;
  }
  return __lang;
}

function refreshDisplays() {
  let displays = screen.getAllDisplays();
  win[0].webContents.send('displays', displays);

  //Checa as janelas
  let data = JSONData.getFile(Fs.getAppBasePath('config.json'));
  Object.keys(data.screen).map(item => {
    let screen = data.screen[item];
    let display = displays.filter(d => d.id == item)[0];

    //É janela bloqueada, porém não existe! Cria janela.
    if (screen.lock && !win[item] && display) {
      console.log("NÃO EXISTE")
      createWindow(item, 'screen', screen);
    }

    //Tela está aberta, porém monitor está desconectado! Oculta a janela.
    if (win[item] && !display) {
      console.log("EXISTE, MAS DESCONECTADO")
      win[item].setOpacity(0);
    }

    //Tela está aberta, e monitor existe! Reposiciona a janela.
    if (win[item] && display) {
      console.log("EXISTE, E CONECTADO")
      win[item].setOpacity(1);
      win[item].setPosition(display.bounds.x, display.bounds.y);
      win[item].setSize(display.size.width, display.size.height);
      win[item].setAlwaysOnTop(screen.always_on_top || false);
    }
  });
}

function printScreen(delay) {
  delay = delay || 0;
  setTimeout(function () {
    desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 300, height: 200 } })
      .then(sources => {
        sources.map(source => {
          win[0].webContents.send('print_screen', source.display_id, source.thumbnail.toDataURL());
        });
      })
      .catch(error => {
        console.error('Erro ao obter as fontes de tela:', error);
      });
  }, delay)
}
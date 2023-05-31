import { app, protocol, BrowserWindow, screen, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
//import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

const Config = require("./backend/Config");
const Fs = require("./backend/Fs");

const http = require('http')
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
  const datetime = `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

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

let win = [];
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

async function createWindow(i, route) {
  route = (route == undefined ? "" : route);

  let create = false;

  console.log('Janela', i, route)
  if (win[i] == undefined) {
    create = true;
    win[i] = new BrowserWindow({
      width: 800,
      height: 600,
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
      win[i].webContents.send('loaded');
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

/*
function ipc(){
  ipcMain.on('action', function(event,data,params,params2){
    console.log('Action',data);
    if (data == 'getDataWeb'){
      sendDataWeb(params);
    }else if (data == 'getJSON'){
      sendJSON(params,params2);
    }else if(data == 'saveData'){
      var str = array2jsonfile(params);
      fs.writeFileSync(Fs.getAppBasePath()+'config.json', str);
      //console.log('salvando... ',Fs.getAppBasePath()+'config.json',params);
      win[0].webContents.send('saveData',0);

    }else if(data == 'saveApiData'){
      var str = array2jsonfile(params);
      var path = Fs.getAppFilesPath()+params2+'.json';
      fs.writeFileSync(path, str);
      console.log('salvando... ',Fs.getAppFilesPath()+'config.json',params,params2);
      //win[0].webContents.send(params2,getJSONFile(path));

    }else if(data == 'openWindow'){
      console.log(params.route);
      createWindow(1,params.route);
      //win[0].webContents.send('saveData',0);
    }else if(data == 'data'){
      win.forEach(function(element, index) {
        if (index > 0){
          win[index].webContents.send('popup_data',params,params2);
        }
      });
    }else if(data == 'getDataMain'){
      win[0].webContents.send('getDataMain',params);

    }else if (data == 'startServer'){
      var static = require('node-static');
      var file = new static.Server(`${__dirname}/server`)
      var _ip = params.ip
      var _port = params.port
      
      server = require('http').createServer(function (request, response) {
          request.addListener('end', function () {
              file.serve(request, response)
          }).resume()
      }).listen(_port,_ip)

      win[0].webContents.send('server',{status: true, ip: _ip, port: _port});
      console.log(_ip,_port,params)

      server.on('error', function (e) {
        win[0].webContents.send('server',{status: false, error: 'Erro ao iniciar servidor'});
        server.close()
      });
    }else if (data == 'stopServer'){
      server.close()
      win[0].webContents.send('server',{status: false});
      
    }else if(data == 'minimize'){
      BrowserWindow.getFocusedWindow().minimize()
    }else if(data == 'maximize'){
      if (!BrowserWindow.getFocusedWindow().isMaximized()) {
        BrowserWindow.getFocusedWindow().maximize();
      } else {
        BrowserWindow.getFocusedWindow().unmaximize();
      }
    }else if(data == 'close'){
      BrowserWindow.getFocusedWindow().close()
    }
  });
}
*/

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

  lang(app_lang);

  event.reply('portable', isPortable);
  event.reply('development', isDevelopment);
  event.reply('displays', screen.getAllDisplays());
  event.reply('ip', ip.address());
  event.reply('platform', process.platform);
  event.reply('data', getJSONFile(Fs.getAppBasePath('config.json')));
  event.reply('path', {
    app_path: Fs.getAppPath(),
    base: Fs.getAppBasePath(),
    files: Fs.getAppFilesPath(),
    files_lang: Fs.getAppFilesLangPath(lang())
  });
  event.reply('debug', isDevelopment);
})

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
    data = getJSONFile(Fs.getAppFilesPath('config.json'));
  }

  event.reply('config_web', data);
})

ipcMain.on('get_json', (event, filename) => {
  var data = null;
  if (fs.existsSync(Fs.getAppFilesPath(filename + '.json'))) {
    data = getJSONFile(Fs.getAppFilesPath(filename + '.json'));
  }

  event.reply('get_json', data);
})

ipcMain.on('save_json', (event, filename, data, dir) => {
  var str = array2jsonfile(data);
  if (dir == 'filedir') {
    dir = Fs.getAppFilesPath()
  } else {
    dir = Fs.getAppBasePath()
  }
  fs.writeFileSync(dir + filename + '.json', str);
})

ipcMain.on('save_data', (event, data) => {
  //var str = array2jsonfile(data);
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



function lang(app_lang = null) {
  if (app_lang) {
    __lang = app_lang;
  } else {
    app_lang = __lang;
  }
  return __lang;
}



function getJSONFile(file) {
  try {
    var data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  }
  catch (e) {
    return {}
  }
}

function array2jsonfile(params) {
  var str1 = JSON.stringify(params);
  var str2 = "";
  var chr = "";
  for (var i = 0; i < str1.length; i++) {
    if (str1[i].match(/[^\x00-\x7F]/)) {
      chr = "/u" + ("000" + str1[i].charCodeAt(0).toString(16)).substr(-4);
    } else {
      chr = str1[i];
    }
    str2 = str2 + chr;
  }
  return str2;
}


function pad(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
import { app, protocol, BrowserWindow, screen, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const db = require("./database/server");

var fs = require('fs');

const APP_NAME = 'LouvorJA';
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])


let win = [];
async function activeWindow() {

  // Create the browser window.
  createWindow(0);
}

async function createWindow(i, route) {
  route = (route == undefined ? "" : route);

  var create = false;

  console.log('JANELA', i, route)
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
      icon: path.resolve(__static, 'favicon.svg'),
      title: "Louvor JA",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        icon: path.resolve(__static, 'favicon.svg'),
        preload: path.resolve(__static, 'preload.js'),
      },
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
    win[i].webContents.openDevTools()
  }

  console.log("create", create)
  if (create) {
    console.log("ok")
    win[i].maximize()
    win[i].show()

    win[i].on('resize', function () {
      win[i].webContents.send('maximize', BrowserWindow.getFocusedWindow().isMaximized());
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
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) activeWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  //if (isDevelopment && !process.env.IS_TEST) {
  // Install Vue Devtools
  try {
    await installExtension(VUEJS_DEVTOOLS)
  } catch (e) {
    console.error('Vue Devtools failed to install:', e.toString())
  }
  //}
  activeWindow()
})

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
      fs.writeFileSync(getAppBasePath()+'config.json', str);
      //console.log('salvando... ',getAppBasePath()+'config.json',params);
      win[0].webContents.send('saveData',0);

    }else if(data == 'saveApiData'){
      var str = array2jsonfile(params);
      var path = getAppFilesPath()+params2+'.json';
      fs.writeFileSync(path, str);
      console.log('salvando... ',getAppFilesPath()+'config.json',params,params2);
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
  if (!BrowserWindow.getFocusedWindow().isMaximized()) {
    BrowserWindow.getFocusedWindow().maximize();
  } else {
    BrowserWindow.getFocusedWindow().unmaximize();
  }
})
ipcMain.on('close', () => {
  BrowserWindow.getFocusedWindow().close()
})

ipcMain.on('config', (event) => {
  const ip = require("ip")

  event.reply('displays', screen.getAllDisplays());
  event.reply('ip', ip.address());
  event.reply('platform', process.platform);
  event.reply('data', getJSONFile(getAppBasePath('config.json')));
  event.reply('path', { base: getAppBasePath(), files: getAppFilesPath() });
})

ipcMain.on('config_web', (event) => {
  var data = null;
  if (fs.existsSync(getAppFilesPath('config.json'))) {
    data = getJSONFile(getAppFilesPath('config.json'));
  }

  event.reply('config_web', data);
})

ipcMain.on('get_json', (event, filename) => {
  var data = null;
  if (fs.existsSync(getAppFilesPath(filename + '.json'))) {
    data = getJSONFile(getAppFilesPath(filename + '.json'));
  }

  event.reply('get_json', data);
})

ipcMain.on('save_json', (event, filename, data, dir) => {
  var str = array2jsonfile(data);
  if (dir == 'filedir') {
    dir = getAppFilesPath()
  } else {
    dir = getAppBasePath()
  }
  fs.writeFileSync(dir + filename + '.json', str);
})

ipcMain.on('save_data', (event, data) => {
  var str = array2jsonfile(data);
  fs.writeFileSync(getAppBasePath() + 'config.json', str);
  event.reply('save_data');
})



function getAppBasePath(p) {
  //dev
  //if (process.env.RUN_ENV === 'development') return './'
  //var path = "";
  /*
  if (!process.platform || !['win32', 'darwin'].includes(process.platform)) {
    console.error(`Unsupported OS: ${process.platform}`)
    path = './'
  } else if (process.platform === 'darwin') {
    //console.log('Mac OS detected')
    path = `/Users/${process.env.USER}/Library/Application/Support/${APP_NAME}/`
  } else if (process.platform === 'win32') {
    //console.log('Windows OS detected')
    path = `${process.env.APPDATA}\\${APP_NAME}\\`
  }
  */
  var path = app.getAppPath() + '\\data\\';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log("Diretório criado", fs.existsSync(path), path);
  }
  if (p != undefined) {
    path = path + p;
  }
  //console.log('Diretório Local: ',path)
  return path;
}
console.log('Diretório Local: ', getAppBasePath())

function getAppFilesPath(p) {
  var path = getAppBasePath() + "files\\";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log("Diretório criado", fs.existsSync(path), path);
  }
  path = path + "pt\\";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    console.log("Diretório criado", fs.existsSync(path), path);
  }
  if (p != undefined) {
    path = path + p;
  }
  return path;
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
      chr = "\\u" + ("000" + str1[i].charCodeAt(0).toString(16)).substr(-4);
    } else {
      chr = str1[i];
    }
    str2 = str2 + chr;
  }
  return str2;
}
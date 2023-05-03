import { app } from 'electron'
const fs = require('fs');

const Config = require("./Config");

app.setAppPath(process.cwd());

export function getAppPath(p) {
    let path = app.getAppPath().replace(/\\/g, '/') + '/';
    if (p != undefined) {
        path = path + p;
    }
    return this.dir(path);
}
export function getAppDataPath(p) {
    let path = app.getPath('appData').replace(/\\/g, '/') + '/';
    if (p != undefined) {
        path = path + p;
    }
    return this.dir(path);
}

export function getAppBasePath(p) {
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
      path = `${process.env.APPDATA}/${APP_NAME}/`
    }
    */

    let path;
    if (Config.isPortable()) {
        path = process.env.PORTABLE_EXECUTABLE_DIR + '/LouvorJA/';
    } else if (process.platform === 'win32') {
        path = this.getAppDataPath() + '/LouvorJA/';
    } else {
        path = this.getAppPath() + '/data/';
    }
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        console.log("Diretório criado", fs.existsSync(path), path);
    }
    if (p != undefined) {
        path = path + p;
    }
    //console.log('Diretório Local: ',path)
    return this.dir(path);
}

export function getAppFilesPath(p) {
    var path = this.getAppBasePath() + "files/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        console.log("Diretório criado", fs.existsSync(path), path);
    }
    if (p != undefined) {
        path = path + p;
    }
    return this.dir(path);
}

export function getAppFilesLangPath(lang, p) {
    var path = this.getAppFilesPath() + lang + "/";
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        console.log("Diretório criado", fs.existsSync(path), path);
    }
    if (p != undefined) {
        path = path + p;
    }
    return this.dir(path);
}


export function dir(dir) {
    dir = dir.replace(/\\/g, '/').replace(/\/\//gis, '/');
    return dir;
}
const DevTools = require("./DevTools");

export function send() {
    //DevTools.write("ipcRenderer.send", action, param);
    ipcRenderer.send(...Array.from(arguments));
}
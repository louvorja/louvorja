const DevTools = require("./DevTools");

export function send(action) {
    DevTools.write("ipcRenderer.send", action);
    ipcRenderer.send(action);
}
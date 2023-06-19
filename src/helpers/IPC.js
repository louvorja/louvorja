import store from '../store'
const DevTools = require("./DevTools");

export function send() {
    //DevTools.write("ipcRenderer.send", action, param);
    if (store.state.desktop) {
        ipcRenderer.send(...Array.from(arguments));
    }
}
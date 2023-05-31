import store from '../store'
const DevTools = require("./DevTools");
const IPC = require("./IPC");

export function save() {
    DevTools.write("salvando dados");
    if (store.state.desktop) {
        // SE FOR APLICAÇÃO DESKTOP, SALVA AS CONFIGURAÇÕES NA MAQUINA DO USUARIO
        IPC.send('save_data', JSON.stringify(store.state.data));
    }

    // SEMPRE SALVA AS CONFIGURAÇÕES TBM EM LOCALSTORAGE
    localStorage.data = JSON.stringify(store.state.data);
    store.state.save_data = false;
}
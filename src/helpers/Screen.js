import store from '../store'
import router from '../router'
const Dialog = require("./Dialog");
const IPC = require("./IPC");

export function create(id, route) {
    IPC.send("screen", id, route, this.data(store.state.data.screen[id]));
}
export function show() {
    store.state.screen.show = !store.state.screen.show;
}

export function data(data) {
    if (typeof data == 'object') {
        data = JSON.parse(JSON.stringify(data));
    } else {
        try {
            data = JSON.parse(data);
        } catch (error) {
            data = { data };
        }
    }
    return data;
}

export function send() {
    let arr = { ...Array.from(arguments) };
    let type;
    let data = {};
    Object.keys(arr).map(key => {
        if (key == '0') {
            type = arr[key];
        } else {
            data = { ...data, ...this.data(arr[key]) };
        }
    });


    IPC.send("data_screen", type, data);
}

export function close(id) {
    if (id == undefined) {
        id = store.state.display;
    }
    IPC.send("close_screen", id);
}

export function soft_close(id) {
    if (id == undefined) {
        id = store.state.display;
    }
    if (store.state.current_screen.lock) {
        router.push({ name: "screens" });
    } else {
        this.close(id);
    }
}

export function refresh() {
    IPC.send("displays");
}

export function lock(id) {
    let title = store.state.data.screen[id].lock
        ? "Desbloqueio de Tela"
        : "Bloqueio de Tela";
    let msg = store.state.data.screen[id].lock
        ? "Ao desbloquear esta tela, ela permanecerá aberta somente durante as projeções, e fechada ao término delas.<br><br>Deseja continuar?"
        : "Ao bloquear tela, ela sempre ficará aberta. Quando não tiver projeções, um conteúdo genérico estará sendo mostrado.<br><br>Deseja continuar?";

    let self = this;
    Dialog.yesno(title, msg, function (resp) {
        if (resp == "yes") {
            store.state.data.screen[id].lock = !store.state.data.screen[id].lock;
            console.log("DATATA", store.state.data.screen[id])
            IPC.send("current_screen", id, self.data(store.state.data.screen[id]));
            IPC.send("displays");

            if (!store.state.data.screen[id].lock) {
                if (store.state.active_displays[id] && store.state.active_displays[id].route == '#/screen') {
                    IPC.send("close_screen", id);
                }
            } else {
                setTimeout(function () { IPC.send("displays"); }, 2000);
            }
        }
    });
}
export function register(data) {
    data.map(item => {
        if (!store.state.data.screen[item.id]) {
            store.state.data.screen[item.id] = {};
            store.state.data.screen[item.id].lock = false;
            store.state.data.screen[item.id].label = item.label;
        }
    });
}
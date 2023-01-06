import store from '../store'
const DevTools = require("./DevTools");

export function show(options, callback = function () { }) {
    DevTools.write('%cDialog: ', 'color:blue', options);

    store.state.dialog.show = true;
    store.state.dialog.title = options.title || null;
    store.state.dialog.text = options.text || null;
    store.state.dialog.buttons = options.buttons || [
        { text: "Não", color: "error", value: "no" },
        { text: "Sim", color: "info", value: "yes" },
    ];
    store.state.dialog.value = "";

    let tmr = setInterval(function () {
        if (!store.state.dialog.show) {
            clearInterval(tmr);
            callback(store.state.dialog.value);
        }
    }, 100);
}
export function yesno(title, text, callback = function () { }) {
    this.show({
        title,
        text,
        buttons: [
            { text: "Não", color: "error", value: "no" },
            { text: "Sim", color: "info", value: "yes" },
        ]
    }, (resp, ret) => {
        callback(resp, ret);
    });
}
export function ok(title, text, callback = function () { }) {
    this.show({
        title,
        text,
        buttons: [
            { text: "Fechar", color: "error", value: "close" },
        ]
    }, (resp, ret) => {
        callback(resp, ret);
    });
}
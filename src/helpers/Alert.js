import store from '../store'
const DevTools = require("./DevTools");

export function show(type, msg) {
    DevTools.write('%cAlerta: ', 'color:red', type, msg);
    if (store.state.alert.show && store.state.alert.type === type) {
        if (typeof store.state.alert.text === 'string') {
            store.state.alert.text = [store.state.alert.text];
        }
        store.state.alert.timeout += 5000;
        store.state.alert.text.push(msg);
    } else {
        store.state.alert.show = true;
        store.state.alert.text = msg;
        store.state.alert.type = type;
        store.state.alert.timeout = 5000;
    }
}
export function error(msg) {
    this.show("error", msg)
}
export function info(msg) {
    this.show("info", msg)
}
export function warning(msg) {
    this.show("warning", msg)
}
export function success(msg) {
    this.show("success", msg)
}
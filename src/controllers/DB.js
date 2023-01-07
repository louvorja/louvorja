import store from '../store'

const Api = require("../services/Api");

export function get(table, data, callback = function () { }) {
    if (store.state.desktop) {
        // É sistema desktop, usa banco local
        Api.get_local(table, data, (resp, ret) => {
            callback(resp, ret);
        });
    } else {
        // É sistema online, usa banco remoto
        Api.get(table, data, (resp, ret) => {
            callback(resp, ret);
        });
    }
}

export function post(table, data, callback = function () { }) {
    if (store.state.desktop) {
        // É sistema desktop, usa banco local
        Api.post_local(table, data, (resp, ret) => {
            callback(resp, ret);
        });
    } else {
        // É sistema online, usa banco remoto
        Api.post(table, data, (resp, ret) => {
            callback(resp, ret);
        });
    }
}
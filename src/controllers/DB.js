const Api = require("../services/Api");

export function get(table, data, callback = function () { }) {
    Api.get(table, data, (resp, ret) => {
        callback(resp, ret);
    });
}
export function create(table) {
    //Rotina para montar o DB local futuramente, no caso de desktop
    //......
}
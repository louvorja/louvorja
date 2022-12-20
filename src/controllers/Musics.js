const DB = require("./DB");

export function list(data, callback = function () { }) {
    DB.get("musics", data, (resp, ret) => {
        callback(resp, ret);
    });
}
export function show(id, callback = function () { }) {
    DB.get(`musics/${id}`, {}, (resp, ret) => {
        callback(resp, ret);
    });
}
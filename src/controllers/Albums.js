const DB = require("./DB");

export function list(data, callback = function () { }) {
    DB.get("albums", data, (resp, ret) => {
        callback(resp, ret);
    });
}
export function show(id, callback = function () { }) {
    DB.get(`albums/${id}`, {}, (resp, ret) => {
        callback(resp, ret);
    });
}
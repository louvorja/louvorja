const DB = require("./DB");

export function list(data, callback = function () { }) {
    DB.get("configs", data, (resp, ret) => {
        callback(resp, ret);
    });
}
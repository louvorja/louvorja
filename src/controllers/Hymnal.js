const DB = require("./DB");

export function list(data, callback = function () { }) {
    DB.get("hymnal", data, (resp, ret) => {
        callback(resp, ret);
    });
}
export function show() {
    //console.log("bbbb");
}
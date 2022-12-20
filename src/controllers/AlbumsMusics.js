const DB = require("./DB");

export function list(data, callback = function () { }) {
    DB.get("albums_musics", data, (resp, ret) => {
        callback(resp, ret);
    });
}
export function show() {
    //console.log("bbbb");
}
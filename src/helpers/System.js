const IPC = require("./IPC");

export function maximize() {
    IPC.send('maximize')
}
export function minimize() {
    IPC.send('minimize')
}
export function close() {
    IPC.send('close')
}
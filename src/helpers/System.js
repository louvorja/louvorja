import store from '../store'
const IPC = require("./IPC");
const Dialog = require("./Dialog");

export function maximize() {
    IPC.send('maximize')
}
export function minimize() {
    IPC.send('minimize')
}
export function close() {
    IPC.send('close')
}

export function changeOnline() {
    let title = store.state.data.online
        ? "Dados Off-line"
        : "Dados On-line";
    let msg = store.state.data.online
        ? "Você está alterando o modo de funcionamento do sistema. A partir desse momento, o sistema passará a utilizar um banco de dados local, o qual requer que os dados sejam baixados da internet para funcionarem localmente.<br><br>Deseja alterar para o modo Off-line?"
        : "Você está alterando o modo de funcionamento do sistema. A partir desse momento, o sistema passará a utilizar um banco de dados online, o qual requer uma conexão estável com a internet. Podem haver falhas dependendo da conexão e velocidade de sua internet.<br><br>Deseja alterar para o modo On-line?";

    Dialog.yesno(title, msg, function (resp) {
        if (resp == "yes") {
            store.state.data.online = !store.state.data.online;
        }
    });
}
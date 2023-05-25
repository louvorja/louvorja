import store from '../store'

export function write() {
    if (this.debug()) {
        console.log(...Array.from(arguments), " << ");
    }
}
export function debug() {
    return store.state.debug;
    //return (window.location.hostname == "localhost");
}
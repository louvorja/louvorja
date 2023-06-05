import store from '../store'

export function img(dir) {
    if (store.state.desktop && !store.state.development) {
        dir = `${store.state.path.app_path}/imgs/${dir}`;
    } else {
        dir = require(`@/assets/imgs/${dir}`);
    }
    return dir;
}
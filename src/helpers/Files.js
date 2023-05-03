import store from '../store'

export function img(dir) {
    if (store.state.desktop && !store.state.development) {
        return `${store.state.path.app_path}/imgs/${dir}`;
    } else {
        return require(`@/assets/imgs/${dir}`);
    }
}
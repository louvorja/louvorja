export function set(item, data) {
    if (typeof data == 'object') {
        data = JSON.stringify(data);
    }
    localStorage.setItem(item, data);
}
export function get(item, ifnull = null) {
    let data = localStorage.getItem(item);
    if (!data) {
        return ifnull;
    }

    if (ifnull == null) {
        let data_parse;
        try {
            data_parse = JSON.parse(data);
        } catch (e) {
            data_parse = data;
        }
        return data_parse;
    } else if (typeof ifnull == "object") {
        return JSON.parse(data);
    } else {
        return data;
    }
}
export function remove(item) {
    localStorage.removeItem(item);
}
export function removeAll(item) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key.split(":")[0] == item) {
            this.remove(key);
        }
    }
}
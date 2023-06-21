export function toSeconds(val) {
    if (val == undefined) {
        return 0;
    } else {
        let a = val.split(":");
        return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    }
}
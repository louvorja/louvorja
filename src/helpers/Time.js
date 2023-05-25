export function hms_to_seconds(hms) {
    if (hms == undefined) {
        return 0;
    } else {
        let a = hms.split(":");
        return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
    }
}
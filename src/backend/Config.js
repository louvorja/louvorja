const fs = require('fs');
const Fs = require("./Fs");

export function isDevelopment() {
    if (fs.existsSync(Fs.getAppBasePath('.debug'))) {
        return true;
    } else {
        return process.env.NODE_ENV !== 'production'
    }
}
export function isPortable() {
    return process.platform === 'win32' && process.env.PORTABLE_EXECUTABLE_DIR !== undefined;
}

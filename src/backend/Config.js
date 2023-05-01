export function isDevelopment() {
    return process.env.NODE_ENV !== 'production'
}
export function isPortable() {
    return process.platform === 'win32' && process.env.PORTABLE_EXECUTABLE_DIR !== undefined;
}

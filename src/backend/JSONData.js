const fs = require('fs');

export function getFile(file) {
    try {
        var data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    }
    catch (e) {
        return {}
    }
}

export function toJSONFile(params) {
    var str1 = JSON.stringify(params);
    var str2 = "";
    var chr = "";
    for (var i = 0; i < str1.length; i++) {
        if (str1[i].match(/[^\x00-\x7F]/)) {
            chr = "/u" + ("000" + str1[i].charCodeAt(0).toString(16)).substr(-4);
        } else {
            chr = str1[i];
        }
        str2 = str2 + chr;
    }
    return str2;
}
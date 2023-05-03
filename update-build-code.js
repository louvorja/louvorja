const fs = require('fs');

const date = new Date();
const buildCode = `${date.getFullYear()}.${(date.getMonth() + 1)}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;

fs.writeFileSync('./public/buildcode.txt', buildCode);

console.log(`******************* Build Code: ${buildCode} *******************`);
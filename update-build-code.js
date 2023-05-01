const fs = require('fs');
//const packageJson = JSON.parse(fs.readFileSync('./package.json'));

const now = new Date();
const buildCode = now.toLocaleString().replace(/[^\d]/g, '.');

//packageJson.buildCode = buildCode;
//fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

fs.writeFileSync('./public/buildcode.txt', buildCode);

console.log(`******************* Build Code: ${buildCode} *******************`);
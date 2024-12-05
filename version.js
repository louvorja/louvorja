const fs = require("fs");
const { execSync } = require("child_process");

const versionInfo = {
  version: require("./package.json").version,
  commit: execSync("git rev-parse --short HEAD").toString().trim(),
  date: new Date().toISOString(),
};

fs.writeFileSync("./src/version.json", JSON.stringify(versionInfo, null, 2));

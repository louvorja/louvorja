const Fs = require("../backend/Fs");

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: Fs.getAppBasePath('database.db')
  },
  useNullAsDefault: true
};
require('dotenv').config();

// Update with your config settings.

module.exports = {
  client: 'sqlite3',
  connection: {
    filename: './database.db'
  },
  useNullAsDefault: true
};
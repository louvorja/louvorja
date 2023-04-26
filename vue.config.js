const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'LouvorJA',
        //Add also your database location
        extraResources: ['src/res/'],
      },
      //This line: add knex and sqlite3
      externals: ['knex', 'sqlite3'],
    }
  }
})

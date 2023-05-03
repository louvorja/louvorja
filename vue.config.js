const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: 'LouvorJA',
        //Add also your database location
        //extraResources: ['src/res/'],
        //win: {
        //  icon: "build/CYaPass512.png"
        //},
        extraFiles: [
          {
            from: "public",
            to: "public",
            filter: ["**/*"]
          },
          {
            from: "src/assets/fonts",
            to: "fonts",
            filter: ["**/*"]
          },
          {
            from: "src/assets/imgs",
            to: "imgs",
            filter: ["**/*"]
          }
        ]
      },
      //This line: add knex and sqlite3
      externals: ['knex', 'sqlite3'],
    }
  }
})

const crypto = require('crypto');

/**
 * md4 algorithm is not available anymore in NodeJS 17+ (because of lib SSL 3).
 * In that case, silently replace md4 by md5 algorithm.
 */
try {
  crypto.createHash('md4');
} catch (e) {
  console.warn('Crypto "md4" is not supported anymore by this Node version');
  const origCreateHash = crypto.createHash;
  crypto.createHash = (alg, opts) => {
    return origCreateHash(alg === 'md4' ? 'md5' : alg, opts);
  };
}

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
  },
  pwa: {
    name: 'LouvorJA',
    short_name: 'LouvorJA',
    themeColor: '#000000',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      start_url: '.',
      display: 'fullscreen',
      icons: [
        {
          src: './logo.svg',
          sizes: 'any',
          type: 'image/svg+xml'
        }
      ]
    }
  }
})

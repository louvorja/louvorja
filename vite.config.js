import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { VitePWA } from "vite-plugin-pwa";

const path = require("path");

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [
      vue(),
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
      vuetify({
        autoImport: true,
      }),
      VitePWA({
        registerType: "autoUpdate", // Registra o Service Worker para atualizar automaticamente
        devOptions: {
          enabled: true, // Ativa o PWA também durante o desenvolvimento
        },
        workbox: {
          globPatterns: ["**/*.{html,js,css,svg,png}"], // Arquivos que o Service Worker deve cachear
        },
        manifest: {
          name: "Minha Aplicação PWA",
          short_name: "PWA",
          description: "Descrição do meu app PWA",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone", // Ou 'fullscreen', 'minimal-ui', ou 'browser'
          start_url: "/",
          icons: [
            {
              src: "/ico/favicon-16x16.png", // Caminho para os ícones
              sizes: "16x16",
              type: "image/png",
            },
            {
              src: "/ico/favicon-32x32.png", // Caminho para os ícones
              sizes: "32x32",
              type: "image/png",
            },
            {
              src: "/ico/favicon-144x144.png", // Caminho para os ícones
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/ico/favicon-152x152.png", // Caminho para os ícones
              sizes: "152x152",
              type: "image/png",
            },
            {
              src: "/ico/favicon-180x180.png", // Caminho para os ícones
              sizes: "180x180",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    define: {
      "process.env": {},
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "true",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
  });
};

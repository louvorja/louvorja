import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store/index.js'

import i18n from './i18n';
import deepAssign from 'simple-deep-assign';
import shortkey from 'vue3-shortkey';
import VueFullscreen from 'vue-fullscreen';

import { timer, formatSecond, size, nl2br } from "@/filters";

//import computed from './computed';
//import watch from './watch';

//import './plugins/vue-json-component.js';
//import './plugins/vue-fullscreen.js';
//import './plugins/vue-shortkey.js'

import './assets/dist/css/custom.css';

const Api = require("./services/Api");
const DevTools = require("./helpers/DevTools");
const Dialog = require("./helpers/Dialog");
const Locale = require("./helpers/Locale");
const Data = require("./helpers/Data");
const Sync = require("./helpers/Sync");
const System = require("./helpers/System");
const Screen = require("./helpers/Screen");

const app = createApp(
  {
    data() {
      return this.$store.state;
    },
    computed: {
      online: function () {
        return this.$store.state.data.online;
      },
    },
    watch: {
      data: {
        handler: function () {
          DevTools.write("Watcher", "data", this.data);
          this.save_data = true;
        },
        deep: true
      },
      async online() {
        Sync.start();
      },
      openpages: {
        handler: function () {
          DevTools.write("Watcher", "openpages", this.openpages);
          localStorage.openpages = JSON.stringify(this.openpages);
        },
        deep: true,
      },
      $route(to) {
        //DevTools.write("Watcher", "route", to);

        this.page = to.name;
        let route = (this.$router.options.routes.find((element) => element.name === to.name));
        let tab = (route.tab == undefined ? false : route.tab);
        this.full = (route.full == undefined ? false : route.full);

        //Verifica se tem tabs salvas em cache
        if (localStorage.openpages) {
          this.openpages = JSON.parse(localStorage.openpages)
        }

        if (tab == true) {
          if (this.openpages.find((element) => element.name === to.name) == undefined) {
            this.openpages.push(route);
          }
        }
      }
    },
    mounted() {
      //this.debug = DevTools.debug();

      this.def = JSON.parse(JSON.stringify(this.data));
      //this.def = Object.assign({}, this.data);
      var self = this;

      if (this.desktop) {

        // É UMA APLICAÇÃO DESKTOP - INICIA COMUNICAÇÃO COM A MÁQUINA
        DevTools.write("Aplicação DESKTOP")

        ipcRenderer.on('display', function (event, data) {
          self.display = data;
        });
        ipcRenderer.on('current_screen', function (event, data) {
          self.current_screen = data;
        });
        ipcRenderer.on('debug', function (event, data) {
          self.debug = data;
        });
        ipcRenderer.on('portable', function (event, data) {
          self.portable = data;
        });
        ipcRenderer.on('displays', function (event, data) {
          self.displays = data;
          Screen.register(data);
          ipcRenderer.send("print");
        });
        ipcRenderer.on('ip', (event, data) => {
          self.ip = data;
        });
        ipcRenderer.on('platform', (event, data) => {
          self.platform = data;
        });
        ipcRenderer.on('development', (event, data) => {
          self.development = data;
        });
        ipcRenderer.on('path', (event, data) => {
          self.path = data;
        });
        ipcRenderer.on('maximize', (event, data) => {
          self.maximize = data;
        });
        ipcRenderer.on('loaded', (event, data) => {
          setTimeout(function () {
            document.getElementById("preload").style.display = 'none'
          }, 1000)
          self.display = data;
        });
        ipcRenderer.on('screen', (event, active, id, route) => {
          DevTools.write("Abriu a tela?", active, id, route)
          let display = Object.assign({}, self.displays.find(item => {
            return item.id === id;
          }));

          if (active) {
            display['active'] = active;
            display['route'] = route;
            self.active_displays[display.id] = display;
          } else {
            delete self.active_displays[display.id];
          }
        });
        ipcRenderer.on('print_screen', (event, id, print) => {
          DevTools.write("Print", id)
          self.print_displays[id] = print;
        });

        // OBTEM CONFIGURAÇÕES SALVAS NA MAQUINA
        ipcRenderer.on('data', function (event, data) {
          deepAssign(self.data, data)
          self.db_port = self.data.db.port;
          DevTools.write('Obteve dados locais. Inicia conexão com o banco de dados')
          ipcRenderer.send('start_db', self.data.db.port);
        });


        ipcRenderer.on('start_db', function (event, status, port, message) {
          self.db_port = port;
          if (status == "true" || status == true) {
            DevTools.write('Conectou ao Banco de Dados')
            DevTools.write('Obtendo dados da web')
            ipcRenderer.send('config_web');
          } else {
            Dialog.error(
              'Erro ao conectar no Banco de Dados!',
              `${message}`,
              function () {
                System.close();
              }
            );
          }

        })

        ipcRenderer.on('save_data', function (event) {
          self.save_data = false;
          DevTools.write('Dados salvos!')
        });

        ipcRenderer.on('download', function (event, action, value) {
          if (action == 'size') {
            self.download.file.size = value;
            self.download.max_value = value;
          } else if (action == 'progress') {
            self.download.file.downloaded_size = value;
            self.download.value = value;
          } else if (action == 'complete') {
            self.download.file.name = '#';
            self.download.file.size = 0;
            self.download.file.downloaded_size = 0;
            DevTools.write('Download Completo!')
          }
        });


        ipcRenderer.on('config_web', async function (event, data) {
          self.config_web = data;
          let date = new Date().toISOString().split('T')[0];

          DevTools.write('Obteve dados da maquina', data, date, self.data.last_conn_server);



          //verifica se já se conectou hoje no servidor, ou se não há dados salvos na maquina
          if (!data || date != self.data.last_conn_server) {
            DevTools.write('Não se conectou ao servidor hoje');

            //Obtém configurações da web
            Api.get('configs', null, (resp, ret) => {
              if (resp) {
                DevTools.write('Obteve dados do servidor', ret);
                self.data.last_conn_server = date;
                self.config_web = ret;
                ipcRenderer.send('save_json', 'config', ret, 'filedir');

                //inicia checagem e atualização do banco de dados
                Sync.start();
              } else {
                //Não conseguiu conectar ao servidor.... vai trabalhar off-line
              }
            });

          } else {
            DevTools.write('Já se conectou ao servidor hoje');

            //inicia checagem e atualização do banco de dados
            Sync.start();
          }

        });

        if (self.$store.state.lang) {
          ipcRenderer.send('config', self.$store.state.lang);
        }


      } else {

        // NÃO É UMA APLICAÇÃO DESKTOP
        DevTools.write("Não é aplicação DESKTOP")

        this.debug = DevTools.debug();

        if (localStorage.data !== undefined) {
          var c = JSON.parse(localStorage.data);
          if (c !== '' && c !== null && c !== undefined) {
            DevTools.write("JSON", c)
            deepAssign(this.data, c)
          } else {
            Data.save();
          }
        } else {
          Data.save();
        }

        setTimeout(function () {
          document.getElementById("preload").style.display = 'none'
        }, 1000);

      }

      // CARREGA IDIOMA
      Locale.change(self.data.lang, this.$vuetify, this.$i18n);

      //SALVAR CONFIG
      setInterval(function () {
        if (self.save_data) {
          Data.save();
        }
      }, 1000);
    },
    render: () => h(App)
  }
)
  .use(store)
  .use(router)
  //.use(watch)
  .use(vuetify)
  .use(i18n)
  .use(shortkey, { prevent: ["input", "textarea"] })
  .use(VueFullscreen);
//.use(computed)
app.config.productionTip = false

app.config.globalProperties.$filters = {
  timer,
  formatSecond,
  size,
  nl2br
};

app.mount('#app')
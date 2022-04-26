import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import $ from 'jquery'

import VueSessionStorage from "vue-sessionstorage";
Vue.use(VueSessionStorage);

import './assets/dist/css/custom.css';


import computed from './computed';
import methods from './methods';
import watch from './watch';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) },
  mixins: [
    require('./mixins/data.vue')
  ],
  computed,
  watch,
  methods,
  mounted() {

    this.def = JSON.parse(JSON.stringify(this.data));
    //this.def = Object.assign({}, this.data);
    var self = this;

    if (this.desktop) {

      // É UMA APLICAÇÃO DESKTOP - INICIA COMUNICAÇÃO COM A MÁQUINA
      console.log("Aplicação DESKTOP")

      ipcRenderer.on('displays', function (event, data) {
        self.displays = data;
      });
      ipcRenderer.on('ip', (event, data) => {
        self.ip = data;
      });
      ipcRenderer.on('platform', (event, data) => {
        self.platform = data;
      });
      ipcRenderer.on('maximize', (event, data) => {
        self.maximize = data;
      });
      //ipcRenderer.on('server', (event, data) => {
      //  self.server = data;
      //});

      // OBTEM CONFIGURAÇÕES SALVAS NA MAQUINA
      ipcRenderer.on('data', function (event, data) {
        self.data = Object.assign({}, self.data, data);
        //self.mergeData(self.data, data);
        console.log('Obteve dados locais. Solicita dados da web!')
        ipcRenderer.send('config_web');
      });

      ipcRenderer.on('save_data', function (event) {
        self.save_data = false;
        console.log('Dados salvos!')
      });

      ipcRenderer.on('config_web', async function (event, data) {
        self.config_web = data;

        //checa conexão com o banco de dados
        let s = await self.getDBData();
        if (s) {
          //obtem configurações da web
          let d = await self.getApiData('config');
          if (d) {
            self.config_web = d;
            ipcRenderer.send('save_json', 'config', d, 'db');

            //inicia o processo de download e atualização do banco de dados
            console.log('Atualizando Banco de Dados')
            await self.downloadDB();
            console.log('Banco de Dados atualizado!')
          }
        }


        /*self.getApiData('config', function (d) {
          self.config_web = d;
          ipcRenderer.send('save_json', 'config', d, 'db');
          console.log("rotina de downloadddd")
          self.downloadDB();
        });*/
      });

      ipcRenderer.send('config');


    } else {

      // NÃO É UMA APLICAÇÃO DESKTOP
      console.log("Não é aplicação DESKTOP")

      if (localStorage.data !== undefined) {
        var c = JSON.parse(localStorage.data);
        if (c !== '' && c !== null && c !== undefined) {
          console.log("JSON", c)
          this.data = Object.assign({}, this.data, c);
          //this.mergeData(this.data, c);
        } else {
          this.saveData();
        }
      } else {
        this.saveData();
      }

    }

    //SALVAR CONFIG
    setInterval(function () {
      if (self.save_data) {
        self.saveData();
      }
    }, 1000);

    setTimeout(function () {
      $("#preload").hide();
    }, 1000);

  }
}).$mount('#app')

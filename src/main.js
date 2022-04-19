import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import $ from 'jquery'

import VueSessionStorage from "vue-sessionstorage";
Vue.use(VueSessionStorage);


import './assets/dist/css/custom.css';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) },
  data() {
    return {
      desktop: (typeof (desktop) !== 'undefined' ? desktop : false),
      config_web: null,

      displays: [],
      ip: '',
      //server: {status: false},
      platform: '',
      maximize: true,
      //monitor: 0,

      progress: {
        active: false,
        value: 0,
        text: ''
      },

      data: {
        db: {},
        downloads: {
          albuns: [],
          musicas: [],
          baixados: {
            albuns: [],
            musicas: [],
          }
        },
        fav: [],
        layout: { id: 1, color: '#29569b', dark: false },
        cronometro: {
          text: { fontSize: 14, color: '#000000FF', positionV: 'center', positionH: 'center', cssContent: false, css: '' },
          bg: { color: '#FFFFFFFF', file: {}, position: 'center center', cssContent: false, css: '' },
          mask: ['m', 'n']
        },
      },
      def: {},

      content: { cronometro: 0, cronometro_list: [] },
      sidebar: { geral: false, cronometro: false },

      save_data: false,
      openpages: [],
      page: '',
      show_arrows: true,
      active_header_tab: null,
      tabs_dot: [],
      dialog: {
        show: false,
        title: '',
        text: '',
        buttons: [],
        value: ''
      },
      alert: {
        show: false,
        text: null,
        type: '',
        timeout: 5000,
      }
    }
  },
  computed: {
    baixar: function () {
      return {
        albuns: this.data.downloads.albuns.filter((o) => this.data.downloads.baixados.albuns.indexOf(o) === -1),
        musicas: this.data.downloads.musicas.filter((o) => this.data.downloads.baixados.musicas.indexOf(o) === -1)
      };
    },
  },
  watch: {
    data: {
      handler: function () {
        this.save_data = true;
      },
      deep: true
    },
    show_arrows: function () {
      if (this.show_arrows == false) {
        var self = this;
        setTimeout(function () { self.show_arrows = true; }, 10);
      }
    },
    progress: {
      handler: function () {
        if (!this.progress.active) {
          this.progress.value = -1;
          this.progress.text = '';
        }
      },
      deep: true
    },
    $route(to) {
      var self = this;
      this.page = to.name;
      this.show_arrows = false;
      var route = (this.$router.options.routes.find((element) => element.name === to.name));
      var tab = (route.tab == undefined ? false : route.tab);
      if (tab == true) {
        if (this.openpages.find((element) => element.name === to.name) == undefined) {
          this.openpages.push(route);
        }
      }
      setTimeout(function () {
        if ($(".active_header_tab").length > 0) {
          var indx = $(".active_header_tab").first().attr("data-id");
          self.active_header_tab = parseInt(indx);
        }
      }, 10)
    }
  },

  methods: {
    saveData: function () {
      if (this.desktop) {
        // SE FOR APLICAÇÃO DESKTOP, SALVA AS CONFIGURAÇÕES NA MAQUINA DO USUARIO
        ipcRenderer.send('save_data', this.data);
        console.log("salvando");
      }

      // SEMPRE SALVA AS CONFIGURAÇÕES TBM EM LOCALSTORAGE
      localStorage.data = JSON.stringify(this.data);
      this.save_data = false;
    },
    restoreData: function ($var) {
      var clone = JSON.parse(JSON.stringify(this.def));
      eval("this.data." + $var + " = clone." + $var);
    },
    restoreFormatacao: function ($var) {
      this.dialog.show = true;
      this.dialog.title = "Restaurar formatação";
      this.dialog.text = "A formatação será restaurada para o padrão do programa. Esta opção não pode ser desfeita!";
      this.dialog.buttons = [{ text: "Cancelar", color: "red", value: "cancel" }, { text: "Restaurar", value: "ok" }];
      this.dialog.value = '';

      var self = this;
      var tmr = setInterval(function () {
        if (!self.dialog.show) {
          clearInterval(tmr);
          if (self.dialog.value == "ok") {
            self.restoreData($var);
          }
        }
      }, 100);
    },
    mergeData: function ($ori, $adic) {
      for (var prop in $adic) {
        if (!isNaN(prop)) {
          eval("$ori[" + prop + "]=$adic[" + prop + "]");
        } else if (typeof (eval("$adic." + prop)) == "object") {
          if (eval("$ori." + prop + "==undefined")) {
            eval("$ori." + prop + "={}");
          }
          this.mergeData(eval("$ori." + prop), eval("$adic." + prop));
        } else {
          eval("$ori." + prop + "=$adic." + prop);
        }
      }
    },
    /*openWindow: function(route){
      if (this.desktop){
        var d = [];
        d["route"] = "#/popup/"+route;
        ipcRenderer.send('action','openWindow',d);
      }else{
        alert('f');
      }
    },*/
    send: function (acao, param) {
      ipcRenderer.send(acao);
    },
    getData: async function (url) {
      if (this.desktop) {
        let data = await this.getDBData(url);
        return data.model;
      } else {
        let data = await this.getApiData(url);
        return data;
      }
    },
    getApiData: async function (url, query_param, filtros) {
      query_param = query_param || ''
      filtros = filtros || []
      url = 'https://api.louvorja.com.br/pt/' + url + '?token=fa7fef35-3bf4-4810-8a71-520e89eb00b5&' + query_param
      console.log('getApiData', url, filtros)
      let response = await fetch(url,
        {
          method: 'post',
          body: new URLSearchParams({
            filtros: JSON.stringify(filtros),
          })
        }
      ).catch(err => {
        this.msgAlert("erro", "Erro ao estabelecer conexão com o servidor!")
        console.log(err)
        return false;
      });
      if (response.ok) {
        let data = await response.json();
        if (data.erro != undefined && data.erro != '') {
          this.msgAlert("erro", "Erro ao obter dados do servidor: " + data.erro)
          return false;
        }
        //console.log('getApiData',data,filtros);
        return data;
      } else {
        return false;
      }
    },
    getDBData: async function (url) {
      url = url || '';
      //this.progress.text = 'Conectando ao banco de dados...';
      //this.progress.value = -1;
      //this.progress.active = true;
      var url = 'http://localhost:3000/' + url;
      console.log('getDBData', url)
      let response = await fetch(url,
        {
          method: 'post',
          body: new URLSearchParams({
            lang: 'pt',
          })
        }
      ).catch(err => {
        this.msgAlert("erro", "Erro ao estabelecer conexão com o banco de dados!")
        console.log(err)
        return false;
      });
      //this.progress.active = false;
      if (response.ok) {
        let data = await response.json();
        if (data.erro != undefined && data.erro != '') {
          this.msgAlert("erro", "Erro ao obter dados do banco de dados: " + data.erro)
          return false;
        }
        console.log('getDBData', data);
        return data;
      } else {
        return false;
      }
    },
    sendDBData: async function (u, data) {
      var url = 'http://localhost:3000/' + u;
      console.log('sendDBData', url)
      let response = await fetch(url,
        {
          method: 'post',
          body: new URLSearchParams({
            data,
          })
        }
      ).catch(err => {
        this.msgAlert("erro", "Erro ao estabelecer conexão com o banco de dados!")
        console.log(err)
        return false;
      });
      if (response.ok) {
        let data = await response.json();
        if (!data.status) {
          this.msgAlert("erro", "Erro ao inserir dados no banco de dados: " + data.error)
          return false;
        }
        console.log('sendDBData', data);
        return data;
      } else {
        return false;
      }
    },
    downloadDB: async function () {
      console.log("Rotina de Download do Banco de Dados")
      this.progress.text = 'Baixando dados do servidor...';
      this.progress.value = -1;
      this.progress.active = true;

      var self = this;
      for (var item in self.config_web.db) {
        var db = self.config_web.db[item];
        if (db.processado !== true && db.download == true) {
          db.processado = true;
          if (self.data.db[item] == undefined || self.data.db[item] !== db.versao) {
            // SOLICITA DADOS DA WEB
            var urlapi = db.url || item;
            console.log("DB", item, self.data.db[item], db)
            console.log('URL', urlapi)

            let data = await self.getApiData(urlapi, db.get_param, this.data.downloads.baixados);
            if (data.sql !== undefined) {
              var t_url = 'sql';
              var t_data = data.sql;
            } else {
              var t_url = item;
              var t_data = data;
            }
            let sql_arr = t_data.split(';');
            //console.log('Lista SQL',sql_arr);
            for (var indx in sql_arr) {
              var sql = sql_arr[indx];
              let ret = await this.sendDBData(t_url, sql);
              if (ret == false){
                this.progress.active = false;
                console.log('SQL: ',sql);
                return;
              }
            }
            self.data.db[item] = db.versao;
            self.save_data = true;
          } else {
            console.log("DB Não processado ", item)
          }
        }
      }

      this.progress.active = false;
    },
    msgAlert: function (type, msg) {
      console.error('Erro do Sistema: ', type, ' - ', msg);
      if (this.alert.show && this.alert.type === type) {
        if (typeof this.alert.text === 'string') {
          this.alert.text = [this.alert.text];
        }
        this.alert.timeout += 5000;
        this.alert.text.push(msg);
      } else {
        this.alert.show = true;
        this.alert.text = msg;
        this.alert.type = type;
        this.alert.timeout = 5000;
      }
    },
  },
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

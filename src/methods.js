export default {
    console() {
        if (this.debug) {
            console.log(...Array.from(arguments), " << ")
        }
    },
    changeLocale: function (lang) {
        this.$vuetify.lang.current = lang;
        this.$i18n.locale = lang;
        this.data.lang = lang;
        let lang_tag = lang;
        if (lang == "pt") {
            lang_tag = "pt-BR";
        }
        document.documentElement.setAttribute('lang', lang_tag)
        this.console("idioma selecionado", lang);
    },
    flag: function (lang) {
        if (lang === "pt") {
            return "br";
        } else {
            return lang;
        }
    },
    dir: function (dir) {
        if (this.desktop) {
            dir = dir.replaceAll("/", "\\");
            dir = dir.replaceAll("\\\\", "\\");
        } else {
            dir = dir.replaceAll("\\", "/");
            dir = dir.replaceAll("//", "/");
            dir = dir.replaceAll(":/", "://");
        }
        return dir;
    },
    saveData: function () {
        if (this.desktop) {
            // SE FOR APLICAÇÃO DESKTOP, SALVA AS CONFIGURAÇÕES NA MAQUINA DO USUARIO
            ipcRenderer.send('save_data', this.data);
            this.console("salvando");
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
        this.dialog.buttons = [{ text: "Cancelar", color: "error", value: "cancel" }, { text: "Restaurar", color: "info", value: "ok" }];
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
    /*mergeData: function ($ori, $adic) {
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
    },*/
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
    getData: async function (url, options = {}) {
        if (this.desktop) {
            let data = await this.getDBData(url);
            return data;
        } else {
            let data = await this.getApiData(url, options);
            return data;
        }
    },
    getApiData: async function (url, options = {}) {
        let baseurl = "";
        if (window.location.hostname == "localhost") {
            baseurl = "http://localhost:8000";
        } else {
            baseurl = "https://api.louvorja.com.br";
        }
        let params = "";
        if (options.params) {
            params = `?${this.encodeDataToURL(options.params)}`;
        }
        url = `${baseurl}/${this.data.lang}/${url}${params}`
        this.console('getApiData', url, options)
        let response = await fetch(url,
            {
                method: 'get',
                headers: {
                    'Api-Token': '02@v2nFB2Dc'
                },
            }
        ).catch(err => {
            this.msgAlert("erro", "Erro ao estabelecer conexão com o servidor!")
            this.console('%c' + err, 'color:red')
            return false;
        });
        if (response.ok) {
            let data = await response.json();
            if (data.error != undefined && data.erro != '') {
                this.msgAlert("erro", "Erro ao obter dados do servidor: " + data.error)
                return false;
            }
            //this.console('getApiData', data.data);
            return data.data;
        } else {
            let data = await response.json();
            this.msgAlert("erro", "Erro ao obter dados do servidor: " + data.error)
            return false;
        }
    },
    getDBData: async function (url) {
        url = url || '';
        //this.progress.text = 'Conectando ao banco de dados...';
        //this.progress.value = -1;
        //this.progress.show = true;
        var url = `http://localhost:${this.$root.db_port}/${url}`;
        this.console('getDBData', url)
        let response = await fetch(url,
            {
                method: 'post',
                body: new URLSearchParams({
                    lang: 'pt',
                })
            }
        ).catch(err => {
            this.msgAlert("erro", "Erro ao estabelecer conexão com o banco de dados!")
            this.console('%c' + err, 'color:red')
            return false;
        });
        //this.progress.show = false;
        if (response.ok) {
            let data = await response.json();
            if (data.erro != undefined && data.erro != '') {
                this.msgAlert("erro", "Erro ao obter dados do banco de dados: " + data.erro)
                return false;
            }
            this.console('getDBData', data);
            return data;
        } else {
            return false;
        }
    },
    sendDBData: async function (u, data) {
        var url = `http://localhost:${this.$root.db_port}/${u}`;
        this.console('sendDBData', url)
        let response = await fetch(url,
            {
                method: 'post',
                body: new URLSearchParams({
                    data,
                })
            }
        ).catch(err => {
            this.msgAlert("erro", "Erro ao estabelecer conexão com o banco de dados!")
            this.console('%c' + err, 'color:red')
            return false;
        });
        if (response.ok) {
            let data = await response.json();
            if (!data.status) {
                this.msgAlert("erro", "Erro ao inserir dados no banco de dados: " + data.error)
                return false;
            }
            this.console('sendDBData', data);
            return data;
        } else {
            return false;
        }
    },
    downloadDB: async function (filtros) {
        this.console("Rotina de Download do Banco de Dados")
        this.progress.text = 'Baixando dados do servidor...';
        this.progress.value = -1;
        this.progress.show = true;

        var self = this;
        for (var item in self.config_web.db) {
            var db = self.config_web.db[item];
            if (db.download == true && (db.processado !== true || filtros && db.tipo == 'dml')) {
                db.processado = true;
                if (self.data.db[item] == undefined || self.data.db[item] !== db.versao || filtros) {
                    let filtro = filtros || Object.assign({}, this.data.downloads.baixados, { datahora: self.data.db[item] });
                    // SOLICITA DADOS DA WEB
                    var urlapi = db.url || item;
                    this.console("%cDownload banco de dados", "color:orange")
                    this.console("DB", item, self.data.db[item], db)
                    this.console('URL', urlapi)
                    this.console('FILTROS', filtro)

                    let data = await self.getApiData(urlapi, db.get_param, filtro);
                    if (data.sql !== undefined) {
                        var t_url = 'sql';
                        var t_data = data.sql;
                    } else {
                        var t_url = item;
                        var t_data = data;
                    }
                    let sql_arr = t_data.split(';');
                    //this.console('Lista SQL',sql_arr);
                    for (var indx in sql_arr) {
                        var sql = sql_arr[indx];
                        let ret = await this.sendDBData(t_url, sql);
                        if (ret == false) {
                            this.progress.show = false;
                            this.console('%c' + sql, 'color:yellow');
                            return;
                        }
                    }
                    self.data.db[item] = db.versao;
                    self.save_data = true;

                    this.console("%cFim download do banco de dados", "color:orange")
                } else {
                    this.console("DB Não processado ", item)
                }
            }
        }

        this.progress.show = false;
    },
    checkDownloads: async function () {
        if (this.progress.show) {
            this.console('%cFila de Downloads ocupada!', 'color:red')
            return false;
        }
        this.console('%cVerificando Downloads na fila', 'color:blue')
        this.console('%cFila de dowloads', 'color:green', this.baixar)

        let baixar = [];
        if (this.baixar.albuns.length > 0) {
            baixar = { albuns: [this.baixar.albuns[0]] };
            this.console('Processando fila', baixar, this.baixar)
            await this.downloadDB(baixar)

            this.data.downloads.baixados.albuns.push(this.baixar.albuns[0]);
            this.console('%cFila processada - checa se fila possui novos dados', 'color:blue')
            this.checkDownloads();
            return;
        }

        this.console('%cFila processada', 'color:blue')
    },
    msgAlert: function (type, msg) {
        this.console('%cErro do Sistema: ' + type + ' - ' + msg, 'color:red');
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

    toSeconds: function (hms) {
        if (hms == undefined) {
            return 0;
        } else {
            let a = hms.split(":");
            return +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
        }
    },

    openMusic: async function (obj, options = {}) {
        let id_music = obj;
        this.$root.media.album = '';
        this.$root.media.track = 0;
        if (typeof (obj) === "object") {
            id_music = obj.id_music;
            this.$root.media.album = obj.album || '';
            this.$root.media.track = obj.track || 0;
        }
        this.$root.media.audio = (options.audio || 0);
        /*
        options.audio:
        0 = sem audio
        1 = cantado
        2 = playback
        */

        var audio = document.getElementById('slide-audio');
        if (audio.duration > 0) {
            audio.pause();
            audio.currentTime = 0;
        }

        this.$root.media.show = true;
        this.$root.media.loading = true;
        this.$root.media.slide = 0;
        this.$root.media.id_music = id_music;
        let data = await this.$root.getData(`music/${id_music}`);
        if (this.$root.media.audio == 1) {
            this.$root.media.file = data.url_music;
            data.lyric.map(item => { item.time = this.toSeconds(item.time) || 0 });
            this.console(data.lyric);
        } else if (this.$root.media.audio == 2) {
            this.console(data);
            this.$root.media.file = data.url_instrumental_music;
            data.lyric.map(item => { item.time = this.toSeconds(item.instrumental_time) || this.toSeconds(item.time) || 0 });
        } else {
            this.$root.media.file = "";
        }
        this.$root.media.music = data;
        this.$root.media.loading = false;

        if (audio.duration > 0 && audio.paused && this.$root.media.file !== "") {
            audio.play();
        }
    },
    openPlayer: async function (obj, options = {}) {
        let id_music = obj;
        this.$root.player.album = '';
        this.$root.player.track = 0;
        if (typeof (obj) === "object") {
            id_music = obj.id_music;
            this.$root.player.album = obj.album || '';
            this.$root.player.track = obj.track || 0;
        }
        this.$root.player.audio = (options.audio || 0);
        /*
        options.audio:
        1 = cantado
        2 = playback
        */

        var audio = document.getElementById('player-media');
        if (audio.duration > 0) {
            audio.pause();
            audio.currentTime = 0;
        }

        this.$root.player.show = true;
        this.$root.player.loading = true;
        this.$root.player.id_music = id_music;
        let data = await this.$root.getData(`music/${id_music}`);
        if (this.$root.player.audio == 1) {
            this.$root.player.file = data.url_music;
        } else if (this.$root.player.audio == 2) {
            this.$root.player.file = data.url_instrumental_music;
        } else {
            this.$root.player.file = "";
        }
        this.$root.player.name = data.name;
        this.$root.player.music = data;
        this.$root.player.loading = false;

        if (audio.duration > 0 && audio.paused && this.$root.player.file !== "") {
            audio.play();
        }
    },
    openLyricMusic: async function (obj) {
        let id_music = obj;
        this.console(obj);
        this.$root.lyric.album = '';
        this.$root.lyric.track = 0;
        if (typeof (obj) === "object") {
            id_music = obj.id_music;
            this.$root.lyric.album = obj.album || '';
            this.$root.lyric.track = obj.track || 0;
        }
        this.$root.lyric.show = true;
        this.$root.lyric.loading = true;
        let data = await this.$root.getData(`music/${id_music}`);
        this.$root.lyric.music = data;
        this.$root.lyric.loading = false;
    },


    encodeDataToURL: function (data) {
        return Object
            .keys(data)
            .map(value => `${value}=${encodeURIComponent(data[value])}`)
            .join('&');
    }
}
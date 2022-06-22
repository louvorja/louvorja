export default {
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
    getData: async function (url) {
        if (this.desktop) {
            let data = await this.getDBData(url);
            return data;
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
            console.log('%c' + err, 'color:red')
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
        //this.progress.show = true;
        var url = `http://localhost:${this.$root.db_port}/${url}`;
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
            console.log('%c' + err, 'color:red')
            return false;
        });
        //this.progress.show = false;
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
        var url = `http://localhost:${this.$root.db_port}/${u}`;
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
            console.log('%c' + err, 'color:red')
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
    downloadDB: async function (filtros) {
        console.log("Rotina de Download do Banco de Dados")
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
                    console.log("%cDownload banco de dados", "color:orange")
                    console.log("DB", item, self.data.db[item], db)
                    console.log('URL', urlapi)
                    console.log('FILTROS', filtro)

                    let data = await self.getApiData(urlapi, db.get_param, filtro);
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
                        if (ret == false) {
                            this.progress.show = false;
                            console.log('%c' + sql, 'color:yellow');
                            return;
                        }
                    }
                    self.data.db[item] = db.versao;
                    self.save_data = true;

                    console.log("%cFim download do banco de dados", "color:orange")
                } else {
                    console.log("DB Não processado ", item)
                }
            }
        }

        this.progress.show = false;
    },
    checkDownloads: async function () {
        if (this.progress.show) {
            console.log('%cFila de Downloads ocupada!', 'color:red')
            return false;
        }
        console.log('%cVerificando Downloads na fila', 'color:blue')
        console.log('%cFila de dowloads', 'color:green', this.baixar)

        let baixar = [];
        if (this.baixar.albuns.length > 0) {
            baixar = { albuns: [this.baixar.albuns[0]] };
            console.log('Processando fila', baixar, this.baixar)
            await this.downloadDB(baixar)

            this.data.downloads.baixados.albuns.push(this.baixar.albuns[0]);
            console.log('%cFila processada - checa se fila possui novos dados', 'color:blue')
            this.checkDownloads();
            return;
        }

        console.log('%cFila processada', 'color:blue')
    },
    msgAlert: function (type, msg) {
        console.log('%cErro do Sistema: ' + type + ' - ' + msg, 'color:red');
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

    openMusic: async function (obj, options = {}) {
        let id_musica = obj;
        this.$root.media.album = '';
        this.$root.media.faixa = 0;
        if (typeof (obj) === "object") {
            id_musica = obj.id_musica;
            this.$root.media.album = obj.album || '';
            this.$root.media.faixa = obj.faixa || 0;
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
        this.$root.media.id_musica = id_musica;
        let data = await this.$root.getData(`musica/${id_musica}`);
        if (this.$root.media.audio == 1) {
            this.$root.media.file = data.arquivo;
            data.letra.map(item => { item.time = item.tempo || 0 });
        } else if (this.$root.media.audio == 2) {
            this.$root.media.file = data.arquivo_pb;
            data.letra.map(item => { item.time = item.tempo_pb || item.tempo || 0 });
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
        let id_musica = obj;
        this.$root.player.album = '';
        this.$root.player.faixa = 0;
        if (typeof (obj) === "object") {
            id_musica = obj.id_musica;
            this.$root.player.album = obj.album || '';
            this.$root.player.faixa = obj.faixa || 0;
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
        this.$root.player.id_musica = id_musica;
        let data = await this.$root.getData(`musica/${id_musica}`);
        if (this.$root.player.audio == 1) {
            this.$root.player.file = data.arquivo;
        } else if (this.$root.player.audio == 2) {
            this.$root.player.file = data.arquivo_pb;
        } else {
            this.$root.player.file = "";
        }
        this.$root.player.titulo = data.titulo;
        this.$root.player.music = data;
        this.$root.player.loading = false;

        if (audio.duration > 0 && audio.paused && this.$root.player.file !== "") {
            audio.play();
        }
    },
    openLetterMusic: async function (obj) {
        let id_musica = obj;
        this.$root.letter.album = '';
        this.$root.letter.faixa = 0;
        if (typeof (obj) === "object") {
            id_musica = obj.id_musica;
            this.$root.letter.album = obj.album || '';
            this.$root.letter.faixa = obj.faixa || 0;
        }
        this.$root.letter.show = true;
        this.$root.letter.loading = true;
        let data = await this.$root.getData(`musica/${id_musica}`);
        this.$root.letter.music = data;
        this.$root.letter.loading = false;
    },
}
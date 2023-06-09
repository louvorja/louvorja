<template>
  <div>
    <v-card :rounded="0" theme="dark">
      <span class="text-caption ml-2">Ferramentas do Desenvolvedor</span>
    </v-card>
    <v-card :rounded="0" theme="dark">
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            size="x-small"
            variant="text"
            prepend-icon="mdi-download"
            @click="sync()"
            v-bind="props"
          >
            Sincronizar
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            :prepend-icon="
              $store.state.download.show
                ? 'mdi-checkbox-outline'
                : 'mdi-checkbox-blank-outline'
            "
            @click="btSync()"
          >
            Exibir Botão de Download
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        size="x-small"
        variant="text"
        prepend-icon="mdi-tools"
        @click="showDevTools()"
      >
        DevTools
      </v-btn>

      <v-btn
        size="x-small"
        variant="text"
        prepend-icon="mdi-remote-desktop"
        :color="$store.state.desktop ? 'primary' : ''"
        @click="isDesktop()"
      >
        Desktop
      </v-btn>

      <v-btn
        size="x-small"
        variant="text"
        prepend-icon="mdi-theme-light-dark"
        :color="$store.state.data.layout.dark ? 'primary' : ''"
        @click="isDark()"
      >
        Tema Dark
      </v-btn>

      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            size="x-small"
            variant="text"
            prepend-icon="mdi-alert-box-outline"
            @click="dialog('ok')"
            v-bind="props"
          >
            Diálogos
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="dialog('ok')"> Ok </v-list-item>
          <v-list-item @click="dialog('error')"> Erro </v-list-item>
          <v-list-item @click="dialog('yesno')"> Sim/Não </v-list-item>
        </v-list>
      </v-menu>

      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn
            size="x-small"
            variant="text"
            prepend-icon="mdi-information-outline"
            @click="alert('info')"
            v-bind="props"
          >
            Alertas
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="alert('info')"> Informação </v-list-item>
          <v-list-item @click="alert('error')"> Erro </v-list-item>
          <v-list-item @click="alert('warning')"> Aviso </v-list-item>
          <v-list-item @click="alert('success')"> Sucesso </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        size="x-small"
        variant="text"
        prepend-icon="mdi-briefcase-download"
        :color="$store.state.store.show ? 'primary' : ''"
        @click="showStore()"
      >
        Loja
      </v-btn>

      <v-btn
        v-for="display in $store.state.displays"
        :key="display.id"
        size="x-small"
        variant="text"
        prepend-icon="mdi-briefcase-download"
        :color="$store.state.active_displays[display.id] ? 'warning' : ''"
        @click="openMonitor(display, 'screen/media')"
      >
        {{ display.id }}|{{ display.label }}
      </v-btn>

      <v-btn
        v-for="display in $store.state.displays"
        :key="display.id"
        size="x-small"
        variant="text"
        prepend-icon="mdi-briefcase-download"
        :color="$store.state.active_displays[display.id] ? 'warning' : ''"
        @click="openMonitor(display, 'screen')"
      >
        OUTRA ROTA|{{ display.label }}
      </v-btn>

      <v-btn
        v-for="display in $store.state.displays"
        :key="display.id"
        size="x-small"
        variant="text"
        prepend-icon="mdi-briefcase-download"
        :color="$store.state.active_displays[display.id] ? 'warning' : ''"
        @click="closeMonitor(display)"
      >
        FECHAR|{{ display.label }}
      </v-btn>

      <v-btn
        size="x-small"
        variant="text"
        prepend-icon="mdi-briefcase-download"
        @click="sendMessage()"
      >
        sendMessage
      </v-btn>

      <v-spacer />
    </v-card>
  </div>
</template>

<script>
export default {
  methods: {
    sync: function () {
      const Sync = require("../helpers/Sync");
      Sync.start();
    },
    btSync: function () {
      this.$store.state.download.title = "Baixando Arquivo";
      this.$store.state.download.subtitle = "arquivo.teste";
      this.$store.state.download.file.name = "arquivo.teste";
      this.$store.state.download.file.qt_downloaded = 1;
      this.$store.state.download.file.qt_remaining = 1000;
      this.$store.state.download.file.size = 300;
      this.$store.state.download.file.downloaded_size = 0;
      this.$store.state.download.show = !this.$store.state.download.show;
      this.$store.state.download.max_value = 100;
      this.$store.state.download.value = 0;

      let self = this;
      let tmr_sync = setInterval(function () {
        if (self.$store.state.download.value >= 100) {
          self.$store.state.download.max_value = 0;
        }
        if (self.$store.state.download.value >= 150) {
          self.$store.state.download.max_value = 100;
          self.$store.state.download.value = 0;
          self.$store.state.download.file.qt_downloaded++;
          self.$store.state.download.file.qt_remaining--;
          self.$store.state.download.file.downloaded_size = 0;
        }
        self.$store.state.download.file.downloaded_size++;
        self.$store.state.download.value++;
        if (!self.$store.state.download.show) {
          clearInterval(tmr_sync);
        }
      }, 100);
    },
    showDevTools: function () {
      ipcRenderer.send("devtools");
    },
    isDesktop: function () {
      this.$store.state.desktop = !this.$store.state.desktop;
    },
    isDark: function () {
      this.$store.state.data.layout.dark = !this.$store.state.data.layout.dark;
      if (this.$store.state.data.layout.dark) {
        this.$store.state.data.layout.color = "#2e2e2e";
        this.$store.state.data.layout.id = 7;
      } else {
        this.$store.state.data.layout.color = "#29569b";
        this.$store.state.data.layout.id = 1;
      }
    },
    dialog: function (type) {
      const Dialog = require("@/helpers/Dialog");
      const Alert = require("@/helpers/Alert");
      let title = "Título";
      let message = "Mensagem da caixa de diálogo";
      if (type == "yesno") {
        Dialog.yesno(title, message, (resp) => {
          Alert.info(`Clicou no botão: ${resp}`);
        });
      } else if (type == "error") {
        Dialog.error(title, message, (resp) => {
          Alert.info(`Clicou no botão: ${resp}`);
        });
      } else {
        Dialog.ok(title, message, (resp) => {
          Alert.info(`Clicou no botão: ${resp}`);
        });
      }
    },
    alert: function (type) {
      const Alert = require("@/helpers/Alert");
      let message = "Mensagem do alerta";
      if (type == "error") {
        Alert.error(message);
      } else if (type == "warning") {
        Alert.warning(message);
      } else if (type == "success") {
        Alert.success(message);
      } else {
        Alert.info(message);
      }
    },
    showStore: function () {
      this.$store.state.store.show = true;
    },
    openMonitor: function (display, route) {
      const Screen = require("@/helpers/Screen");
      Screen.create(display.id, route);
    },
    closeMonitor: function (display, route) {
      const Screen = require("@/helpers/Screen");
      Screen.close(display.id);
    },
    sendMessage: function () {
      const Screen = require("@/helpers/Screen");
      Screen.send("media", this.$store.state.media);
    },
  },
};
</script>

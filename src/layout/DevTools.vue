<template>
  <div>
    <v-system-bar dark>
      <span class="text-caption">Ferramentas do Desenvolvedor</span>
    </v-system-bar>
    <v-system-bar dark>
      <v-btn x-small text @click="sync()">
        <v-icon>mdi-download</v-icon>
        Sincronizar
      </v-btn>
      <v-divider vertical />
      <v-btn x-small text @click="btSync()">
        <v-icon>mdi-download</v-icon>
        Bt. Download
      </v-btn>
      <v-divider vertical />
      <v-btn x-small text @click="showDevTools()">
        <v-icon>mdi-tools</v-icon>
        DevTools
      </v-btn>
      <v-divider vertical />
      <v-btn
        x-small
        text
        :color="$store.state.desktop ? 'primary' : ''"
        @click="isDesktop()"
      >
        <v-icon>mdi-remote-desktop</v-icon>
        Desktop
      </v-btn>
      <v-divider vertical />
    </v-system-bar>
  </div>
</template>

<script>
const Sync = require("../helpers/Sync");

export default {
  methods: {
    sync: function () {
      Sync.start();
    },
    btSync: function () {
      this.$store.state.download.show = !this.$store.state.download.show;
      this.$store.state.download.max_value = 0;
      this.$store.state.download.value = 0;
    },
    showDevTools: function () {
      ipcRenderer.send("devtools");
    },
    isDesktop: function () {
      console.log(this.$store.state.desktop);
      this.$store.state.desktop = !this.$store.state.desktop;
      console.log(this.$store.state.desktop);
    },
  },
};
</script>

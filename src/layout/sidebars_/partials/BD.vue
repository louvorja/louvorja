<template>
  <div>
    <div class="px-2">
      <h4>Reprocessar Banco de Dados</h4>
      <small>
        Use essa opção caso seu banco de dados esteja com falhas, ou
        aparentemente corrompido. Esta opção irá atualizar todos os dados do seu
        banco de dados. Necessário conexão com a internet.
      </small>
      <v-btn block color="info" @click="reprocessaBD">Reprocessar</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    reprocessaBD: function (skin) {
      this.$root.dialog.show = true;
      this.$root.dialog.title = "Reprocessar Banco de Dados?";
      this.$root.dialog.text =
        "O banco de dados será atualizado! Necessário conexão com a internet.";
      this.$root.dialog.buttons = [
        { text: "Cancelar", color: "error", value: "cancel" },
        { text: "Restaurar", color: "info", value: "ok" },
      ];
      this.$root.dialog.value = "";

      var self = this.$root;
      var tmr = setInterval(function () {
        if (!self.dialog.show) {
          clearInterval(tmr);
          if (self.dialog.value == "ok") {
            self.data.db = {};
            ipcRenderer.send('config_web');
          }
        }
      }, 100);
    },
  },
};
</script>
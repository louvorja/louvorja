<template>
  <div>
    <v-alert
      v-if="$store.state.data.online"
      class="mx-2"
      type="warning"
      text="Você está usando o banco de dados on-line. Altere para o modo off-line para mais opções!"
    />
    <v-btn
      class="ma-2"
      variant="flat"
      :prepend-icon="
        !$store.state.data.online ? 'mdi-cloud' : 'mdi-cloud-cancel-outline'
      "
      :color="!$store.state.data.online ? 'info' : 'grey-lighten-3'"
      @click="chageOnline()"
    >
      <span v-if="$store.state.data.online">Usar banco de dados local</span>
      <span v-else>Usar banco de dados on-line</span>
    </v-btn>

    <div class="pa-2" v-if="!$store.state.data.online">
      <h4>Resetar Banco de Dados</h4>
      <small>
        Esta opção ajuda a corrigir falhas ou dados corrompidos em seu banco de
        dados. Resetar o banco de dados fará com que o programa apague todo o
        seu banco de dados, e baixe novamente da internet. Necessário conexão
        com a internet. Alguns recursos do programa podem deixar de funcionar
        durante o processo.
      </small>
      <v-btn block color="info" @click="resetDB">Reprocessar</v-btn>
    </div>
  </div>
</template>

<script>
const Dialog = require("@/helpers/Dialog");
const Sync = require("@/helpers/Sync");
const System = require("@/helpers/System");

export default {
  methods: {
    chageOnline: function () {
      System.changeOnline();
    },
    resetDB: function () {
      Dialog.yesno(
        "Atenção",
        `Todos os dados do seu banco de dados serão apagados, e novamente baixados.
        <br>Esta opção exige conexão com a internet.
        <br>Seus arquivos baixados não serão afetados.
        <br>Alguns recursos do programa podem deixar de funcionar durante o processo.
        <br>
        <br>Deseja realmente continuar?
        `,
        (resp) => {
          if (resp == "yes") {
            Sync.reset_database();
          }
        }
      );
    },
  },
};
</script>
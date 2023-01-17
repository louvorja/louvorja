<template>
  <div>
    <div class="px-2">
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

export default {
  methods: {
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
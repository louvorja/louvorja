<template>
  <v-dialog v-model="letter.show" width="500px">
    <v-card>
      <v-layout column fill-height style="max-height: 90vh">
        <div class="flex-grow-0">
          <v-card-title>
            <v-skeleton-loader v-if="letter.loading" width="100%" type="heading"></v-skeleton-loader>
            <span v-else>{{letter.music.titulo}}</span>
          </v-card-title>
          <v-card-subtitle v-if="!letter.loading && letter.album">
            <span>{{letter.album}}</span>
            <span v-if="letter.faixa"> | faixa {{ letter.faixa }}</span>
          </v-card-subtitle>
        </div>
        <div class="flex-grow-1 px-4 pb-4" style="overflow: auto; flex: auto">
          <v-skeleton-loader v-if="letter.loading" type="text@5"></v-skeleton-loader>
          <div v-else>
            <div v-for="item in letter.music.letra" :key="item.id_letra">
              {{item.letra}}&nbsp;
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="closeLetter()">Fechar</v-btn>
          </v-card-actions>
        </div>
      </v-layout>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  data() {
    return {};
  },
  computed: {
    letter: function () {
      return this.$root.letter;
    },
  },
  methods: {
    closeLetter: function () {
      this.letter.show = false;
    },
  },
};
</script>
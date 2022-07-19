<template>
  <v-dialog v-model="lyric.show" width="500px">
    <v-card>
      <v-layout column fill-height style="max-height: 90vh">
        <div class="flex-grow-0">
          <v-card-title>
            <v-skeleton-loader v-if="lyric.loading" width="100%" type="heading"></v-skeleton-loader>
            <span v-else>{{lyric.music.titulo}}</span>
          </v-card-title>
          <v-card-subtitle v-if="!lyric.loading && lyric.album">
            <span>{{lyric.album}}</span>
            <span v-if="lyric.track"> | faixa {{ lyric.track }}</span>
          </v-card-subtitle>
        </div>
        <div class="flex-grow-1 px-4 pb-4" style="overflow: auto; flex: auto">
          <v-skeleton-loader v-if="lyric.loading" type="text@5"></v-skeleton-loader>
          <div v-else>
            <div v-for="item in lyric.music.lyric" :key="item.id_lyric">
              {{item.lyric}}&nbsp;
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
    lyric: function () {
      return this.$root.lyric;
    },
  },
  methods: {
    closeLetter: function () {
      this.lyric.show = false;
    },
  },
};
</script>
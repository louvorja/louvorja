<template>
  <v-dialog
    v-model="lyric.show"
    :width="500"
    :theme="$store.state.data.layout.dark ? 'dark' : ''"
    :fullscreen="screen_mobile_mode"
  >
    <v-card>
      <div class="flex-grow-0">
        <v-card-title class="pb-0">
          <v-skeleton-loader v-if="lyric.loading" width="100%" type="heading" />
          <span v-else>{{ lyric.music.name }}</span>
        </v-card-title>
        <v-card-subtitle v-if="!lyric.loading && lyric.album" class="pt-0">
          <span>{{ lyric.album }}</span>
          <span v-if="lyric.track" class="text-lowercase">
            | {{ $t("track") }} {{ lyric.track }}
          </span>
        </v-card-subtitle>
      </div>
      <div
        class="flex-grow-1 my-3 px-4 pb-4"
        style="overflow: auto; flex: auto"
      >
        <v-skeleton-loader v-if="lyric.loading" type="text@5" />
        <div v-else>
          <div v-for="item in lyric.music.lyric" :key="item.id_lyric">
            {{ item.lyric }}&nbsp;
          </div>
        </div>
      </div>
      <div class="flex-grow-0">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="error" @click="closeLetter()">
            {{ $t("close") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  data() {
    return {
      screen_mobile_mode: false,
    };
  },
  computed: {
    lyric: function () {
      return this.$store.state.lyric;
    },
  },
  methods: {
    closeLetter: function () {
      this.lyric.show = false;
    },
    resize() {
      this.screen_mobile_mode = window.innerWidth <= 400;
    },
  },
  mounted() {
    window.addEventListener("resize", this.resize);
    this.resize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  },
};
</script>
<template>
  <div class="d-flex">
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openMusic($attrs, { audio: 1 })"
          :disabled="!$attrs.url_music"
        >
          <v-icon>mdi-play-box-multiple</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("slide") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openMusic($attrs, { audio: 2 })"
          :disabled="!$attrs.url_instrumental_music"
        >
          <v-icon>mdi-play-box-multiple-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("instrumental-slide") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openMusic($attrs, { audio: 0 })"
        >
          <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("slide-without-audio") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openPlayer($attrs, { audio: 1 })"
          :disabled="!$attrs.url_music"
        >
          <v-icon>mdi-file-music</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("listen-to-music") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openPlayer($attrs, { audio: 2 })"
          :disabled="!$attrs.url_instrumental_music"
        >
          <v-icon>mdi-file-music-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("listen-to-instrumental-music") }}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$store.state.data.layout.color"
          v-on="on"
          @click="openLyric($attrs)"
        >
          <v-icon>mdi-text-box-outline</v-icon>
        </v-btn>
      </template>
      <span>{{ $t("lyrics") }}</span>
    </v-tooltip>
    <!--
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon :color="$store.state.data.layout.color" v-on="on">
          <v-icon>mdi-playlist-music</v-icon>
        </v-btn>
      </template>
      <span>Adicionar à Playlist</span>
    </v-tooltip>
    -->

    <!--{{ $attrs }}-->
  </div>
</template>

<script>
const Audio = require("@/helpers/Audio.js");

export default {
  inheritAttrs: false,
  methods: {
    openMusic: function (obj, options = {}) {
      Audio.open(obj, options);
      this.$emit("music", true);
    },
    openPlayer: function (obj, options = {}) {
      Audio.player(obj, options);
      this.$emit("player", true);
    },
    openLyric: function (obj, options = {}) {
      Audio.lyric(obj, options);
      this.$emit("lyric", true);
    },
  },
};
</script>
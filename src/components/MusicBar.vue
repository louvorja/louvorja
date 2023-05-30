<template>
  <div class="d-flex">
    <v-spacer />
    <v-tooltip :text="$t('slide')" location="bottom" v-if="visible">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-play-box-multiple"
          size="small"
          @click="openMusic($attrs, { audio: 1 })"
          :color="color"
          :disabled="!$attrs.url_music"
          v-bind="props"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      :text="$t('instrumental-slide')"
      location="bottom"
      v-if="visible"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-play-box-multiple-outline"
          size="small"
          @click="openMusic($attrs, { audio: 2 })"
          :color="color"
          :disabled="!$attrs.url_instrumental_music"
          v-bind="props"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      :text="$t('slide-without-audio')"
      location="bottom"
      v-if="visible"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-checkbox-multiple-blank-outline"
          size="small"
          @click="openMusic($attrs, { audio: 0 })"
          :color="color"
          v-bind="props"
        />
      </template>
    </v-tooltip>

    <!--
    <v-tooltip :text="$t('listen-to-music')" location="bottom" v-if="visible">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-file-music"
          size="small"
          @click="openPlayer($attrs, { audio: 1 })"
          :color="color"
          :disabled="!$attrs.url_music"
          v-bind="props"
        />
      </template>
    </v-tooltip>

    <v-tooltip
      :text="$t('listen-to-instrumental-music')"
      location="bottom"
      v-if="visible"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-file-music-outline"
          size="small"
          @click="openPlayer($attrs, { audio: 2 })"
          :color="color"
          :disabled="!$attrs.url_instrumental_music"
          v-bind="props"
        />
      </template>
    </v-tooltip>
    -->

    <v-tooltip :text="$t('lyrics')" location="bottom" v-if="visible">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          icon="mdi-text-box-outline"
          size="small"
          @click="openLyric($attrs)"
          :color="color"
          v-bind="props"
        />
      </template>
    </v-tooltip>

    <!--
      //fururamente, quando tiver opção de playlist personalizada
      mdi-playlist-music
    -->
  </div>
</template>

<script>
const Media = require("@/helpers/Media.js");

export default {
  inheritAttrs: false,
  props: ["color"],
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    openMusic: function (obj, options = {}) {
      Media.open(obj, options);
      this.$emit("music", true);
    },
    openPlayer: function (obj, options = {}) {
      Media.player(obj, options);
      this.$emit("player", true);
    },
    openLyric: function (obj, options = {}) {
      Media.lyric(obj, options);
      this.$emit("lyric", true);
    },
  },
  mounted: async function () {
    let self = this;
    setTimeout(function () {
      self.visible = true;
    }, 50);
  },
};
</script>
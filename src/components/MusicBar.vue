<template>
  <div class="d-flex">
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 1 })"
          :disabled="!$attrs.url_music"
        >
          <v-icon>mdi-play-box-multiple</v-icon>
        </v-btn>
      </template>
      <span>{{$t("slide")}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 2 })"
          :disabled="!$attrs.url_instrumental_music"
        >
          <v-icon>mdi-play-box-multiple-outline</v-icon>
        </v-btn>
      </template>
      <span>{{$t("instrumental-slide")}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 0 })"
        >
          <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
        </v-btn>
      </template>
      <span>{{$t("slide-without-audio")}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openPlayer($attrs, { audio: 1 })"
          :disabled="!$attrs.url_music"
        >
          <v-icon>mdi-file-music</v-icon>
        </v-btn>
      </template>
      <span>{{$t("listen-to-music")}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openPlayer($attrs, { audio: 2 })"
          :disabled="!$attrs.url_instrumental_music"
        >
          <v-icon>mdi-file-music-outline</v-icon>
        </v-btn>
      </template>
      <span>{{$t("listen-to-instrumental-music")}}</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          :color="$root.data.layout.color"
          v-on="on"
          @click="$root.openLyricMusic($attrs)"
        >
          <v-icon>mdi-text-box-outline</v-icon>
        </v-btn>
      </template>
      <span>{{$t("lyrics")}}</span>
    </v-tooltip>
    <!--
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon :color="$root.data.layout.color" v-on="on">
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
export default {
  inheritAttrs: false,
};
</script>
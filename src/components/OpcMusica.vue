<template>
  <div class="d-flex">
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 1 })"
        >
          <v-icon>mdi-play-box-multiple</v-icon>
        </v-btn>
      </template>
      <span>Slide</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 2 })"
        >
          <v-icon>mdi-play-box-multiple-outline</v-icon>
        </v-btn>
      </template>
      <span>Slide Playback</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openMusic($attrs, { audio: 0 })"
        >
          <v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
        </v-btn>
      </template>
      <span>Slide Sem Áudio</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openPlayer($attrs, { audio: 1 })"
        >
          <v-icon>mdi-file-music</v-icon>
        </v-btn>
      </template>
      <span>Ouvir Música</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openPlayer($attrs, { audio: 2 })"
        >
          <v-icon>mdi-file-music-outline</v-icon>
        </v-btn>
      </template>
      <span>Ouvir Playback</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          color="info"
          v-on="on"
          @click="$root.openLetterMusic($attrs)"
        >
          <v-icon>mdi-text-box-outline</v-icon>
        </v-btn>
      </template>
      <span>Letra da Música</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on">
          <v-icon>mdi-playlist-music</v-icon>
        </v-btn>
      </template>
      <span>Adicionar à Playlist</span>
    </v-tooltip>

    <!--{{ $attrs }}-->
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>
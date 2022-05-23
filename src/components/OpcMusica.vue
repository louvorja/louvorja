<template>
  <div class="d-flex">
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on" @click="$root.openMusic($attrs)">
          <v-icon>mdi-play-box-multiple</v-icon>
        </v-btn>
      </template>
      <span>Abrir Slide</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on" @click="$root.openMusic($attrs)">
          <v-icon>mdi-play-box-multiple-outline</v-icon>
        </v-btn>
      </template>
      <span>Abrir Slide Playback</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on">
          <v-icon>mdi-file-music</v-icon>
        </v-btn>
      </template>
      <span>Abrir Arquivo</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on">
          <v-icon>mdi-file-music-outline</v-icon>
        </v-btn>
      </template>
      <span>Abrir Arquivo Playback</span>
    </v-tooltip>
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon color="info" v-on="on" @click="$root.openLetterMusic($attrs)">
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
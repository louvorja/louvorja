<template>
  <v-expand-transition>
    <v-card v-show="player.show" style="border-radius: 0 !important">
      <v-layout column fill-height>
        <div class="flex-grow-0">
          <v-list-item class="px-2">
            <v-list-item-title>{{ player.titulo }}</v-list-item-title>

            <v-btn icon @click.stop="close()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-list-item>

          <v-divider></v-divider>
        </div>
        <audio
          id="player-media"
          v-show="!player.loading && player.file !== ''"
          :src="file_music"
          :autoplay="true"
        ></audio>

        <v-progress-linear
          v-if="player.file"
          v-model="player.progress"
          :indeterminate="player.loading"
          :height="10"
          :color="player.is_paused ? 'orange' : 'info'"
          @change="changeProgress"
        ></v-progress-linear>

        <v-toolbar flat v-if="!player.loading">
          <v-spacer></v-spacer>
          <v-btn icon color="info" @click="restart()">
            <v-icon>mdi-restart</v-icon>
          </v-btn>
          <v-btn icon color="info" @click="back()">
            <v-icon>mdi-rewind-10</v-icon>
          </v-btn>
          <v-btn
            icon
            color="info"
            @click="play()"
            v-if="player.is_paused && player.file !== ''"
          >
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn
            icon
            color="info"
            @click="pause()"
            v-if="!player.is_paused && player.file !== ''"
          >
            <v-icon>mdi-pause</v-icon>
          </v-btn>
          <v-btn icon color="info" @click="go()">
            <v-icon>mdi-fast-forward-10</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                small
                color="info"
                v-bind="attrs"
                v-on="on"
                v-if="player.audio === 1"
              >
                CT
              </v-btn>
              <v-btn
                text
                small
                color="success"
                v-bind="attrs"
                v-on="on"
                v-else-if="player.audio === 2"
              >
                PB
              </v-btn>
              <v-btn text small color="error" v-bind="attrs" v-on="on" v-else>
                SA
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-if="player.music.arquivo !== ''"
                @click="$root.openPlayer(player.id_musica, { audio: 1 })"
              >
                Cantado
              </v-list-item>
              <v-list-item
                v-if="player.music.arquivo_pb !== ''"
                @click="$root.openPlayer(player.id_musica, { audio: 2 })"
              >
                Playback
              </v-list-item>
              <v-list-item @click="$root.openLetterMusic(player.id_musica)">
                Letra
              </v-list-item>
            </v-list>
          </v-menu>
          <span class="caption">
            {{ player.current_time | formatSecond }} /
            {{ player.duration | formatSecond }}
          </span>
        </v-toolbar>
      </v-layout>
    </v-card>
  </v-expand-transition>
</template>


<script>
import filters from "@/filters";
export default {
  filters,
  data() {
    return { progress_slide: 0, ...this.$root.$data };
  },
  computed: {
    el: function () {
      return document.getElementById("player-media");
    },
    file_music: function () {
      if (this.player.file == "" || this.player.file == undefined) {
        return undefined;
      }
      return this.$root.dir(
        `${this.path.files}/musicas/${this.player.music.pasta}/${this.player.file}`
      );
    },
  },
  methods: {
    play: function () {
      this.el.play();
    },
    pause: function () {
      this.el.pause();
    },
    go: function () {
      this.goTo(this.el.currentTime + 10);
    },
    back: function () {
      this.goTo(this.el.currentTime - 10);
    },
    restart: function () {
      this.goTo(0);
    },
    goTo: function (time) {
      this.el.currentTime = time;
    },
    close: function (time) {
      if (this.el.duration > 0) {
        this.el.pause();
        this.el.currentTime = 0;
      }
      this.player.show = false;
      this.player.id_musica = 0;
    },
    timeUpdate: function () {
      this.player.current_time = this.el.currentTime;
      this.player.duration = this.el.duration;

      this.player.progress =
        (this.player.current_time / this.player.duration) * 100;
      this.player.is_paused = this.el.paused;
    },
    changeProgress: function (val) {
      let time = (this.el.duration * val) / 100;
      this.goTo(time);
    },
  },
  mounted() {
    this.el.addEventListener("timeupdate", this.timeUpdate);
  },
};
</script>
<template>
  <v-expand-transition>
    <v-card
      dark
      :color="$root.data.layout.color"
      v-show="player.show"
      style="border-radius: 0 !important"
    >
      <v-layout column fill-height>
        <div class="flex-grow-0">
          <v-list-item class="px-2">
            <v-list-item-content>
              <v-skeleton-loader v-if="player.loading" type="text" class="px-3">
              </v-skeleton-loader>
              <v-list-item-title v-if="!player.loading">{{
                player.name
              }}</v-list-item-title>
              <v-list-item-subtitle v-if="!player.loading">
                <span v-if="player.album">{{ player.album }}</span>
                <span v-if="player.audio == 2"> | PB</span>
                <span v-if="player.track" class="text-lowercase">
                  | {{ $t("track") }} {{ player.track }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
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
          v-model="player.progress"
          :indeterminate="player.loading"
          :height="10"
          :color="player.is_paused ? 'orange' : 'info'"
          @change="changeProgress"
        ></v-progress-linear>

        <v-toolbar dark :color="$root.data.layout.color" flat>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="player.loading || !player.file"
            icon
            @click="restart()"
          >
            <v-icon>mdi-restart</v-icon>
          </v-btn>
          <v-btn
            :disabled="player.loading || !player.file"
            icon
            @click="back()"
          >
            <v-icon>mdi-rewind-10</v-icon>
          </v-btn>
          <v-btn
            :disabled="player.loading || !player.file"
            icon
            @click="play()"
            v-if="player.is_paused"
          >
            <v-icon>mdi-play</v-icon>
          </v-btn>
          <v-btn
            :disabled="player.loading || !player.file"
            icon
            @click="pause()"
            v-if="!player.is_paused"
          >
            <v-icon>mdi-pause</v-icon>
          </v-btn>
          <v-btn :disabled="player.loading || !player.file" icon @click="go()">
            <v-icon>mdi-fast-forward-10</v-icon>
          </v-btn>

          <v-spacer></v-spacer>
          <list-change-music-type
            :key="player.music.id_music"
            type="player"
            :audio="player.audio"
            v-bind="player.music"
            @sung="$root.openPlayer(obj_music, { audio: 1 })"
            @instrumental="$root.openPlayer(obj_music, { audio: 2 })"
            @lyrics="$root.openLyricMusic(obj_music)"
          >
          </list-change-music-type>

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
  components: {
    ListChangeMusicType: () => import(`@/components/ListChangeMusicType`),
  },
  computed: {
    el: function () {
      return document.getElementById("player-media");
    },
    file_music: function () {
      if (this.player.file == "" || this.player.file == undefined) {
        return undefined;
      }
      return this.player.file;
    },
    obj_music: function () {
      if (this.player.show && this.player.file) {
        return {
          id_music: this.player.id_music,
          album: this.player.album,
          track: this.player.track,
        };
      } else {
        return {};
      }
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

      if (
        !this.player.is_paused &&
        this.player.current_time >= this.player.duration
      ) {
        this.close();
      }
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
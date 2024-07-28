<template>
  <v-card
    v-if="media.has_music && !media.show"
    theme="dark"
    :rounded="0"
    class="w-100"
  >
    <div
      class="w-100 d-flex flex-nowrap align-stretch flex-row justify-space-between"
    >
      <div
        v-if="!player_mobile_mode"
        class="d-flex flex-no-wrap align-center flex-row justify-space-between text-truncate"
      >
        <v-avatar
          class="ma-1"
          size="65"
          rounded="0"
          v-if="media.album.url_image"
        >
          <v-img :src="media.album.url_image"></v-img>
        </v-avatar>
        <div class="flex-grow-1 text-truncate">
          <v-card-title v-if="media.music.name">
            {{ media.music.name }}
          </v-card-title>

          <v-card-subtitle v-if="media.track || media.album.name">
            <span v-if="media.album.name">
              {{ media.album.name }}
            </span>
            <span v-if="media.album.name && media.track"> | </span>
            <span v-if="media.track"> Faixa {{ media.track }} </span>
          </v-card-subtitle>
        </div>
      </div>

      <div class="d-flex flex-column flex-grow-1 px-2">
        <div class="d-flex align-center justify-center flex-grow-1">
          <v-btn
            v-if="media.audio > 0 && !player_mobile_mode"
            :disabled="media.loading"
            icon="mdi-restart"
            size="small"
            @click="restart()"
          />
          <v-btn
            v-if="media.audio > 0 && !player_mobile_mode"
            :disabled="media.loading"
            icon="mdi-rewind-10"
            size="small"
            @click="rewind()"
            v-shortkey="{
              left: ['ctrl', 'arrowleft'],
              up: ['ctrl', 'arrowup'],
              pgup: ['ctrl', 'pageup'],
            }"
            @shortkey="rewind()"
          />
          <v-btn
            v-show="!player_mobile_mode"
            :disabled="media.loading"
            icon="mdi-page-first"
            size="small"
            @click="first()"
            v-shortkey="['home']"
            @shortkey="first()"
          />
          <v-btn
            :disabled="media.loading"
            icon="mdi-chevron-left"
            size="small"
            @click="prev()"
            v-shortkey="{
              left: ['arrowleft'],
              up: ['arrowup'],
              pgup: ['pageup'],
            }"
            @shortkey="prev()"
          />
          <v-btn
            v-if="media.audio > 0"
            :disabled="media.loading"
            variant="flat"
            color="white"
            :icon="media.is_paused ? 'mdi-play' : 'mdi-pause'"
            size="small"
            @click="pause()"
            v-shortkey="['space']"
            @shortkey="pause()"
          />
          <v-btn
            :disabled="media.loading"
            icon="mdi-chevron-right"
            size="small"
            @click="next()"
            v-shortkey="{
              right: ['arrowright'],
              down: ['arrowdown'],
              pgdn: ['pagedown'],
            }"
            @shortkey="next()"
          />
          <v-btn
            v-show="!player_mobile_mode"
            :disabled="media.loading"
            icon="mdi-page-last"
            size="small"
            @click="last()"
            v-shortkey="['end']"
            @shortkey="last()"
          />
          <v-btn
            v-if="media.audio > 0 && !player_mobile_mode"
            :disabled="media.loading"
            icon="mdi-fast-forward-10"
            size="small"
            @click="forward()"
            v-shortkey="{
              right: ['ctrl', 'arrowright'],
              down: ['ctrl', 'arrowdown'],
              pgdn: ['ctrl', 'pagedown'],
            }"
            @shortkey="forward()"
          />
          <list-change-music-type
            v-if="!media.loading && media.audio <= 0"
            :key="media.music.id_music"
            :audio="media.audio"
            v-bind="media.music"
            @sung="open(1)"
            @instrumental="open(2)"
            @without-audio="open(0)"
            @lyrics="lyric()"
          />
        </div>
        <div
          v-if="media.audio > 0"
          style="height: 30px"
          class="d-flex flex-nowrap flex-row align-center justify-space-between"
        >
          <div class="text-right text-caption">
            {{ $filters.formatSecond(media.current_time) }}
          </div>
          <div class="flex-grow-1 px-2">
            <v-progress-linear
              v-model="media.progress"
              rounded
              clickable
              :indeterminate="media.loading"
              :height="10"
              :stream="!media.loading"
              :buffer-value="media.buffered"
              :color="
                media.is_paused ? 'warning' : media.volume <= 0 ? 'red' : 'info'
              "
              @click="changeProgress"
            />
          </div>
          <div class="text-left text-caption">
            {{ $filters.formatSecond(media.duration) }}
          </div>
          <div class="text-left text-caption">
            <list-change-music-type
              v-if="!media.loading"
              :key="media.music.id_music"
              :audio="media.audio"
              v-bind="media.music"
              @sung="open(1)"
              @instrumental="open(2)"
              @without-audio="open(0)"
              @lyrics="lyric()"
            />
          </div>
        </div>
      </div>

      <div class="d-flex flex-column px-2">
        <div class="d-flex align-center justify-end flex-grow-1">
          <v-btn
            v-show="!player_mobile_mode"
            icon="mdi-open-in-new"
            size="small"
            @click="show()"
          />

          <v-menu v-if="player_mobile_mode && !media.loading && !fullscreen">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-menu" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item v-show="media.audio > 0" @click="restart">
                <v-icon icon="mdi-restart" />
              </v-list-item>
              <v-divider />
              <v-list-item v-show="media.audio > 0" @click="rewind">
                <v-icon icon="mdi-rewind-10" />
              </v-list-item>
              <v-list-item @click="first">
                <v-icon icon="mdi-page-first" />
              </v-list-item>
              <v-divider />
              <v-list-item @click="last">
                <v-icon icon="mdi-page-last" />
              </v-list-item>
              <v-list-item v-show="media.audio > 0" @click="forward">
                <v-icon icon="mdi-fast-forward-10" />
              </v-list-item>
              <v-divider />
              <v-list-item @click="show()">
                <v-icon icon="mdi-open-in-new" />
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn variant="flat" color="white" size="x-small" @click="show()">
            {{ media.slide.number }}
          </v-btn>

          <v-btn icon="mdi-close" size="small" @click="close()" />
        </div>
        <div
          v-if="media.audio > 0"
          class="d-flex flex-nowrap flex-row align-center justify-space-between"
          style="height: 30px"
        >
          <div class="text-right text-caption">
            <v-btn
              :disabled="media.loading"
              :icon="volume_icon"
              size="x-small"
              @click="volume()"
            />
          </div>
          <div class="flex-grow-1 px-2" style="min-width: 100px">
            <v-progress-linear
              v-model="media.volume"
              rounded
              clickable
              :height="10"
              color="white"
              @click="changeVolume"
            />
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import { defineAsyncComponent } from "vue";

const Media = require("@/helpers/Media.js");

export default {
  components: {
    listChangeMusicType: defineAsyncComponent(() =>
      import(`@/components/ListChangeMusicType`)
    ),
  },
  data() {
    return {
      player_mobile_mode: false,
    };
  },
  computed: {
    media: function () {
      return this.$store.state.media;
    },
    volume_icon: function () {
      switch (true) {
        case this.$store.state.media.volume <= 0:
          return "mdi-volume-mute";
        case this.$store.state.media.volume <= 20:
          return "mdi-volume-low";
        case this.$store.state.media.volume <= 70:
          return "mdi-volume-medium";
        default:
          return "mdi-volume-high";
      }
    },
  },
  methods: {
    show: function () {
      Media.show(true);
    },
    restart: function () {
      Media.goTo(0);
    },
    rewind: function () {
      Media.advanceTime(-10);
    },
    first: function () {
      Media.firstSlide();
    },
    prev: function () {
      Media.prevSlide();
    },
    pause: function () {
      Media.pause();
    },
    next: function () {
      Media.nextSlide();
    },
    last: function () {
      Media.lastSlide();
    },
    forward: function () {
      Media.advanceTime(+10);
    },
    close: function () {
      Media.closeDialog();
    },
    changeProgress: function () {
      Media.goToPercent(this.$store.state.media.progress);
    },
    changeVolume: function () {
      Media.volume(this.$store.state.media.volume);
    },
    volume: function () {
      Media.volume();
    },
    lyric: function () {
      Media.lyric(this.$store.state.media);
    },
    open: function (audio) {
      Media.open(this.$store.state.media, {
        audio,
        show: this.$store.state.media.show,
        album: true,
      });
    },
    onResize() {
      this.player_mobile_mode = window.innerWidth <= 615;
    },
  },
  mounted() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
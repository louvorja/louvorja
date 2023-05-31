<template>
  <v-card
    v-if="$store.state.media.has_music && !$store.state.media.show"
    theme="dark"
    :rounded="0"
    class="w-100"
  >
    <div
      class="w-100 d-flex flex-nowrap align-stretch flex-row justify-space-between"
    >
      <div
        class="d-flex flex-no-wrap align-center flex-row justify-space-between"
      >
        <v-avatar
          class="ma-1"
          size="65"
          rounded="0"
          v-if="$store.state.media.album.url_image"
        >
          <v-img :src="$store.state.media.album.url_image"></v-img>
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title v-if="$store.state.media.music.name">
            {{ $store.state.media.music.name }}
          </v-card-title>

          <v-card-subtitle
            v-if="$store.state.media.track || $store.state.media.album.name"
          >
            <span v-if="$store.state.media.album.name">
              {{ $store.state.media.album.name }}
            </span>
            <span
              v-if="$store.state.media.album.name && $store.state.media.track"
            >
              |
            </span>
            <span v-if="$store.state.media.track">
              Faixa {{ $store.state.media.track }}
            </span>
          </v-card-subtitle>
        </div>
      </div>

      <div class="d-flex flex-column flex-grow-1 px-2">
        <div class="d-flex align-center justify-center flex-grow-1">
          <v-btn
            v-if="$store.state.media.audio > 0"
            :disabled="$store.state.media.loading"
            variant="text"
            icon="mdi-restart"
            size="small"
            @click.native="restart()"
          />
          <v-btn
            v-if="$store.state.media.audio > 0"
            :disabled="$store.state.media.loading"
            variant="text"
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
            :disabled="$store.state.media.loading"
            variant="text"
            icon="mdi-page-first"
            size="small"
            @click="first()"
            v-shortkey="['home']"
            @shortkey="first()"
          />
          <v-btn
            :disabled="$store.state.media.loading"
            variant="text"
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
            v-if="$store.state.media.audio > 0"
            :disabled="$store.state.media.loading"
            variant="flat"
            color="white"
            :icon="$store.state.media.is_paused ? 'mdi-play' : 'mdi-pause'"
            size="small"
            @click="pause()"
            v-shortkey="['space']"
            @shortkey="pause()"
          />
          <v-btn
            :disabled="$store.state.media.loading"
            variant="text"
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
            :disabled="$store.state.media.loading"
            variant="text"
            icon="mdi-page-last"
            size="small"
            @click="last()"
            v-shortkey="['end']"
            @shortkey="last()"
          />
          <v-btn
            v-if="$store.state.media.audio > 0"
            :disabled="$store.state.media.loading"
            variant="text"
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
            v-if="!$store.state.media.loading && $store.state.media.audio <= 0"
            :key="$store.state.media.music.id_music"
            :audio="$store.state.media.audio"
            v-bind="$store.state.media.music"
            @sung="open(1)"
            @instrumental="open(2)"
            @without-audio="open(0)"
            @lyrics="lyric()"
          />
        </div>
        <div
          v-if="$store.state.media.audio > 0"
          style="height: 30px"
          class="d-flex flex-nowrap flex-row align-center justify-space-between"
        >
          <div class="text-right text-caption">
            {{ $filters.formatSecond($store.state.media.current_time) }}
          </div>
          <div class="flex-grow-1 px-2">
            <v-progress-linear
              v-model="$store.state.media.progress"
              rounded
              clickable
              :indeterminate="$store.state.media.loading"
              :height="10"
              :color="
                $store.state.media.is_paused
                  ? 'warning'
                  : $store.state.media.volume <= 0
                  ? 'red'
                  : 'info'
              "
              @click="changeProgress"
            />
          </div>
          <div class="text-left text-caption">
            {{ $filters.formatSecond($store.state.media.duration) }}
          </div>
          <div class="text-left text-caption">
            <list-change-music-type
              v-if="!$store.state.media.loading"
              :key="$store.state.media.music.id_music"
              :audio="$store.state.media.audio"
              v-bind="$store.state.media.music"
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
            variant="text"
            icon="mdi-open-in-new"
            size="small"
            @click.native="show()"
          />
          <v-btn
            variant="flat"
            color="white"
            size="x-small"
            @click.native="show()"
          >
            {{ $store.state.media.slide.number }}
          </v-btn>

          <v-btn
            variant="text"
            icon="mdi-close"
            size="small"
            @click.native="close()"
          />
        </div>
        <div
          v-if="$store.state.media.audio > 0"
          class="d-flex flex-nowrap flex-row align-center justify-space-between"
          style="height: 30px"
        >
          <div class="text-right text-caption">
            <v-btn
              :disabled="$store.state.media.loading"
              variant="text"
              :icon="volume_icon"
              size="x-small"
              @click.native="volume()"
            />
          </div>
          <div class="flex-grow-1 px-2" style="min-width: 100px">
            <v-progress-linear
              v-model="$store.state.media.volume"
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
  computed: {
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
  },
};
</script>
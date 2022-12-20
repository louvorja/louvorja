<template>
  <v-expand-x-transition>
    <v-card v-show="media.show" style="border-radius: 0 !important">
      <v-navigation-drawer
        :mini-variant.sync="data.media.mini"
        permanent
        :width="280"
      >
        <v-layout column fill-height>
          <div class="flex-grow-0">
            <v-list-item class="px-2">
              <v-list-item-content>
                <v-list-item-title>{{ media.music.name }}</v-list-item-title>
                <v-list-item-subtitle v-if="!media.loading">
                  <span v-if="media.album">{{ media.album }}</span>
                  <span v-if="media.audio == 2"> | PB</span>
                  <span v-if="media.track" class="text-lowercase">
                    | {{ $t("track") }} {{ media.track }}
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
            id="slide-audio"
            v-show="!media.loading && media.file !== ''"
            :src="file_music"
            :autoplay="true"
          ></audio>

          <fullscreen v-model="fullscreen">
            <screen
              v-if="media.show && slide"
              :fullscreen="fullscreen"
              :index="slide_index"
              :text="text"
              :image="slide.url_image"
              :height="200"
              @move="moveFullscreen"
            >
            </screen>

            <div
              :class="{
                'player-fullscreen': fullscreen,
                'show-player': fullscreen && show_fullscreen_player,
              }"
              @mousemove="moveFullscreen"
            >
              <v-progress-linear
                v-if="media.file"
                v-model="media.progress"
                :indeterminate="media.loading"
                :height="10"
                :color="media.is_paused ? 'orange' : 'info'"
                @change="changeProgress"
              >
              </v-progress-linear>

              <div class="text-center">
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="first()"
                  v-shortkey="['home']"
                  @shortkey="first()"
                >
                  <v-icon>mdi-page-first</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="prev()"
                  v-shortkey="{
                    left: ['arrowleft'],
                    up: ['arrowup'],
                    pgup: ['pageup'],
                  }"
                  @shortkey="prev()"
                >
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="play()"
                  v-shortkey="['space']"
                  @shortkey="play()"
                  v-if="media.is_paused && media.file !== ''"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="pause()"
                  v-shortkey="['space']"
                  @shortkey="pause()"
                  v-if="!media.is_paused && media.file !== ''"
                >
                  <v-icon>mdi-pause</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="next()"
                  v-shortkey="{
                    right: ['arrowright'],
                    down: ['arrowdown'],
                    pgdn: ['pagedown'],
                  }"
                  @shortkey="next()"
                >
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="last()"
                  v-shortkey="['end']"
                  @shortkey="last()"
                >
                  <v-icon>mdi-page-last</v-icon>
                </v-btn>
                <v-btn
                  :disabled="media.loading"
                  icon
                  color="info"
                  @click="toggleFullscreen()"
                  v-shortkey="{ f11: ['f11'], altenter: ['alt', 'enter'] }"
                  @shortkey="toggleFullscreen()"
                >
                  <v-icon v-if="!fullscreen">mdi-fullscreen</v-icon>
                  <v-icon v-else>mdi-fullscreen-exit</v-icon>
                </v-btn>

                <list-change-music-type
                  v-if="!fullscreen"
                  :key="media.music.id_music"
                  :audio="media.audio"
                  v-bind="media.music"
                  @sung="openMusic(obj_music, { audio: 1 })"
                  @instrumental="openMusic(obj_music, { audio: 2 })"
                  @without-audio="openMusic(obj_music, { audio: 0 })"
                  @lyrics="openLyric(obj_music)"
                >
                </list-change-music-type>
              </div>
            </div>
          </fullscreen>

          <div
            class="flex-grow-1"
            style="overflow: auto; flex: auto"
            id="slide-scroll"
          >
            <v-skeleton-loader
              v-if="media.loading"
              type="list-item-two-line@3"
              class="px-3"
            >
            </v-skeleton-loader>

            <div v-else>
              <v-list dense>
                <v-list-item
                  @click="goToSlide(index)"
                  v-for="(item, index) in slides"
                  :key="index"
                  link
                  :class="[
                    'pa-0',
                    {
                      'v-item--active v-list-item--active':
                        index == slide_index,
                    },
                    'slide-' + index,
                  ]"
                >
                  <v-list-item-avatar>
                    {{ index + 1 }}
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-if="item.name">
                      <h3 class="text-block">{{ item.name }}</h3>
                    </v-list-item-title>
                    <v-list-item-subtitle v-else>
                      <span class="text-block">{{ item.lyric }}</span>
                    </v-list-item-subtitle>
                    <v-progress-linear
                      v-if="media.file && slide_index == index"
                      v-model="progress_slide"
                      :indeterminate="media.loading"
                      :height="5"
                      :color="media.is_paused ? 'orange' : 'info'"
                    ></v-progress-linear>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-layout>
      </v-navigation-drawer>
    </v-card>
  </v-expand-x-transition>
</template>


<script>
const Audio = require("@/helpers/Audio.js");

export default {
  data() {
    return {
      progress_slide: 0,
      fullscreen: false,
      show_fullscreen_player: false,
      interval: null,
      ...this.$store.state,
    };
  },
  components: {
    ListChangeMusicType: () => import(`@/components/ListChangeMusicType`),
    screen: () => import(`@/components/Screen`),
  },
  computed: {
    el: function () {
      return document.getElementById("slide-audio");
    },
    slide_index: function () {
      return this.media.slide;
    },
    slide: function () {
      return this.slides[this.slide_index];
    },
    slides: function () {
      if (this.media.music.length <= 0) {
        return [];
      }
      let slides = Object.assign({}, this.media.music, { show_slide: 1 });
      delete slides.lyric;
      slides = [slides];
      slides.push(...this.media.music.lyric);
      let img = "";
      slides.map((item) => {
        item.image = item.image || img;
        if (item.image) {
          img = item.image;
        }
        return item;
      });
      return slides.filter((item) => item.show_slide === 1);
    },
    text: function () {
      if (!this.slides || !this.slides[this.media.slide]) {
        return "";
      }
      return (
        this.slides[this.media.slide].lyric ||
        this.slides[this.media.slide].name
      );
    },
    file_music: function () {
      if (
        this.media.music.length <= 0 ||
        this.media.file == "" ||
        this.media.file == undefined
      ) {
        return undefined;
      }
      return this.media.file;
    },
    obj_music: function () {
      if (this.media.show && this.slide) {
        return {
          id_music: this.media.id_music,
          album: this.media.album,
          track: this.media.track,
        };
      } else {
        return {};
      }
    },
  },
  methods: {
    openMusic: function (obj, options = {}) {
      Audio.open(obj, options);
    },
    openPlayer: function (obj, options = {}) {
      Audio.player(obj, options);
    },
    openLyric: function (obj, options = {}) {
      Audio.lyric(obj, options);
    },

    play: function () {
      this.el.play();
    },
    pause: function () {
      this.el.pause();
    },
    next: function () {
      this.goToSlide(this.slide_index + 1);
    },
    prev: function () {
      this.goToSlide(this.slide_index - 1);
    },
    first: function () {
      this.goToSlide(0);
    },
    last: function () {
      this.goToSlide(this.slides.length - 1);
    },
    goTo: function (time) {
      this.el.currentTime = time;
    },
    goToSlide: function (slide) {
      this.progress_slide = 0;
      if (slide + 1 > this.slides.length) {
        slide = this.slides.length - 1;
      }
      if (slide < 0) {
        slide = 0;
      }

      if (this.media.file !== "") {
        this.goTo(this.slides[slide].time || 0);
      } else {
        this.media.slide = slide;
      }

      this.scroll(slide);
    },
    close: function (time) {
      if (this.el.duration > 0) {
        this.el.pause();
        this.el.currentTime = 0;
      }
      this.media.show = false;
      this.media.id_musica = 0;
    },
    scroll: function (slide) {
      if (this.media.music.length <= 0) {
        return;
      }
      if (
        document
          .getElementById("slide-scroll")
          .getElementsByClassName("slide-" + slide)[0] == undefined
      ) {
        return;
      }
      let parentPos = document
        .getElementById("slide-scroll")
        .getBoundingClientRect();
      let childPos = document
        .getElementById("slide-scroll")
        .getElementsByClassName("slide-" + slide)[0]
        .getBoundingClientRect();
      let relativePos = {};

      (relativePos.top = childPos.top - parentPos.top),
        (relativePos.right = childPos.right - parentPos.right),
        (relativePos.bottom = childPos.bottom - parentPos.bottom),
        (relativePos.left = childPos.left - parentPos.left);

      document.getElementById("slide-scroll").scrollTo({
        top:
          document.getElementById("slide-scroll").scrollTop -
          8 +
          relativePos.top,
        behavior: "smooth",
      });
    },
    timeUpdate: function () {
      if (this.slides.length <= 0) {
        return;
      }

      this.media.current_time = this.el.currentTime;
      this.media.duration = this.el.duration;

      this.media.progress =
        (this.media.current_time / this.media.duration) * 100;

      if (
        !this.media.is_paused &&
        this.media.current_time >= this.media.duration &&
        this.media.duration > 0
      ) {
        this.close();
      }
      this.media.is_paused = this.el.paused;

      let slide =
        this.slides.filter(
          (item) => (item.time || 0) <= this.media.current_time
        ).length - 1;

      if (this.media.slide !== slide) {
        this.media.slide = slide;
        this.scroll(slide);
      }

      let min = this.slide.time || 0;
      let max =
        this.slide_index + 1 >= this.slides.length
          ? this.media.duration
          : this.slides[this.slide_index + 1].time;

      this.progress_slide =
        ((this.media.current_time - min) * 100) / (max - min);
    },
    changeProgress: function (val) {
      let time = (this.media.duration * val) / 100;
      this.goTo(time);
    },

    toggleFullscreen: function () {
      this.fullscreen = !this.fullscreen;
      this.show_fullscreen_player = true;
    },
    moveFullscreen() {
      if (this.fullscreen) {
        this.show_fullscreen_player = true;
        if (this.interval) {
          clearInterval(this.interval);
        }
        let self = this;
        this.interval = setTimeout(function () {
          self.show_fullscreen_player = false;
        }, 3000);
      }
    },
  },
  mounted() {
    this.el.addEventListener("timeupdate", this.timeUpdate);
  },
  destroyed() {
    //this.el.removeEventListener("timeupdate");
  },
};
</script>


<style scoped>
.player-fullscreen {
  position: absolute;
  bottom: 0;
  width: 100vw;
  background: #000000a8;
  transition: opacity 0.3s linear;
  opacity: 0;
}
.show-player {
  opacity: 1;
}
</style>
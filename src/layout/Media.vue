<template>
  <v-dialog theme="dark" v-model="media.show" width="90%">
    <v-card id="media-view">
      <fullscreen v-model="fullscreen">
        <div
          v-if="!fullscreen"
          class="d-flex flex-no-wrap align-stretch flex-row justify-space-between media-minus-height"
        >
          <v-avatar
            class="ma-1"
            size="65"
            rounded="0"
            v-if="media.album.url_image"
          >
            <v-img :src="media.album.url_image" />
          </v-avatar>
          <div class="flex-grow-1 d-flex flex-column">
            <v-skeleton-loader type="subtitle" v-if="media.loading" />
            <v-card-title
              class="text-h4 font-weight-light"
              v-else-if="media.music.name"
            >
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
          <div class="d-flex align-start">
            <v-btn icon="mdi-minus" size="small" @click.native="show()" />
            <v-btn icon="mdi-close" size="small" @click.native="close()" />
          </div>
        </div>

        <v-card-text
          class="d-flex align-stretch pa-0 ma-0"
          :style="'height:' + media_height + 'px'"
        >
          <div class="h-100 flex-grow-1">
            <v-skeleton-loader
              class="skeleton-view"
              height="100%"
              v-if="media.loading"
            />
            <screen
              v-else
              :fullscreen="fullscreen"
              :index="slide_index"
              :text="media.slide.lyric"
              :image="media.slide.url_image"
              :height="media_height"
              @move="moveScreen"
            >
            </screen>
          </div>
          <div class="h-100" style="width: 250px">
            <v-skeleton-loader
              v-if="media.loading"
              type="list-item-two-line@5"
              class="px-3"
            >
            </v-skeleton-loader>
            <div v-else class="h-100">
              <v-list
                class="overflow h-100 ma-0 pa-0 slides-list"
                bg-color="black"
              >
                <v-list-item
                  @click="goToSlide(index)"
                  v-for="(item, index) in media.slides"
                  :key="index"
                  link
                  :active="media.slide.index == index"
                  variant="tonal"
                  :height="58"
                  color="white"
                  border
                >
                  <template v-slot:prepend>
                    <v-chip class="mr-2">{{ index + 1 }}</v-chip>
                  </template>

                  <v-list-item-title v-if="item.name">
                    {{ item.name }}
                  </v-list-item-title>
                  <div
                    class="text-caption"
                    v-else
                    v-html="$filters.nl2br(item.lyric)"
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  />
                  <v-progress-linear
                    v-if="media.file && media.slide.index == index"
                    v-model="media.slide.progress"
                    :indeterminate="media.loading"
                    :height="5"
                    :color="media.is_paused ? 'orange' : 'white'"
                  />

                  <!-- Pré carregar imagem -->
                  <img :src="item.url_image" style="display: none" />
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-card-text>

        <v-card-actions
          class="align-stretch media-minus-height"
          :class="{ fullscreen }"
          v-show="!fullscreen || (fullscreen && show_fullscreen_player)"
        >
          <div class="d-flex flex-column flex-grow-1 px-2">
            <div class="d-flex align-center justify-center flex-grow-1">
              <v-btn
                v-if="media.audio > 0"
                :disabled="media.loading"
                icon="mdi-restart"
                size="small"
                @click.native="restart()"
              />
              <v-btn
                v-if="media.audio > 0"
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
                :disabled="media.loading"
                icon="mdi-page-last"
                size="small"
                @click="last()"
                v-shortkey="['end']"
                @shortkey="last()"
              />
              <v-btn
                v-if="media.audio > 0"
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
              <v-btn
                :icon="!fullscreen ? 'mdi-fullscreen' : 'mdi-fullscreen-exit'"
                size="small"
                @click="toggleFullscreen()"
                v-shortkey="{ f11: ['f11'], altenter: ['alt', 'enter'] }"
                @shortkey="toggleFullscreen()"
              />
              <list-change-music-type
                v-if="!media.loading && media.audio <= 0 && !fullscreen"
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
                    media.is_paused
                      ? 'warning'
                      : media.volume <= 0
                      ? 'red'
                      : 'info'
                  "
                  @click="changeProgress"
                />
              </div>
              <div class="text-left text-caption">
                {{ $filters.formatSecond(media.duration) }}
              </div>
              <div class="text-left text-caption">
                <list-change-music-type
                  v-if="!media.loading && !fullscreen"
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
            <div class="d-flex align-center justify-end flex-grow-1" />
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
                  @click.native="volume()"
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
        </v-card-actions>
      </fullscreen>
    </v-card>
  </v-dialog>
</template>

<style>
#media-view .skeleton-view .v-skeleton-loader__bone {
  height: 100%;
}
.v-card-actions.fullscreen {
  bottom: 0;
  position: absolute;
  width: 100%;
  background-color: #0000006b;
}
</style>

<script>
import { defineAsyncComponent } from "vue";

const Media = require("@/helpers/Media.js");

export default {
  components: {
    listChangeMusicType: defineAsyncComponent(() =>
      import(`@/components/ListChangeMusicType`)
    ),
    screen: defineAsyncComponent(() => import(`@/components/screens/Media`)),
  },
  data() {
    return {
      refresh: 0,
      fullscreen: false,
      show_fullscreen_player: false,
      interval: null,
    };
  },
  computed: {
    media: function () {
      return this.$store.state.media;
    },
    show_media: function () {
      return this.$store.state.media.show;
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
    media_height: function () {
      this.refresh;
      let height = this.$store.state.window.main.height - 50;
      document.querySelectorAll(".media-minus-height").forEach((el) => {
        height -= el.offsetHeight || 0;
      });
      return height;
    },
    slide_index: function () {
      return this.$store.state.media.slide.index;
    },
  },
  watch: {
    slide_index() {
      let self = this;
      setTimeout(function () {
        self.adjustScroll();
      }, 100);
    },
    show_media() {
      this.fullscreen = false;
      this.refresh++;
      if (this.show) {
        let self = this;
        setTimeout(function () {
          self.adjustScroll();
        }, 100);
      }
    },
  },
  methods: {
    show: function () {
      Media.show(false);
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
    goToSlide: function (index) {
      Media.goToSlide(index);
    },
    adjustScroll: function () {
      this.refresh++;
      if (!this.media.show) {
        return;
      }
      try {
        let parentPos = document
          .getElementsByClassName("slides-list")[0]
          .getBoundingClientRect();
        let childPos = document
          .getElementsByClassName("slides-list")[0]
          .getElementsByClassName("v-list-item--active")[0]
          .getBoundingClientRect();
        let relativePos = {};

        (relativePos.top = childPos.top - parentPos.top),
          (relativePos.right = childPos.right - parentPos.right),
          (relativePos.bottom = childPos.bottom - parentPos.bottom),
          (relativePos.left = childPos.left - parentPos.left);

        document.getElementsByClassName("slides-list")[0].scrollTo({
          top:
            document.getElementsByClassName("slides-list")[0].scrollTop +
            relativePos.top -
            childPos.height,
          behavior: "smooth",
        });
      } catch (error) {}
    },
    toggleFullscreen: function () {
      this.fullscreen = !this.fullscreen;
    },
    moveScreen() {
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
    this.refresh++;

    try {
      let self = this;
      document
        .getElementById("media-view")
        .addEventListener("scroll", function (event) {
          self.refresh++;
        });
    } catch (e) {}
  },
};
</script>
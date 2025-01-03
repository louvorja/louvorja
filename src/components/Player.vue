<template>
  <v-card theme="dark" class="w-100 pa-0 ma-0 d-flex align-center" :rounded="0">
    <div
      v-if="location == 'footer' && $vuetify.display.width > 800"
      class="d-flex align-center"
      :style="
        media.config.image && $vuetify.display.width > 900
          ? 'max-width: 350px;padding-right:50px;'
          : 'max-width: 300px'
      "
    >
      <v-avatar
        v-if="media.config.image && $vuetify.display.width > 900"
        class="ma-1"
        size="65"
        rounded="0"
      >
        <v-img :src="$path.file(media.config.image)" />
      </v-avatar>
      <div class="d-flex flex-column flex-grow-1 w-100">
        <v-card-title class="py-0">
          {{ media.config.title }}
        </v-card-title>
        <v-card-subtitle v-if="media.config.subtitle" class="py-0">
          {{ media.config.subtitle }}
          <span v-if="media.config.track > 0">
            | {{ $t("modules.media.general.track") }}
            {{ media.config.track }}</span
          >
        </v-card-subtitle>
      </div>
    </div>

    <div class="d-flex flex-column flex-grow-1">
      <div class="d-flex align-center justify-center py-1 flex-grow-1">
        <v-btn
          v-for="(button, key) in buttons"
          :key="key"
          v-show="
            button.show &&
            (compact === false || (compact === true && !button.compact))
          "
          :disabled="media.loading || button.disabled"
          :icon="button.icon"
          :color="button.highlight ? 'white' : ''"
          @click="button.click"
          @shortkey="button.click"
          v-shortkey="button.shortkey"
          :variant="button.highlight ? 'flat' : 'text'"
          class="ma-1"
          size="small"
        />
      </div>
      <div
        v-if="media.config.audio"
        class="d-flex align-center justify-center py-1 px-3"
      >
        <div class="text-right text-caption">
          {{ $datetime.shortTime(media.config.current_time) }}
        </div>
        <div class="flex-grow-1 px-2">
          <v-progress-linear
            v-model="media.config.progress"
            rounded
            clickable
            :indeterminate="media.loading"
            :height="10"
            :stream="!media.loading"
            :buffer-value="media.config.buffered"
            :color="
              media.config.is_paused
                ? 'warning'
                : media.config.volume <= 0
                ? 'red'
                : 'info'
            "
            @click="changeProgress"
          />
        </div>
        <div class="text-left text-caption">
          {{ $datetime.shortTime(media.config.duration) }}
        </div>
      </div>
      <div
        v-if="!media.config.audio && location == 'footer'"
        class="d-flex align-center justify-center py-1 px-3"
      >
        <small class="text-center">
          {{ slide_text }}
        </small>
      </div>
    </div>
    <div class="d-flex flex-column">
      <div class="d-flex align-center justify-end pa-1 flex-grow-1">
        <v-menu
          v-if="location !== 'fullscreen' && $vuetify.display.width > 350"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              :color="mode.color"
              v-bind="props"
              :icon="mode.tray_icon"
            />
          </template>

          <v-list>
            <template v-for="(mode, key) in menu_modes" :key="key">
              <v-divider v-if="mode.title == '-'" />
              <v-list-item
                v-else
                :active="mode.active"
                :disabled="mode.disabled"
                @click="mode.click"
              >
                <template v-slot:prepend>
                  <v-icon :icon="mode.icon"></v-icon>
                </template>
                {{ mode.title }}
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

        <v-menu v-if="this.media.minimized && !compact">
          <template v-slot:activator="{ props }">
            <v-btn variant="flat" size="x-small" color="white" v-bind="props">
              {{ this.media.config.slide_index + 1 }}
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(item, index) in slides"
              :key="index"
              :active="media.config.slide_index == index"
              @click="$media.goToSlide(index)"
            >
              <template v-slot:prepend>
                <v-chip size="small" class="mr-2">{{ index + 1 }}</v-chip>
              </template>

              <v-list-item-title v-if="item.cover">
                {{ item.lyric }}
              </v-list-item-title>
              <div
                class="text-caption text-truncate"
                v-else
                v-html="item.lyric"
              />
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="this.media.minimized"
          variant="text"
          size="small"
          icon="mdi-open-in-app"
          @click="maximize()"
        />
        <v-btn
          v-if="location == 'fullscreen'"
          variant="text"
          size="small"
          icon="mdi-fullscreen-exit"
          @click="fullscreen(false)"
        />
        <v-btn
          v-else-if="location == 'window'"
          variant="text"
          size="small"
          icon="mdi-fullscreen"
          @click="fullscreen()"
        />
        <LScreenBtn v-if="location !== 'fullscreen'" module="media" />

        <v-menu v-if="location !== 'fullscreen' && compact">
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-menu"
              variant="text"
              size="small"
              v-bind="props"
            ></v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(button, key) in buttons.filter(
                (item) => item.compact == true
              )"
              :key="key"
              :disabled="media.loading || button.disabled"
              @click="button.click"
              @shortkey="button.click"
              v-shortkey="button.shortkey"
            >
              <v-icon :icon="button.icon" />
            </v-list-item>

            <v-divider v-if="$vuetify.display.width <= 350" />
            <template v-for="(mode, key) in menu_modes" :key="key">
              <v-divider
                v-if="mode.title == '-' && $vuetify.display.width <= 350"
              />
              <v-list-item
                v-else-if="$vuetify.display.width <= 350"
                :active="mode.active"
                :disabled="mode.disabled"
                @click="mode.click"
              >
                <v-icon :icon="mode.icon" />
              </v-list-item>
            </template>
          </v-list>
        </v-menu>

        <v-btn
          v-if="this.media.minimized"
          variant="text"
          size="small"
          icon="mdi-close"
          @click="close()"
        />
      </div>
      <div
        v-if="media.config.audio"
        class="d-flex align-center justify-center pa-1"
      >
        <div>
          <v-btn
            :disabled="media.loading"
            :icon="volume_icon"
            size="x-small"
            @click="toogleVolume"
            variant="text"
          />
        </div>
        <div class="flex-grow-1 px-2" style="min-width: 100px">
          <v-progress-linear
            v-model="media.config.volume"
            rounded
            clickable
            :height="10"
            color="white"
            @click="changeVolume"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import LScreenBtn from "@/components/buttons/Screen.vue";

export default {
  name: "PlayerComponent",
  props: {
    location: String,
  },
  components: {
    LScreenBtn,
  },
  computed: {
    media() {
      return this.$modules.get("media");
    },
    slides() {
      return this.$media.slides();
    },
    has_instrumental_music() {
      return this.media.data.url_instrumental_music ? true : false;
    },
    buttons() {
      return [
        {
          show: this.media.config.audio,
          compact: true,
          disabled: false,
          highlight: false,
          icon: "mdi-rewind-10",
          click: () => this.rewind(),
          shortkey: {
            left: ["ctrl", "arrowleft"],
            up: ["ctrl", "arrowup"],
            pgup: ["ctrl", "pageup"],
          },
        },
        {
          show: true,
          compact: true,
          disabled: this.media.config.slide_index <= 0,
          highlight: false,
          icon: "mdi-page-first",
          click: () => this.first(),
          shortkey: ["home"],
        },
        {
          show: true,
          compact: false,
          disabled: this.media.config.slide_index <= 0,
          highlight: false,
          icon: "mdi-chevron-left",
          click: () => this.prev(),
          shortkey: {
            left: ["arrowleft"],
            up: ["arrowup"],
            pgup: ["pageup"],
          },
        },
        {
          show: this.media.config.audio,
          compact: false,
          disabled: this.media.config.is_fading,
          highlight: true,
          icon: this.media.config.is_paused ? "mdi-play" : "mdi-pause",
          click: () => this.play(),
          shortkey: ["space"],
        },
        {
          show: true,
          compact: false,
          disabled:
            this.media.config.slide_index >= this.media.config.last_slide - 1,
          highlight: false,
          icon: "mdi-chevron-right",
          click: () => this.next(),
          shortkey: {
            right: ["arrowright"],
            down: ["arrowdown"],
            pgdn: ["pagedown"],
          },
        },
        {
          show: true,
          compact: true,
          disabled:
            this.media.config.slide_index >= this.media.config.last_slide - 1,
          highlight: false,
          icon: "mdi-page-last",
          click: () => this.last(),
          shortkey: ["end"],
        },
        {
          show: this.media.config.audio,
          compact: true,
          disabled: false,
          highlight: false,
          icon: "mdi-fast-forward-10",
          click: () => this.forward(),
          shortkey: {
            right: ["ctrl", "arrowright"],
            down: ["ctrl", "arrowdown"],
            pgdn: ["ctrl", "pagedown"],
          },
        },
      ];
    },
    menu_modes() {
      return [
        {
          mode: "audio",
          title: this.$t("modules.media.general.sung"),
          color: "info",
          active: this.media.config.mode == "audio",
          icon: "mdi-play-box-multiple",
          tray_icon: "mdi-account-voice",
          click: () =>
            this.open({
              id_music: this.media.id_music,
              mode: "audio",
              minimized: this.media.minimized,
            }),
        },
        {
          mode: "instrumental",
          title: this.$t("modules.media.general.instrumental"),
          color: "success",
          active: this.media.config.mode == "instrumental",
          disabled: !this.has_instrumental_music,
          icon: "mdi-play-box-multiple-outline",
          tray_icon: "mdi-music-note",
          click: () =>
            this.open({
              id_music: this.media.id_music,
              mode: "instrumental",
              minimized: this.media.minimized,
            }),
        },
        {
          mode: "no_audio",
          title: this.$t("modules.media.general.no_audio"),
          color: "error",
          active: this.media.config.mode == "no_audio",
          icon: "mdi-checkbox-multiple-blank-outline",
          tray_icon: "mdi-music-off",
          click: () =>
            this.open({
              id_music: this.media.id_music,
              minimized: this.media.minimized,
            }),
        },
        { title: "-" },
        {
          title: this.$t("modules.media.general.lyric"),
          color: "error",
          icon: "mdi-text-box-outline",
          click: () => this.openLyric(),
        },
      ];
    },
    mode() {
      return this.menu_modes.filter(
        (item) => item.mode == this.media.config.mode
      )[0];
    },
    volume_icon: function () {
      switch (true) {
        case this.media.config.volume <= 0:
          return "mdi-volume-mute";
        case this.media.config.volume <= 20:
          return "mdi-volume-low";
        case this.media.config.volume <= 70:
          return "mdi-volume-medium";
        default:
          return "mdi-volume-high";
      }
    },
    slide_text: function () {
      if (!this.slides[this.media.config.slide_index]) return "";
      if (!this.slides[this.media.config.slide_index].lyric) return "";

      let text = this.slides[this.media.config.slide_index].lyric;
      text = text.replace(/<br>/gi, " / ").toUpperCase();
      return text;
    },
    is_mobile: function () {
      return this.$appdata.get("is_mobile");
    },
    compact: function () {
      return this.$vuetify.display.width <= 500;
    },
  },
  methods: {
    play() {
      if (this.media.config.is_paused) {
        this.$media.play();
      } else {
        this.$media.pause();
      }
    },
    rewind: function () {
      this.$media.advanceTime(-10);
    },
    first() {
      this.$media.firstSlide();
    },
    prev() {
      this.$media.prevSlide();
    },
    next() {
      this.$media.nextSlide();
    },
    last() {
      this.$media.lastSlide();
    },
    forward: function () {
      this.$media.advanceTime(+10);
    },
    open: function (data) {
      this.$media.open(data);
    },
    openLyric: function () {
      this.$media.openLyric();
    },
    maximize: function () {
      this.$media.maximize();
    },
    close: function () {
      this.$media.close();
    },
    changeProgress() {
      const time =
        (this.media.config.duration * this.media.config.progress) / 100;
      this.$media.goToTime(time);
    },
    fullscreen(value = true) {
      this.$media.fullscreen(value);
    },
    toogleVolume() {
      this.$media.toogleVolume();
    },
    changeVolume() {
      this.$media.setVolume(this.media.config.volume);
    },
  },
};
</script>

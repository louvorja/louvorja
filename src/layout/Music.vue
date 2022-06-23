<template>
  <v-expand-x-transition>
    <v-card v-show="media.show" style="border-radius: 0 !important">
      <v-navigation-drawer :mini-variant.sync="data.media.mini" permanent>
        <v-layout column fill-height>
          <div class="flex-grow-0">
            <v-list-item class="px-2">
              <v-list-item-content>
                <v-list-item-title>{{ media.music.titulo }}</v-list-item-title>
                <v-list-item-subtitle v-if="!media.loading">
                  <span v-if="media.album">{{ media.album }}</span>
                  <span v-if="media.audio == 2"> | PB</span>
                  <span v-if="media.faixa"> | faixa {{ media.faixa }}</span>
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

          <div
            style="height: 200px; min-height: 200px; max-height: 200px"
            class="layout column"
          >
            <div
              class="
                slide-show
                flex-grow-1
                black
                d-flex
                align-center
                justify-center
              "
              :style="style_bg"
            >
              <div
                v-if="!media.loading && media.show && text"
                class="slide-text text-center"
                :style="style_txt"
              >
                <span class="white--text text-block">{{ text }}</span>
              </div>
            </div>

            <v-progress-linear
              v-if="media.file"
              v-model="media.progress"
              :indeterminate="media.loading"
              :height="10"
              :color="media.is_paused ? 'orange' : 'info'"
              @change="changeProgress"
            ></v-progress-linear>
          </div>

          <div class="text-center">
            <v-btn :disabled="media.loading" icon color="info" @click="first()">
              <v-icon>mdi-page-first</v-icon>
            </v-btn>
            <v-btn :disabled="media.loading" icon color="info" @click="prev()">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              :disabled="media.loading"
              icon
              color="info"
              @click="play()"
              v-if="media.is_paused && media.file !== ''"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              :disabled="media.loading"
              icon
              color="info"
              @click="pause()"
              v-if="!media.is_paused && media.file !== ''"
            >
              <v-icon>mdi-pause</v-icon>
            </v-btn>
            <v-btn :disabled="media.loading" icon color="info" @click="next()">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn :disabled="media.loading" icon color="info" @click="last()">
              <v-icon>mdi-page-last</v-icon>
            </v-btn>

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  small
                  color="info"
                  v-bind="attrs"
                  v-on="on"
                  v-if="media.audio === 1"
                >
                  CT
                </v-btn>
                <v-btn
                  text
                  small
                  color="success"
                  v-bind="attrs"
                  v-on="on"
                  v-else-if="media.audio === 2"
                >
                  PB
                </v-btn>
                <v-btn text small color="error" v-bind="attrs" v-on="on" v-else>
                  SA
                </v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-if="media.music.arquivo !== ''"
                  @click="$root.openMusic(obj_musica, { audio: 1 })"
                >
                  Cantado
                </v-list-item>
                <v-list-item
                  v-if="media.music.arquivo_pb !== ''"
                  @click="$root.openMusic(obj_musica, { audio: 2 })"
                >
                  Playback
                </v-list-item>
                <v-list-item @click="$root.openMusic(obj_musica, { audio: 0 })">
                  Sem áudio
                </v-list-item>
                <v-list-item @click="$root.openLetterMusic(obj_musica)">
                  Letra
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

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
                    <v-list-item-title v-if="item.titulo">
                      <h3 class="text-block">{{ item.titulo }}</h3>
                    </v-list-item-title>
                    <v-list-item-subtitle v-else>
                      <span class="text-block">{{ item.letra }}</span>
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
export default {
  data() {
    return { progress_slide: 0, ...this.$root.$data };
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
      let slides = Object.assign({}, this.media.music, { exibe_slide: 1 });
      delete slides.letra;
      slides = [slides];
      slides.push(...this.media.music.letra);
      let img = "";
      slides.map((item) => {
        item.imagem = item.imagem || img;
        if (item.imagem) {
          img = item.imagem;
        }
        return item;
      });
      return slides.filter((item) => item.exibe_slide === 1);
    },
    text: function () {
      if (!this.slides || !this.slides[this.media.slide]) {
        return "";
      }
      return (
        this.slides[this.media.slide].letra ||
        this.slides[this.media.slide].titulo
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
      return this.$root.dir(
        `${this.path.files}/musicas/${this.media.music.pasta}/${this.media.file}`
      );
    },
    style_bg: function () {
      if (this.media.show && this.slide) {
        let backgroundImage = this.$root.dir(
          `${this.path.files}/imagens/${this.slide.imagem}`
        );
        return Object.assign({
          backgroundSize: "cover",
          backgroundImage: `url(${backgroundImage})`,
        });
      } else {
        return {};
      }
    },
    style_txt: function () {
      if (this.media.show && this.slide) {
        return Object.assign({
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          fontSize: "20px",
        });
      } else {
        return {};
      }
    },
    obj_musica: function () {
      return {
        id_musica: this.media.id_musica,
        album: this.media.album,
        faixa: this.media.faixa,
      };
    },
  },
  methods: {
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
  },
  mounted() {
    this.el.addEventListener("timeupdate", this.timeUpdate);
  },
  destroyed() {
    //this.el.removeEventListener("timeupdate");
  },
};
</script>
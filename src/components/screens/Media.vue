<template>
  <div id="__screen__" @mousemove="$emit('move')" :style="style_container">
    <Transition v-for="(img, index) in images" :key="index">
      <div
        v-if="index == current_image"
        class="slide-show flex fill-height flex-grow-1 black d-flex align-center justify-center"
        :style="style_bg[index]"
      >
        <Transition>
          <div v-if="text" class="slide-text text-center" :style="style_txt">
            {{ text }}
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.slide-show .slide-text,
.slide-show .slide-text * {
  font-family: din-condensed-bold !important;
  text-transform: uppercase !important;
}
.slide-show .slide-text {
  white-space: pre-line;
  line-height: 1.5;
}
</style>

<script>
const Styles = require("@/helpers/Styles.js");

export default {
  inheritAttrs: false,
  props: ["text", "fullscreen", "index", "image", "height", "width"],
  data() {
    return {
      current_image: 0,
      images: ["", ""],
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    };
  },
  computed: {
    style_container: function () {
      return {
        height: this.height_screen,
        width: this.width_screen,
        position: "relative",
      };
    },
    height_screen: function () {
      return !this.fullscreen ? `${this.height || 100}px` : "100vh";
    },
    width_screen: function () {
      return !this.fullscreen
        ? this.width
          ? `${this.width}px`
          : "100%"
        : "100vw";
    },
    style_bg: function () {
      return this.images.map((img) => {
        return Styles.background({
          image: img,
          position: "absolute",
          width: "100%",
          height: "100%",
        });
      });
    },
    style_txt: function () {
      if (this.text) {
        let padding = `0 ${this.fontSizePc(5)}`;
        if (this.index <= 0) {
          return Object.assign({
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            fontSize: this.fontSizePc(25),
            color: "#F6C32A",
            padding,
          });
        } else {
          return Object.assign({
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            fontSize: this.fontSizePc(20),
            color: "#FFF",
            padding,
          });
        }
      } else {
        return {};
      }
    },
  },
  watch: {
    image() {
      this.changeImage();
    },
  },

  methods: {
    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
    fontSizePc(pc) {
      let v = 0;
      if (this.fullscreen) {
        v = Math.min(this.windowWidth, this.windowHeight);
      } else {
        v = this.height;
      }
      let p = (pc * v) / 100 / 2;
      return p + "px";
    },
    changeImage() {
      if (this.images[this.current_image] != this.image) {
        this.current_image = +!this.current_image;

        this.images[this.current_image] = this.image;

        console.log(
          "....IMAGEM MUDOU....",
          this.image,
          this.images[this.current_image]
        );
      }
    },
  },

  mounted() {
    this.changeImage();
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
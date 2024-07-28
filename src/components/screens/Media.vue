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
  props: [
    "text",
    "fullscreen",
    "index",
    "image",
    "image_position",
    "height",
    "width",
  ],
  data() {
    return {
      refresh: 0,
      current_image: 0,
      current_text: "",
      text_repeat: false,
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
          image_position: this.image_position ?? 5,
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
            color: this.text_repeat ? "#efb400" : "#FFF",
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
    index() {
      if (this.index > 0) {
        if (
          this.current_text == this.text &&
          this.images[this.current_image] == this.image
        ) {
          this.text_repeat = !this.text_repeat;
        } else {
          this.text_repeat = false;
        }
        this.current_text = this.text;
      } else {
        this.current_text = "";
        this.text_repeat = false;
      }
    },
    fullscreen() {
      this.refresh++;
      let self = this;
      setTimeout(function () {
        self.refresh++;
      }, 100);
    },
  },

  methods: {
    onResize() {
      this.windowHeight = window.innerHeight;
      this.windowWidth = window.innerWidth;
    },
    fontSizePc(pc) {
      this.refresh;

      let v = 0;
      if (this.fullscreen) {
        v = Math.min(this.windowWidth, this.windowHeight);
      } else {
        v = document.getElementById("__screen__")
          ? Math.min(
              document.getElementById("__screen__").offsetWidth || this.height,
              document.getElementById("__screen__").offsetHeight || this.height
            )
          : this.height;
      }
      let p = (pc * v) / 100 / 2;

      return p + "px";
    },
    changeImage() {
      if (this.images[this.current_image] != this.image) {
        this.current_image = +!this.current_image;

        this.images[this.current_image] = this.image;
      }
    },
  },

  mounted() {
    this.changeImage();
    this.$nextTick(() => {
      window.addEventListener("resize", this.onResize);
    });
    this.onResize;

    this.refresh++;
    let self = this;
    setTimeout(function () {
      self.refresh++;
    }, 100);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
};
</script>
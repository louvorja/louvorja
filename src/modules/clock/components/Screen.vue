<template>
  <div
    ref="container"
    class="d-flex align-center justify-center"
    :style="{
      background: '#000',
      width: '100%',
      height: height ? height + 'px' : '100%',
      color: '#fff',
    }"
  >
    <span class="text-right" :style="{ fontSize: `${this.fontSizePc(30)}px` }">
      {{ time }}
    </span>
  </div>
</template>

<script>
export default {
  name: "ClockPage",
  props: {
    height: Number,
  },
  data: () => ({
    s_width: 0,
    s_height: 0,
    timer: null,
    time: null,
  }),
  methods: {
    fontSizePc(pc) {
      const v = Math.min(this.s_width, this.s_height);
      return (pc * v) / 100 / 2;
    },
    windowResize() {
      const container = this.$refs.container;
      if (container) {
        this.s_width = container.offsetWidth;
        this.s_height = container.offsetHeight;

        if (this.width <= 0 || this.height <= 0) {
          const self = this;
          setTimeout(function () {
            self.windowResize();
          }, 100);
        }
      }
    },
  },
  mounted() {
    this.windowResize();
    window.addEventListener("resize", this.windowResize);
    this.timer = setInterval(() => {
      this.time = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.windowResize);
    clearInterval(this.timer);
  },
};
</script>

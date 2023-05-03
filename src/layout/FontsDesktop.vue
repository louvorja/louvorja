<template>
  <div v-html="style" />
</template>

<script>
export default {
  data() {
    return this.$store.state;
  },
  computed: {
    style: function () {
      return `
        <style>
          @font-face {
            font-family: din-condensed-bold;
            src: url("${this.path.app_path}fonts/din-condensed-bold.ttf");
          }
        </style>
      `;
    },
  },
};
</script>
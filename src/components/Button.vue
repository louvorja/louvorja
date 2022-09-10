<template>
  <v-btn text :to="cto">
    <div
      class="d-flex flex-column align-items-center"
      style="align-items: center"
    >
      <ico :src="cico" :class="iconClass" size="40" />
      <div class="label" :style="{ fontSize: '11px', paddingTop: '4px' }">
        {{ $t(clabel) }}
      </div>
    </div>
  </v-btn>
</template>

<style scoped>
.v-btn {
  height: 72px !important;
}
</style>

<script>
export default {
  props: ["route", "icon", "label", "to", "icon-class"],
  components: {
    ico: () => import(`@/components/Icon`),
  },
  computed: {
    cico: function () {
      if (this.icon == undefined) {
        if (this.route != undefined) {
          return this.$router.options.routes.find(
            (element) => element.name === this.route
          ).icon;
        } else {
          return "";
        }
      } else {
        return this.icon;
      }
    },
    clabel: function () {
      if (this.label == undefined) {
        if (this.route != undefined) {
          return this.$router.options.routes.find(
            (element) => element.name === this.route
          ).name;
        } else {
          return "";
        }
      } else {
        return this.label;
      }
    },
    cto: function () {
      if (this.to == undefined) {
        if (this.route != undefined) {
          return this.$router.options.routes.find(
            (element) => element.name === this.route
          ).path;
        } else {
          return "";
        }
      } else {
        return this.to;
      }
    },
  },
  mounted() {},
};
</script>
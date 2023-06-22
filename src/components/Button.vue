<template>
  <v-card
    :to="cto"
    flat
    class="px-2 pt-2 button"
    :class="{
      active: this.$route.path === cto,
      dark: $store.state.data.layout.dark,
    }"
    :style="{
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      flexDirection: 'column',
      justifyContent: 'center',
      textDecoration: 'none',
    }"
  >
    <ico :src="cico" :class="iconClass" size="40" />
    <div class="text-button">
      {{ $t(clabel) }}
    </div>
  </v-card>
</template>

<style scoped>
.text-button {
  font-size: 11px !important;
  margin: 0 !important;
  padding: 0 !important;
  line-height: 2;
}
.button {
  cursor: pointer !important;
}
.button:hover,
.button.active {
  background-color: #ededed !important;
}
.button:hover.dark,
.button.active.dark {
  background-color: #303030 !important;
}
</style>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: ["route", "icon", "label", "to", "icon-class"],
  components: {
    ico: defineAsyncComponent(() => import(`@/components/Icon`)),
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
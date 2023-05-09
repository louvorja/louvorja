<template>
  <v-snackbar v-model="alert.show" :timeout="alert.timeout" :color="alert.type">
    <span v-if="typeof alert.text == 'string'">
      {{ alert.text }}
    </span>
    <ul v-else class="mx-2">
      <li v-for="(msg, index) in alert.text" :key="index">
        {{ msg }}
      </li>
    </ul>

    <template v-slot:actions>
      <v-btn color="white" icon @click="alert.show = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return this.$store.state;
  },
  watch: {
    alert: {
      handler: function () {
        if (!this.alert.show) {
          this.alert.type = "";
          this.alert.text = null;
          this.timeout = 5000;
        }
      },
      deep: true,
    },
  },
};
</script>
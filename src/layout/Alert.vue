<template>
  <v-dialog
    v-model="alert.show"
    max-width="450"
    persistent
    :theme="$theme.primary()"
  >
    <v-card :color="alert.color">
      <v-card-title v-if="alert.title">
        <div v-if="alert.translate" v-html="$t(alert.title)" />
        <div v-else v-html="alert.title" />
      </v-card-title>
      <v-spacer></v-spacer>
      <v-card-text v-if="alert.text">
        <div v-if="alert.translate" v-html="$t(alert.text)" />
        <div v-else v-html="alert.text" />
        <small v-if="alert.error" class="text-error" v-html="alert.error" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="(btn, index) in alert.buttons"
          :key="index"
          :color="btn.color ? btn.color : layout.color"
          @click="clickBtn(btn.value)"
          variant="text"
        >
          {{ $t(btn.text) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AlertLayout",
  computed: {
    alert: function () {
      return this.$appdata.get("alert");
    },
  },
  methods: {
    clickBtn(value) {
      this.$appdata.set("alert.value", value);
      this.$appdata.set("alert.show", false);
    },
  },
};
</script>

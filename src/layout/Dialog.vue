<template>
  <v-dialog
    v-model="dialog.show"
    max-width="450"
    persistent
    :theme="$store.state.data.layout.dark ? 'dark' : ''"
  >
    <v-card>
      <v-card-title v-if="dialog.title">{{ dialog.title }}</v-card-title>
      <v-spacer></v-spacer>
      <v-card-text v-if="dialog.text">
        <div v-html="dialog.text" />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="(btn, index) in dialog.buttons"
          :key="index"
          :color="btn.color ? btn.color : layout.color"
          @click="
            dialog.value = btn.value;
            dialog.show = false;
          "
          text
        >
          {{ btn.text }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script>
export default {
  computed: {
    dialog: function () {
      return this.$store.state.dialog;
    },
    layout: function () {
      return this.$store.state.data.layout;
    },
  },
};
</script>
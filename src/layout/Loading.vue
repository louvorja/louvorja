<template>
  <v-dialog v-model="show" max-width="320" persistent>
    <v-list color="primary" elevation="12" rounded="lg">
      <v-list-item prepend-icon="$louvorja">
        <template v-slot:prepend>
          <div class="pe-4">
            <img src="/ico/favicon.svg" :width="32" />
          </div>
        </template>

        {{ $t("alert.wait") }}

        <template v-slot:append>
          <v-progress-circular
            color="primary"
            indeterminate="disable-shrink"
            size="16"
            width="2"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-dialog>
</template>

<script>
export default {
  name: "LoadingLayout",
  computed: {
    show: {
      get() {
        return this.$appdata.get("loading");
      },
      set(value) {
        this.$appdata.set("loading", value);
      },
    },
  },
};
</script>

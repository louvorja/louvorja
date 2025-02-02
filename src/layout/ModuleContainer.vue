<template>
  <Window
    v-if="manifest"
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    :size="manifest?.moduleOptions?.size ?? null"
    @close="close()"
    @minimize="minimize()"
  >
    <template v-slot:header>
      <slot name="header" />
    </template>
    <template v-slot:left>
      <slot name="left" />
    </template>
    <template v-slot:right>
      <slot name="right" />
    </template>

    <template v-slot:default>
      <slot />
    </template>
  </Window>
</template>

<script>
import Window from "@/components/Window.vue";

export default {
  name: "ModuleContainer",
  components: {
    Window,
  },
  props: {
    manifest: {
      type: Object,
      required: true,
    },
  },
  computed: {
    module_id() {
      return this.manifest.id;
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    show() {
      return this.module.show;
    },
  },
  watch: {
    show(value) {
      this.$emit("show", value);
    },
  },
  methods: {
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    close() {
      this.$modules.close(this.module_id);
      this.$emit("close");
    },
    minimize() {
      this.$modules.minimize(this.module_id);
      this.$emit("minimize");
    },
  },
};
</script>

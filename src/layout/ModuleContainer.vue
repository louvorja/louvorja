<template>
  <l-window
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    <template v-slot:header>
      <slot name="header"></slot>
    </template>

    <template v-slot:default>
      <slot></slot>
    </template>
  </l-window>
</template>

<script>
import LWindow from "@/components/Window.vue";

export default {
  name: "ModuleContainer",
  components: {
    LWindow,
  },
  props: {
    manifest: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /* COMPUTEDS OBRIGATÓRIAS - INÍCIO */
    /* NÃO MODIFICAR */
    module_id() {
      return this.manifest.id;
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    /* COMPUTEDS OBRIGATÓRIAS - FIM */
  },
  methods: {
    /* METHODS OBRIGATÓRIOS - INÍCIO */
    /* NÃO MODIFICAR */
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    /* METHODS OBRIGATÓRIOS - FIM */
  },
};
</script>

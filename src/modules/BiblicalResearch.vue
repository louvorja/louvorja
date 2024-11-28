<template>
  <popup
    v-model="module.show"
    :title="module.title"
    :icon="module.icon"
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    BiblicalResearch
  </popup>
</template>

<script>
import Popup from "@/components/Window.vue";

export default {
  name: "BiblicalResearchModule",
  components: {
    Popup,
  },
  data: () => ({
    module_id: "biblical_research",
  }),
  computed: {
    module() {
      return this.$modules.get(this.module_id);
    },
  },
};
</script>

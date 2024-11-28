<template>
  <popup
    v-model="module.show"
    :title="module.title"
    :icon="module.icon"
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    Bible
  </popup>
</template>

<script>
import Popup from "@/components/Window.vue";

export default {
  name: "BibleModule",
  components: {
    Popup,
  },
  data: () => ({
    module_id: "bible",
  }),
  computed: {
    module() {
      return this.$modules.get(this.module_id);
    },
  },
};
</script>

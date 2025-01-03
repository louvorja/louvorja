<template>
  <v-btn
    v-if="!is_mobile"
    :variant="variant"
    :size="size"
    :active="is_popup_opened"
    icon="mdi-open-in-new"
    :class="{ 'rotate-icon': is_selected }"
    @click="popup()"
  />
</template>

<script>
export default {
  name: "ButtonScreenComponent",
  props: {
    module: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
    variant: {
      type: String,
      default: "text",
    },
  },
  computed: {
    is_mobile: function () {
      return this.$appdata.get("is_mobile");
    },
    is_popup_opened: function () {
      return !!this.$appdata.get("popup");
    },
    popup_module: function () {
      return this.$appdata.get("popup_module");
    },
    is_selected: function () {
      return this.is_popup_opened && this.popup_module == this.module;
    },
  },
  methods: {
    popup: function () {
      if (this.is_selected) {
        this.$popup.exit();
      } else {
        this.$popup.open(this.module);
      }
    },
  },
};
</script>

<style scoped>
.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>

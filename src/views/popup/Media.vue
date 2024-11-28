<template>
  <l-slide
    v-if="slide"
    :slide_number="config.slide_index"
    :cover="slide.cover == true"
    :text="slide.lyric"
    :aux_text="slide.aux_lyric"
    :image="$path.file(slide.url_image)"
    :image_position="slide.image_position"
  />
</template>

<script>
import LSlide from "@/components/Slide.vue";

export default {
  name: "PopupMediaPage",
  components: {
    LSlide,
  },
  computed: {
    module_id() {
      return "media";
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    loading() {
      return this.module.loading;
    },
    config() {
      return this.$media.config();
    },
    slide_index() {
      return this.config.slide_index;
    },
    slides() {
      return this.$media.slides();
    },
    slide() {
      return this.$media.slide();
    },
  },
};
</script>

<template>
  <l-window
    v-model="module.show"
    :title="config.title"
    :subtitle="
      config.subtitle +
      (config.track > 0
        ? ' | ' + $t('modules.media.general.track') + ' ' + config.track
        : '')
    "
    :image="config.image ? $path.file(config.image) : ''"
    closable
    size="small"
    @close="$media.closeLyric()"
  >
    <v-skeleton-loader v-if="module.loading" type="text@5" />
    <div v-else>
      <div v-for="line in lyric" :key="line.id_lyric">
        <b v-if="line.aux_lyric">{{ line.aux_lyric }}</b>
        {{ line.lyric }}&nbsp;
      </div>
    </div>
  </l-window>
</template>

<script>
import LWindow from "@/components/Window.vue";

export default {
  name: "LyricModule",
  components: {
    LWindow,
  },
  data: () => ({
    module_id: "lyric",
  }),
  computed: {
    module() {
      return this.$modules.get(this.module_id);
    },
    config() {
      return this.module.config;
    },
    lyric() {
      return this.module.data?.lyric?.slice().sort((a, b) => a.order - b.order);
    },
  },
};
</script>

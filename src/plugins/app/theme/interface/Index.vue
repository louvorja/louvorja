<template>
  <l-window
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    size="small"
    @close="$modules.close(module_id)"
    @minimize="$modules.minimize(module_id)"
  >
    <div v-for="(group, mode) in themes" :key="mode" class="mb-3">
      <div class="subtitle-1 font-weight-medium">
        {{ mode == "dark" ? t("dark-themes") : t("light-themes") }}
      </div>

      <v-btn
        v-for="(theme, theme_id) in group"
        :key="theme_id"
        icon
        density="compact"
        :variant="current == theme_id ? 'outlined' : 'text'"
        class="mx-1"
        @click="setTheme(theme_id)"
      >
        <v-avatar :color="theme.colors.primary" size="22" />
      </v-btn>
    </div>
  </l-window>
</template>

<script>
import manifest from "../manifest.json";

import LWindow from "@/components/Window.vue";

export default {
  name: "ThemeModule",
  components: {
    LWindow,
  },
  data: () => ({
    current: {},
    themes: {},
  }),
  computed: {
    /* COMPUTEDS OBRIGATÓRIAS - INÍCIO */
    /* NÃO MODIFICAR */
    module_id() {
      return manifest.id;
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
    setTheme(theme_id) {
      this.current = theme_id;
      this.$vuetify.theme.global.name = this.current;
      this.$userdata.set("theme", this.current);
      this.$appdata.set("is_dark", this.$vuetify.theme.global.current.dark);
    },
  },
  mounted() {
    this.current = this.$vuetify.theme.global.name;
    this.themes = { light: {}, dark: {} };

    for (const key in this.$vuetify.theme.themes) {
      const item = this.$vuetify.theme.themes[key];
      if (item.dark) {
        this.themes.dark[key] = item;
      } else {
        this.themes.light[key] = item;
      }
    }
  },
};
</script>

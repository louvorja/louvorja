<template>
  <l-window
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    compact
    @close="
      close();
      $modules.close(module_id);
    "
    @minimize="$modules.minimize(module_id)"
    @resize="resize"
    slot-left-class="w-50"
  >
    <template v-slot:header> HEADER|{{ tab }}|{{ height }} </template>

    <template v-slot:left>
      <div class="d-flex flex-row h-100">
        <v-tabs v-model="tab" :color="$theme.primary()" direction="vertical">
          <v-tab value="option-1">
            <v-avatar :color="$theme.primary()">VER</v-avatar>
          </v-tab>
          <v-tab value="option-2">
            <v-avatar :color="$theme.primary()">LIV</v-avatar>
          </v-tab>
          <v-tab value="option-3">
            <v-avatar :color="$theme.primary()">CAP</v-avatar>
          </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab" class="w-100">
          <v-tabs-window-item value="option-1">
            <v-card flat>
              <v-toolbar :height="40">
                <v-toolbar-title class="text-h5">Versão</v-toolbar-title>
              </v-toolbar>
              <v-card-text
                :style="{ height: height - 40 + 'px' }"
                class="overflow-auto d-flex flex-wrap justify-center ma-0 pa-0"
              >
                <v-card
                  color="#952175"
                  width="100%"
                  :height="80"
                  class="ma-1"
                  v-for="n in 100"
                  :key="n"
                >
                  <v-card-title class="text-h4 text-center pa-0 ma-0">
                    VARA
                  </v-card-title>
                  <v-card-subtitle class="text-center pa-0 ma-0 mx-1">
                    Ellie Goulding fgh dfhg fdgh fdgh fg
                  </v-card-subtitle>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-2">
            <v-card flat>
              <v-toolbar :height="40">
                <v-toolbar-title class="text-h5">Versão</v-toolbar-title>
              </v-toolbar>
              <v-card-text
                :style="{ height: height - 40 + 'px' }"
                class="overflow-auto d-flex flex-wrap justify-center ma-0 pa-0"
              >
                <v-card
                  color="#952175"
                  :width="120"
                  :height="80"
                  class="ma-1"
                  v-for="n in 100"
                  :key="n"
                >
                  <v-card-title class="text-h4 text-center pa-0 ma-0">
                    VARA
                  </v-card-title>
                  <v-card-subtitle class="text-center pa-0 ma-0 mx-1">
                    Ellie Goulding fgh dfhg fdgh fdgh fg
                  </v-card-subtitle>
                </v-card>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>

          <v-tabs-window-item value="option-3">
            <v-card flat>
              <v-card-text>
                <p>
                  Fusce a quam. Phasellus nec sem in justo pellentesque
                  facilisis. Nam eget dui. Proin viverra, ligula sit amet
                  ultrices semper, ligula arcu tristique sapien, a accumsan nisi
                  mauris ac eros. In dui magna, posuere eget, vestibulum et,
                  tempor auctor, justo.
                </p>

                <p class="mb-0">
                  Cras sagittis. Phasellus nec sem in justo pellentesque
                  facilisis. Proin sapien ipsum, porta a, auctor quis, euismod
                  ut, mi. Donec quam felis, ultricies nec, pellentesque eu,
                  pretium quis, sem. Nam at tortor in tellus interdum sagittis.
                </p>
              </v-card-text>
            </v-card>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </template>

    <v-alert
      v-if="error"
      type="error"
      :text="error"
      variant="tonal"
      border="start"
      class="ma-2"
    />

    <template v-slot:right> RIGHT </template>
  </l-window>
</template>

<script>
import manifest from "../manifest.json";
import LWindow from "@/components/Window.vue";

export default {
  name: "CollectionsModule",
  components: {
    LWindow,
  },
  data: () => ({
    lang: null,
    loading: false,
    error: null,
    tab: null,
    height: 0,
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

    show() {
      return this.module.show;
    },
  },
  watch: {
    async show() {
      if (this.show && this.lang != this.$i18n.locale) {
        await this.loadData();
      }
    },
  },
  methods: {
    /* METHODS OBRIGATÓRIOS - INÍCIO */
    /* NÃO MODIFICAR */
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    /* METHODS OBRIGATÓRIOS - FIM */

    async loadData() {
      this.loading = true;
      /*
      this.categories = await this.$database.get(
        `${this.$i18n.locale}_categories`
      );

      if (this.categories == null) {
        this.$modules.close(this.module_id);
        return;
      }

      if (this.categories.length > 0) {
        this.categories.sort((a, b) => a.order - b.order);
        this.id_category = this.categories[0].id_category;
      } else {
        this.id_category = 0;
      }
*/
      this.lang = this.$i18n.locale;
      this.loading = false;
    },
    resize(data) {
      this.height = data.container_height;
    },
    close() {
      //Se fechar a janela, não manter o histórico.
      /* */
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<template>
  <div class="apps">
    <v-expansion-panels v-model="panels_active" flat multiple :rounded="false">
      <v-expansion-panel
        v-for="(group, group_key) in module_group"
        :key="group_key"
      >
        <v-expansion-panel-title class="my-0 py-0">
          {{ $t(group.title) }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-container fluid class="my-0 py-0">
            <v-row class="my-0 py-0">
              <template
                v-for="(module, module_key) in sortModules(group.modules)"
                :key="module_key"
              >
                <v-card
                  v-if="
                    module.language
                      ? module.language == $userdata.get('language')
                      : true
                  "
                  hover
                  :color="module.invalid ? 'error' : $theme.primary()"
                  @click="$modules.open(module_key)"
                  class="ma-2"
                  :width="130"
                >
                  <div
                    class="d-flex flex-column align-center justify-center h-100"
                  >
                    <v-avatar class="ma-3" rounded="0" size="40">
                      <v-icon :icon="module.icon" color="#FFFFFF" :size="40" />
                    </v-avatar>
                    <div class="w-100">
                      <v-card-title
                        class="text-caption text-center"
                        style="text-wrap: initial"
                      >
                        {{ module.title ? $t(module.title) : "" }}
                      </v-card-title>
                    </div>
                  </div>
                </v-card>
              </template>
            </v-row>
          </v-container>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
export default {
  name: "AppsLayout",
  data: () => ({
    panels_active: [],

    selectedTheme: "",
    themes: [],
  }),
  watch: {
    module_group() {
      this.panels_active = Object.keys(this.module_group).map((_, key) => key);
    },
  },
  computed: {
    module_group() {
      return Object.entries(this.$modules.getGroups())
        .filter(([, value]) => Object.keys(value.modules).length > 0)
        .reduce((result, [key, value]) => {
          result[key] = value;
          return result;
        }, {});
    },
  },
  methods: {
    sortModules(modules) {
      //Ordena pelo idioma selecionado
      return Object.entries(modules)
        .sort(([, v1], [, v2]) => {
          const t1 = v1?.title ? this.$t(v1.title).toLowerCase() : "";
          const t2 = v2?.title ? this.$t(v2.title).toLowerCase() : "";
          return t1.localeCompare(t2);
        })
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    },
  },
};
</script>

<style scoped>
.apps {
  overflow: auto !important;
  width: 100%;
}
</style>

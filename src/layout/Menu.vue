<template>
  <v-navigation-drawer
    v-model="show"
    :location="$vuetify.display.width < 600 ? 'bottom' : undefined"
    temporary
  >
    <v-list :baseColor="$theme.primary()" nav>
      <v-list-item
        v-for="(module, module_key) in menu_modules"
        :key="module_key"
        :prepend-icon="module.icon"
        @click="
          $appdata.toogle('menu.show');
          $modules.open(module_key);
        "
      >
        <v-list-item-title>{{ $t(module.title) }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="is_dev"
        :prepend-icon="modules.dev.icon"
        @click="
          $appdata.toogle('menu.show');
          $modules.open('dev');
        "
      >
        <v-list-item-title>{{ $t(modules.dev.title) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MenuLayout",
  computed: {
    show: {
      get() {
        return this.$appdata.get("menu.show");
      },
      set(value) {
        if (!value) {
          this.$appdata.toogle("menu.show");
        }
      },
    },
    menu_modules() {
      return this.$modules.getMenu();
    },
    modules() {
      return this.$appdata.get("modules");
    },
    is_dev() {
      return this.$appdata.get("is_dev");
    },
  },
};
</script>

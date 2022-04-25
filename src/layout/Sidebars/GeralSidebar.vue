<template>
  <v-navigation-drawer
    v-model="$root.sidebar.geral"
    absolute
    left
    temporary
    :width="width"
    :dark="$root.data.layout.dark"
  >
    <v-tabs
      vertical
      v-model="active_menu"
      :color="$root.data.layout.color"
      :dark="$root.data.layout.dark"
    >
      <v-tab
        v-for="(m, index) in menu"
        :key="m.tab"
        style="justify-content: start"
        :data-id="index"
      >
        <v-icon left> {{ m.icon }} </v-icon>
        {{ m.tab }}
      </v-tab>
      <v-tabs-items v-model="active_menu" :dark="$root.data.layout.dark">
        <v-tab-item v-for="m in menu" :key="m.tab">
          <!--<div v-if="m.component">-->
            <div class="text-h6 mt-3">
              {{ m.tab }}
            </div>
            <v-divider class="my-3"></v-divider>
            <component v-bind="menu" :is="m.component"></component>
        <!--  </div>-->
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      active_menu: 0,
      menu: [
        {
          tab: "Configurações",
          icon: "mdi-account",
          component: "config",
        },
        {
          tab: "Aparência",
          icon: "mdi-palette",
          component: "temas",
        },
        {
          tab: "Transmissão",
          icon: "mdi-access-point",
          //content: "server",
          component: "temas",
        },
        {
          tab: "Loja",
          icon: "mdi-access-point",
          component: "store",
          width: "95%",
        },
        {
          tab: "Loja 2",
          icon: "mdi-access-point",
          component: "store",
        },
      ],
    };
  },
  computed: {
    width: function () {
      return this.menu[this.active_menu].width || "490px";
    },
  },
  components: {
    config: () => import(`./partials/Config`),
    temas: () => import(`./partials/Temas`),
    store: () => import(`./partials/Store`),
  },
};
</script>
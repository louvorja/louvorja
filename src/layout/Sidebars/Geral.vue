<template>
  <v-navigation-drawer
    v-model="$root.sidebar.geral"
    absolute
    left
    temporary
    width="450px"
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
          <div class="text-h6 mt-3">
            {{ m.tab }}
          </div>
          <v-divider class="my-3"></v-divider>

          <div v-if="m.content == 'config'">A......</div>

          <div v-else-if="m.content == 'temas'">
            <div class="px-2" v-if="skins">
              <div v-for="list in skins" :key="list.title">
                <div class="text-h7 pt-3 pb-2">{{ list.title }}</div>
                <v-btn
                  icon
                  v-for="skin in list.list"
                  :key="skin.id"
                  @click="changeTheme(skin)"
                  :outlined="$root.data.layout.id == skin.id"
                >
                  <v-avatar :color="skin.color" size="16"> </v-avatar>
                </v-btn>
              </div>
            </div>
          </div>
          <div v-else>
            {{ m.content }}
          </div>
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
      layout: [
        { id: 1, color: "#29569b", dark: false },
        { id: 2, color: "#077568", dark: false },
        { id: 3, color: "#d24726", dark: false },
        { id: 4, color: "#80397b", dark: false },
        { id: 5, color: "#E91E63", dark: false },
        { id: 6, color: "#2e2e2e", dark: false },
        { id: 7, color: "#2e2e2e", dark: true },
      ],
      menu: [
        {
          tab: "Configurações",
          icon: "mdi-account",
          content: "config",
        },
        {
          tab: "Aparência",
          icon: "mdi-palette",
          content: "temas",
        },
        {
          tab: "Transmissão",
          icon: "mdi-access-point",
          content: "server",
        },
      ],
    };
  },
  computed: {
    skins: function () {
      return [
        { title: "Temas Claros", list: this.skins_light },
        { title: "Temas Escuros", list: this.skins_dark },
      ];
    },
    skins_light: function () {
      return this.layout.filter((item) => {
        return !item.dark;
      });
    },
    skins_dark: function () {
      return this.layout.filter((item) => {
        return item.dark;
      });
    },
  },
  components: {
    //lInput: () => import(`@/components/Input`)
  },
  methods: {
    changeTheme: function (skin) {
      this.$root.data.layout = skin;
    },
  },
};
</script>
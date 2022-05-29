<template>
  <header>
    <v-card rounded="0">
      <v-toolbar
        :class="!sidebar ? 'headerbar' : ''"
        :color="$root.data.layout.color"
        dark
        flat
      >
        <v-btn icon>
          <ico
            @click.native="$root.sidebar.geral = !$root.sidebar.geral"
            src="louvorja"
            size="40"
          />
        </v-btn>
        <v-app-bar-nav-icon
          @click.native="$root.sidebar.geral = !$root.sidebar.geral"
        >
        </v-app-bar-nav-icon>

        <v-toolbar-title class="ml-5">LouvorJA</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon to="/"><v-icon>mdi-home-circle-outline</v-icon></v-btn>
        <v-btn icon><v-icon>mdi-magnify</v-icon></v-btn>

        <v-btn plain @click="$root.send('minimize')" v-if="$root.desktop">
          <v-icon>mdi-window-minimize</v-icon>
        </v-btn>
        <v-btn
          plain
          @click="$root.send('maximize')"
          v-if="$root.desktop && $root.maximize"
        >
          <v-icon>mdi-window-restore</v-icon>
        </v-btn>
        <v-btn
          plain
          @click="$root.send('maximize')"
          v-if="$root.desktop && !$root.maximize"
        >
          <v-icon>mdi-window-maximize</v-icon>
        </v-btn>
        <v-btn
          plain
          class="btn-close"
          @click="$root.send('close')"
          v-if="$root.desktop"
        >
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-tabs
        v-model="$root.active_header_tab"
        dark
        :background-color="$root.data.layout.color"
        show-arrows
      >
        <v-tab
          v-for="(item, index) in items_tabs"
          :key="item.tab"
          :class="item.visible ? 'active_header_tab' : ''"
          :data-id="index"
        >
          {{ item.tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="$root.active_header_tab"
        :dark="$root.data.layout.dark"
        style="min-height:72px"
      >
        <v-tab-item v-for="item in items" :key="item.tab">
          <v-slide-group show-arrows>
            <keep-alive :include="tabs">
              <transition>
                <component
                  :is="item.component"
                  v-show="item.component && item.visible == $route.name"
                />
              </transition>
            </keep-alive>
            <span v-if="typeof item.content === 'string'">
              {{ item.content }}
            </span>
            <template v-else>
              <v-btn-toggle
                v-for="(group, index) in item.content"
                :key="index"
                dense
                group
              >
                <v-divider v-if="index > 0" class="mx-4" vertical></v-divider>
                <span v-for="(el, el_index) in group" :key="el_index">
                  <l-button v-if="el.type === 'button'" :route="el.route" />
                </span>
              </v-btn-toggle>
            </template>
          </v-slide-group>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </header>
</template>

<style scoped>
header .headerbar {
  -webkit-app-region: drag !important;
}
header .headerbar .v-btn {
  -webkit-app-region: no-drag !important;
  user-select: none !important;
}
header .headerbar .v-btn.btn-close:hover {
  background: red !important;
}
header .active_header_tab {
  background-color: rgba(0, 0, 0, 0.25);
}

.v-leave {
  opacity: 1;
}
.v-leave-active {
  transition: opacity 0.5s;
}
.v-leave-to {
  opacity: 0;
}
</style>

<script>
export default {
  data() {
    return {
      items: [
        {
          tab: "Coletâneas",
          content: [
            [
              { type: "button", route: "hinario" },
              { type: "button", route: "hinario" },
            ],
            [{ type: "button", route: "localizar-musicas" }],
          ],
        },
        {
          tab: "Coletâneas On-line",
          content: [[{ type: "button", route: "videos-online" }]],
        },
        {
          tab: "Bíblia",
          content: [[{ type: "button", route: "biblia" }]],
        },
        {
          tab: "Utilitários",
          content: [
            [
              { type: "button", route: "liturgia" },
              { type: "button", route: "itens-agendados" },
            ],
            [
              { type: "button", route: "cronometro" },
              { type: "button", route: "relogio" },
              { type: "button", route: "cronometro-culto" },
            ],
            [{ type: "button", route: "sorteio" }],
          ],
        },
        {
          tab: "Cronômetro",
          visible: "cronometro",
          component: "cronometro",
        },
      ],
    };
  },
  computed: {
    items_tabs: function () {
      var self = this;
      return this.items.filter((item) => {
        return item.visible == undefined || item.visible == self.$route.name;
      });
    },
    sidebar: function () {
      return (
        Object.values(this.$root.sidebar).filter(function (key) {
          return key;
        }).length > 0
      );
    },
    tabs: function () {
      return this.$root.openpages.map((item) => {
        return item.name;
      });
    },
  },
  components: {
    lButton: () => import(`@/components/Button`),
    cronometro: () => import(`@/layout/headertabs/CronometroTab`),
    ico: () => import(`@/components/Icone`),
  },
};
</script>
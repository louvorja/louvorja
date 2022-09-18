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

        <v-toolbar-title class="ml-5">{{ $t("app.name") }}</v-toolbar-title>
        <v-toolbar-title v-if="debug" class="ml-5">[ DEBUG ]</v-toolbar-title>

        <v-spacer></v-spacer>

        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on">
                <flag :iso="$root.flag(lang)" />
                {{ lang }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="$root.changeLocale('pt')">
                <v-list-item-icon><flag iso="br" /></v-list-item-icon>
                <v-list-item-title>Português</v-list-item-title>
              </v-list-item>
              <v-list-item @click="$root.changeLocale('es')">
                <v-list-item-icon><flag iso="es" /></v-list-item-icon>
                <v-list-item-title>Espanhol</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-btn icon to="/"><v-icon>mdi-home-circle-outline</v-icon></v-btn>
        <v-btn
          icon
          @click="search()"
          v-shortkey="['ctrl','f']"
          @shortkey="search()"
          ><v-icon>mdi-magnify</v-icon></v-btn
        >

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
          :key="index"
          :class="item.visible ? 'active_header_tab' : ''"
          :data-id="index"
        >
          {{ $t(item.tab) }}
        </v-tab>
      </v-tabs>
      <v-tabs-items
        v-model="$root.active_header_tab"
        :dark="$root.data.layout.dark"
        style="min-height: 72px"
      >
        <v-tab-item v-for="(item, index) in items_tabs" :key="index">
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
          tab: "collections",
          content: [
            [{ type: "button", route: "hymnal" }],
            [{ type: "button", route: "find-musics" }],
          ],
        },
        {
          tab: "online-collections",
          content: [[{ type: "button", route: "online-videos" }]],
        },
        {
          tab: "bible",
          content: [[{ type: "button", route: "bible" }]],
        },
        /*{
          tab: "utilities",
          content: [
            [
              { type: "button", route: "liturgy" },
              { type: "button", route: "scheduled-items" },
            ],
            [
              { type: "button", route: "stopwatch" },
              { type: "button", route: "clock" },
              { type: "button", route: "worship-timer" },
            ],
            [{ type: "button", route: "sweepstake" }],
          ],
        },
        {
          tab: "stopwatch",
          visible: "stopwatch",
          component: "stopwatch",
        },
        {
          tab: "find-musics",
          visible: "find-musics",
          component: "findmusic",
        },*/
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
    debug: function () {
      return this.$root.debug;
    },
    lang: function () {
      return this.$root.data.lang;
    },
  },
  components: {
    lButton: () => import(`@/components/Button`),
    stopwatch: () => import(`@/layout/headertabs/StopwatchTab`),
    findmusic: () => import(`@/layout/headertabs/FindMusicTab`),
    ico: () => import(`@/components/Icon`),
  },
  methods: {
    search: function () {
      alert("Busca em construção");
    },
  },
};
</script>
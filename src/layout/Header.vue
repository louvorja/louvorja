<template>
  <header>
    <v-card rounded="0">
      <v-system-bar
        :class="!sidebar ? 'headerbar' : ''"
        :color="$store.state.data.layout.color"
        dark
        flat
      >
        <v-btn small icon>
          <ico
            @click.native="
              $store.state.sidebar.geral = !$store.state.sidebar.geral
            "
            src="louvorja"
            size="20"
          />
        </v-btn>
        <v-btn
          x-small
          plain
          class="mx-2"
          @click.native="
            $store.state.sidebar.geral = !$store.state.sidebar.geral
          "
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- Título -->
        <span class="ellipsis">{{ $t("app.name") }}</span>
        <span v-if="debug" class="ml-5 ellipsis">[ DEBUG ]</span>

        <!-- Espaçador -->
        <v-spacer></v-spacer>

        <!-- Botão Home -->
        <v-btn x-small text class="mx-2" to="/">
          <v-icon :size="15">mdi-home-circle-outline</v-icon>
        </v-btn>

        <!-- Botão de Busca -->
        <v-btn
          x-small
          plain
          class="mx-2"
          @click="search()"
          v-shortkey="['ctrl', 'f']"
          @shortkey="search()"
        >
          <v-icon :size="15">mdi-magnify</v-icon>
        </v-btn>

        <v-divider vertical />

        <!-- Seletor de Idioma -->
        <div class="text-center mx-2">
          <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn small plain v-bind="attrs" v-on="on">
                <img
                  :height="15"
                  :src="img(`flags/${flag(lang)}.svg`)"
                  style="margin-right: 1px"
                />
                {{ lang }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="changeLocale('pt')">
                <v-list-item-icon>
                  <img :src="img(`flags/br.svg`)" />
                </v-list-item-icon>
                <v-list-item-title>Português</v-list-item-title>
              </v-list-item>
              <v-list-item @click="changeLocale('es')">
                <v-list-item-icon>
                  <img :src="img(`flags/es.svg`)" />
                </v-list-item-icon>
                <v-list-item-title>Espanhol</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Divisor -->
        <v-divider vertical v-if="$store.state.download.show" />

        <!-- Botão de Download -->
        <div class="text-center mx-2" v-if="$store.state.download.show">
          <v-menu offset-y left>
            <template v-slot:activator="{ on, attrs }">
              <v-progress-circular
                :indeterminate="
                  !$store.state.download.max_value ||
                  !$store.state.download.value
                "
                :size="23"
                :width="2"
                :value="
                  (($store.state.download.value || 0) /
                    ($store.state.download.max_value || 0)) *
                  100
                "
                :rotate="
                  !$store.state.download.max_value ||
                  !$store.state.download.value
                    ? 0
                    : 280
                "
                color="white"
              >
                <v-btn x-small plain v-bind="attrs" v-on="on">
                  <v-icon :size="13" style="padding-left: 2px">
                    mdi-download
                  </v-icon>
                </v-btn>
              </v-progress-circular>
            </template>
            <v-list :width="300">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-if="$store.state.download.title">
                    {{ $store.state.download.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="$store.state.download.subtitle">
                    {{ $store.state.download.subtitle }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="$store.state.download.file.name">
                <v-list-item-content>
                  <v-layout width="100%">
                    <v-flex style="width: 100%" class="pt-2 pe-1">
                      <v-progress-linear
                        :width="2"
                        :value="
                          (($store.state.download.value || 0) /
                            ($store.state.download.max_value || 1)) *
                          100
                        "
                        color="info"
                      />
                    </v-flex>
                    <v-flex>
                      <span class="text-caption" style="white-space: nowrap">
                        {{ $store.state.download.file.downloaded_size | size }}
                        /
                        {{ $store.state.download.file.size | size }}
                      </span>
                    </v-flex>
                  </v-layout>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="$store.state.download.file.name">
                <v-list-item-content>
                  <span class="text-caption">
                    Arquivo
                    {{ +$store.state.download.file.qt_downloaded }}
                    de
                    {{
                      +$store.state.download.file.qt_downloaded +
                      +$store.state.download.file.qt_remaining -
                      1
                    }}
                  </span>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Divisor -->
        <v-divider vertical v-if="$store.state.desktop" />

        <!-- Botões de Minimizar, Maximizar, Restaurar e Fechar -->
        <v-btn x-small plain @click="minimize()" v-if="$store.state.desktop">
          <v-icon :size="15">mdi-window-minimize</v-icon>
        </v-btn>
        <v-btn
          x-small
          plain
          @click="maximize()"
          v-if="$store.state.desktop && $store.state.maximize"
        >
          <v-icon :size="15">mdi-window-restore</v-icon>
        </v-btn>
        <v-btn
          x-small
          plain
          @click="maximize()"
          v-if="$store.state.desktop && !$store.state.maximize"
        >
          <v-icon :size="15">mdi-window-maximize</v-icon>
        </v-btn>
        <v-btn
          x-small
          plain
          class="btn-close"
          @click="close()"
          v-if="$store.state.desktop"
        >
          <v-icon :size="15">mdi-window-close</v-icon>
        </v-btn>
      </v-system-bar>
      <v-tabs
        v-model="$store.state.active_header_tab"
        dark
        :background-color="$store.state.data.layout.color"
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
        v-model="$store.state.active_header_tab"
        :dark="$store.state.data.layout.dark"
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
import filters from "@/filters";

const System = require("../helpers/System.js");
const Locale = require("../helpers/Locale.js");
const Files = require("../helpers/Files.js");

export default {
  filters,
  data() {
    return {
      items: [
        {
          tab: "collections",
          content: [
            [{ type: "button", route: "hymnal" }],
            [{ type: "button", route: "collections" }],
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
        Object.values(this.$store.state.sidebar).filter(function (key) {
          return key;
        }).length > 0
      );
    },
    tabs: function () {
      return this.$store.state.openpages.map((item) => {
        return item.name;
      });
    },
    debug: function () {
      return this.$store.state.debug;
    },
    lang: function () {
      return this.$store.state.data.lang;
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
    changeLocale: function (lang) {
      this.$store.state.lang = Locale.change(lang);
    },
    flag: function (lang) {
      return Locale.flag(lang);
    },
    maximize() {
      System.maximize();
    },
    minimize() {
      System.minimize();
    },
    close() {
      System.close();
    },
    img: function (dir) {
      return Files.img(dir);
    },
  },
};
</script>
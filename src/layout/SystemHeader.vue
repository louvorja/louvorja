<template>
  <header class="w-100">
    <v-system-bar
      window
      :theme="$store.state.data.layout.dark ? 'dark' : ''"
      :class="!sidebar ? 'headerbar' : ''"
      :color="$store.state.data.layout.color"
      flat
    >
      <v-btn icon size="x-small">
        <ico
          @click.native="
            $store.state.sidebar.geral = !$store.state.sidebar.geral
          "
          src="louvorja"
          size="20"
        />
      </v-btn>
      <v-btn
        icon="mdi-menu"
        class="text-white"
        @click.native="$store.state.sidebar.geral = !$store.state.sidebar.geral"
      />

      <!-- Título -->
      <span class="ellipsis text-white text-left">
        {{ $t("app.name") }} {{ debug ? "[ DEBUG ]" : "" }}
      </span>

      <!-- Espaçador -->
      <v-spacer />

      <!-- Botão Home -->
      <v-btn
        icon="mdi-home-circle-outline"
        size="small"
        to="/"
        class="text-white"
      />

      <!-- Botão de Busca -->
      <v-btn
        icon="mdi-magnify"
        size="small"
        class="text-white"
        @click="search()"
        v-shortkey="['ctrl', 'f']"
        @shortkey="search()"
      />

      <!-- Botão Monitores -->
      <v-btn
        v-if="$store.state.desktop"
        icon="mdi-monitor-multiple"
        size="small"
        class="text-white"
        @click="showScreen()"
      />

      <!-- Botão Nuvem -->
      <v-btn
        v-if="$store.state.desktop"
        :icon="
          $store.state.data.online ? 'mdi-cloud' : 'mdi-cloud-cancel-outline'
        "
        size="small"
        class="text-white"
        @click="chageOnline()"
      />

      <!-- Divisor -->
      <v-divider vertical />

      <!-- Seletor de Idioma -->
      <div class="text-center mx-2">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn class="text-white" size="small" v-bind="props">
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
              <template v-slot:prepend>
                <img :src="img(`flags/br.svg`)" :height="20" class="mr-1" />
              </template>
              <v-list-item-title>Português</v-list-item-title>
            </v-list-item>
            <v-list-item @click="changeLocale('es')">
              <template v-slot:prepend>
                <img :src="img(`flags/es.svg`)" :height="20" class="mr-1" />
              </template>
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
          <template v-slot:activator="{ props }">
            <v-progress-circular
              :indeterminate="
                !$store.state.download.max_value || !$store.state.download.value
              "
              :size="23"
              :width="2"
              :model-value="
                (($store.state.download.value || 0) /
                  ($store.state.download.max_value || 0)) *
                100
              "
              :rotate="0"
              color="white"
            >
              <v-btn
                icon="mdi-download"
                size="small"
                class="text-white"
                v-bind="props"
              />
            </v-progress-circular>
          </template>
          <v-list :width="400">
            <v-list-item
              v-if="
                $store.state.download.title || $store.state.download.subtitle
              "
              :title="$store.state.download.title"
              :subtitle="$store.state.download.subtitle"
            />
            <v-list-item v-if="$store.state.download.file.name">
              <v-progress-linear
                :width="2"
                :model-value="
                  (($store.state.download.value || 0) /
                    ($store.state.download.max_value || 1)) *
                  100
                "
                color="info"
              />

              <template v-slot:append>
                <span class="text-caption nowrap ml-2">
                  {{
                    $filters.size($store.state.download.file.downloaded_size)
                  }}
                  /
                  {{ $filters.size($store.state.download.file.size) }}
                </span>
              </template>
            </v-list-item>
            <v-list-item v-if="$store.state.download.file.name">
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
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Divisor -->
      <v-divider vertical v-if="$store.state.desktop" />

      <!-- Botões de Minimizar, Maximizar, Restaurar e Fechar -->
      <v-btn
        icon="mdi-window-minimize"
        size="small"
        class="text-white"
        @click="minimize()"
        v-if="$store.state.desktop"
      />
      <v-btn
        icon="mdi-window-restore"
        size="small"
        class="text-white"
        @click="maximize()"
        v-if="$store.state.desktop && $store.state.maximize"
      />
      <v-btn
        icon="mdi-window-maximize"
        size="small"
        class="text-white"
        @click="maximize()"
        v-if="$store.state.desktop && !$store.state.maximize"
      />
      <v-btn
        icon="mdi-close"
        size="small"
        class="text-white btn-close"
        @click="close()"
        v-if="$store.state.desktop"
      />
    </v-system-bar>
  </header>
</template>

<style scoped>
header .v-system-bar {
  position: initial !important;
}
header .headerbar {
  -webkit-app-region: drag !important;
}
header .headerbar .v-btn {
  -webkit-app-region: no-drag !important;
  user-select: none !important;
}
/*
header .headerbar .v-btn.btn-close:hover {
  background: red !important;
}
*/
</style>

<script>
import { defineAsyncComponent } from "vue";

const System = require("../helpers/System.js");
const Locale = require("../helpers/Locale.js");
const Files = require("../helpers/Files.js");
const Screen = require("../helpers/Screen.js");

export default {
  components: {
    stopwatch: defineAsyncComponent(() =>
      import(`@/layout/headertabs/StopwatchTab`)
    ),
    ico: defineAsyncComponent(() => import(`@/components/Icon`)),
  },
  computed: {
    sidebar: function () {
      return (
        Object.values(this.$store.state.sidebar).filter(function (key) {
          return key;
        }).length > 0
      );
    },
    debug: function () {
      return this.$store.state.debug;
    },
    lang: function () {
      return this.$store.state.data.lang;
    },
  },
  methods: {
    search: function () {
      alert("Busca em construção");
    },
    changeLocale: function (lang) {
      Locale.change(lang, this.$vuetify, this.$i18n);
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
    chageOnline: function () {
      System.changeOnline();
    },
    showScreen: function () {
      Screen.show();
    },
  },
};
</script>
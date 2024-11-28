<template>
  <div class="d-flex flex-nowrap">
    <template v-if="!compact">
      <v-btn
        v-for="(btn, key) in buttons"
        :key="key"
        :disabled="btn.disabled ? btn.disabled : false"
        variant="text"
        :color="color ? color : $theme.primary()"
        :icon="btn.icon"
        density="compact"
        class="mx-1"
        @click="btn.click"
      />
    </template>

    <v-menu location="start">
      <template v-slot:activator="{ props }">
        <v-btn
          variant="text"
          :color="color ? color : $theme.primary()"
          icon="mdi-menu"
          density="compact"
          class="mx-1"
          v-bind="props"
        />
      </template>

      <v-list>
        <v-list-item v-if="compact" class="d-flex justify-center">
          <v-btn
            v-for="(btn, key) in buttons"
            :key="key"
            :disabled="btn.disabled ? btn.disabled : false"
            variant="text"
            :color="$theme.primary()"
            :icon="btn.icon"
            density="compact"
            class="mx-1"
            @click="btn.click"
          />
        </v-list-item>
        <v-divider v-if="compact" />

        <v-list-item v-for="(item, key) in menu" :key="key">
          <template v-slot:prepend>
            <v-icon :icon="item.icon"></v-icon>
          </template>
          <template v-slot:append>
            <v-icon icon="mdi-menu-right" size="x-small"></v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <v-menu
            :open-on-focus="false"
            activator="parent"
            :open-on-hover="!is_mobile"
            submenu
          >
            <v-list>
              <template v-for="(subitem, subkey) in item.menu" :key="subkey">
                <v-divider v-if="subitem.title == '-'" />
                <v-list-item
                  v-else
                  :prepend-icon="subitem.icon"
                  :title="subitem.title"
                  @click="subitem.click"
                  :disabled="subitem.disabled ? subitem.disabled : false"
                />
              </template>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "MusicMenuTableComponent",
  props: {
    id_music: Number,
    has_instrumental_music: [Boolean, Number],
    color: String,
  },
  computed: {
    buttons() {
      return [
        {
          disabled: false,
          icon: "mdi-play-box-multiple",

          click: () =>
            this.$media.open({ id_music: this.id_music, mode: "audio" }),
        },
        {
          disabled: !this.has_instrumental_music,
          icon: "mdi-play-box-multiple-outline",
          click: () =>
            this.$media.open({ id_music: this.id_music, mode: "instrumental" }),
        },
        {
          disabled: false,
          icon: "mdi-checkbox-multiple-blank-outline",
          click: () => this.$media.open(this.id_music),
        },
        {
          disabled: false,
          icon: "mdi-text-box-outline",
          click: () => this.$media.openLyric(this.id_music),
        },
      ];
    },
    menu() {
      return [
        {
          title: "Adicionar em",
          icon: "mdi-plus",
          menu: [
            {
              title: "Favritos",
              icon: "mdi-star",
              click: () => null,
            },
            {
              title: "Liturgia",
              icon: "mdi-view-list",
              click: () => null,
            },
            {
              title: "Lista de Reprodução",
              icon: "mdi-playlist-music",
              click: () => null,
            },
          ],
        },
        {
          title: "Executar",
          icon: "mdi-play",
          menu: [
            {
              title: "Cantado",
              icon: "mdi-play-box-multiple",
              click: () =>
                this.$media.open({ id_music: this.id_music, mode: "audio" }),
            },
            {
              title: "Playback",
              icon: "mdi-play-box-multiple-outline",
              click: () =>
                this.$media.open({
                  id_music: this.id_music,
                  mode: "instrumental",
                }),
              disabled: !this.has_instrumental_music,
            },
            {
              title: "Sem Áudio",
              icon: "mdi-checkbox-multiple-blank-outline",
              click: () => this.$media.open(this.id_music),
            },
            {
              title: "Letra",
              icon: "mdi-text-box-outline",
              click: () => this.$media.openLyric(this.id_music),
            },
            {
              title: "-",
            },
            {
              title: "Arquivo Cantado",
              icon: "mdi-file-music",
            },
            {
              title: "Arquivo Playback",
              icon: "mdi-file-music-outline",
            },
          ],
        },
        {
          title: "Exportar",
          icon: "mdi-export",
          menu: [
            {
              title: "Cantado",
              icon: "mdi-play-box-multiple",
              click: () => null,
            },
            {
              title: "Playback",
              icon: "mdi-play-box-multiple-outline",
              disabled: !this.has_instrumental_music,
              click: () => null,
            },
            {
              title: "Sem Áudio",
              icon: "mdi-checkbox-multiple-blank-outline",
              click: () => null,
            },
            {
              title: "-",
            },
            {
              title: "Arquivo Cantado",
              icon: "mdi-file-music",
              click: () => null,
            },
            {
              title: "Arquivo Playback",
              icon: "mdi-file-music-outline",
              click: () => null,
              disabled: !this.has_instrumental_music,
            },
          ],
        },
      ];
    },
    compact: function () {
      return this.$vuetify.display.width <= 550;
    },
    is_mobile: function () {
      return this.$appdata.get("is_mobile");
    },
  },
};
</script>

<template>
  <div>
    <div class="px-2" v-if="skins">
      <div v-for="list in skins" :key="list.title" class="mb-3">
        <div class="subtitle-1 font-weight-medium">{{ $t(list.title) }}</div>
        <v-btn
          v-for="skin in list.list"
          icon
          density="comfortable"
          :variant="
            $store.state.data.layout.id == skin.id ? 'outlined' : 'text'
          "
          :key="skin.id"
          class="mx-1"
          @click="changeTheme(skin)"
        >
          <v-avatar :color="skin.color" size="16"> </v-avatar>
        </v-btn>
      </div>
    </div>

    <div v-if="$store.state.debug">
      <v-divider />
      <div class="subtitle-1 font-weight-medium">Recurso do Desenvolvedor</div>
      <div class="subtitle-1 font-weight-medium" style="font-size: 12px">
        Editor de Tema
      </div>
      <v-color-picker v-model="$store.state.data.layout.color" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      layout: [
        { id: 1, color: "#29569b", dark: false },
        { id: 2, color: "#077568", dark: false },
        { id: 3, color: "#d24726", dark: false },
        { id: 4, color: "#80397b", dark: false },
        { id: 5, color: "#E91E63", dark: false },
        { id: 6, color: "#2e2e2e", dark: false },
        { id: 7, color: "#2e2e2e", dark: true },
      ],
    };
  },
  computed: {
    skins: function () {
      return [
        { title: "light-themes", list: this.skins_light },
        { title: "dark-themes", list: this.skins_dark },
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
  methods: {
    changeTheme: function (skin) {
      this.$root.data.layout = skin;
    },
  },
};
</script>
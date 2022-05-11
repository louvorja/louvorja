<template>
  <div>
    <div class="px-2" v-if="skins">
      <div v-for="list in skins" :key="list.title" class="mb-3">
        <h4>{{ list.title }}</h4>
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
  methods: {
    changeTheme: function (skin) {
      this.$root.data.layout = skin;
    },
  },
};
</script>
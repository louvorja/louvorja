<template>
  <div class="d-flex" style="height: 100%; width: 100%">
    <div class="d-flex" :style="styleBg">
      <span :style="styleTxt">
        {{ content.cronometro | timer(data.cronometro.mask) }}
      </span>
    </div>

    <v-expand-x-transition>
      <v-card
        transition="fab-transition"
        v-if="content.cronometro_list.length > 0"
        style="overflow: auto"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              Tempos Anotados
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense nav>
          <v-list-item
            v-for="(item, index) in content.cronometro_list"
            :key="index"
            link
          >
            <v-list-item-content>
              <v-list-item-title>
                <v-icon> mdi-av-timer </v-icon>
                <span class="ps-1" style="font-weight: bold"
                  >{{ index + 1 }}.</span
                >
                <span class="ps-3">
                  {{ item | timer(data.cronometro.mask) }}
                </span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <div class="pa-3">
          <v-btn block color="error" @click="content.cronometro_list = []">
            Limpar
          </v-btn>
        </div>
      </v-card>
    </v-expand-x-transition>
  </div>
</template>

<script>
import filters from "@/filters";
export default {
  name: "cronometro",
  filters,
  data() {
    return this.$root.$data;
  },
  computed: {
    styleBg: function () {
      return Object.assign(
        {
          height: "100%",
          overflow: "hidden",
          flex: "auto",
          alignItems: this.data.cronometro.text.positionV,
          justifyContent: this.data.cronometro.text.positionH,
          backgroundColor: this.data.cronometro.bg.color,
          backgroundPosition: this.data.cronometro.bg.position,
          backgroundSize: "cover",
          backgroundImage: this.data.cronometro.bg.file.url
            ? `url(${this.data.cronometro.bg.file.url})`
            : "initial",
        },
        this.data.cronometro.bg.cssContent
          ? Object.fromEntries(
              this.data.cronometro.bg.css
                .split(";")
                .filter((item) => item != "")
                .map((item) => {
                  return item.split(":");
                })
            )
          : {}
      );
    },
    styleTxt: function () {
      return Object.assign(
        {
          fontSize: `${this.data.cronometro.text.fontSize}vh`,
          color: this.data.cronometro.text.color,
        },
        this.data.cronometro.text.cssContent
          ? Object.fromEntries(
              this.data.cronometro.text.css
                .split(";")
                .filter((item) => item != "")
                .map((item) => {
                  return item.split(":");
                })
            )
          : {}
      );
    },
  },
};
</script>
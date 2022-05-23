<template>
  <v-expand-x-transition>
    <v-card v-if="media.show">
      <v-navigation-drawer :mini-variant.sync="data.media.mini" permanent>
        <v-layout column fill-height>
          <div class="flex-grow-0">
            <v-list-item class="px-2">
              <v-list-item-avatar>
                <v-img
                  src="https://randomuser.me/api/portraits/men/85.jpg"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-title>John Leider</v-list-item-title>

              <v-btn icon @click.stop="data.media.mini = !data.media.mini">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item>

            <v-divider></v-divider>
          </div>

          <div class="flex-grow-1" style="overflow: auto; flex: auto">
            <v-skeleton-loader v-if="media.loading" type="list-item-two-line@3" class="px-3"></v-skeleton-loader>

            <v-list dense v-else>
              <v-list-item
                v-for="(item, index) in slides"
                :key="index"
                link
                class="pa-0"
              >
                <v-list-item-avatar>
                  {{ index + 1 }}
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-if="item.titulo">
                    <h3 class="text-block">{{ item.titulo }}</h3>
                  </v-list-item-title>
                  <v-list-item-subtitle v-else>
                    <span class="text-block">{{ item.letra }}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-layout>
      </v-navigation-drawer>
    </v-card>
  </v-expand-x-transition>
</template>


<script>
export default {
  data() {
    return this.$root.$data;
  },
  computed: {
    slides: function () {
      if (this.media.music.length <= 0) {
        return [];
      }
      let slides = Object.assign({}, this.media.music, { exibe_slide: 1 });
      delete slides.letra;
      slides = [slides];
      slides.push(...this.media.music.letra);
      return slides.filter((item) => item.exibe_slide === 1);
    },
  },
};
</script>
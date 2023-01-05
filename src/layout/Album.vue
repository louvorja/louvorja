<template>
  <v-dialog dark v-model="album.show" width="500px">
    <v-card :color="album.album.color">
      <v-layout column fill-height style="max-height: 90vh">
        <div class="d-flex flex-no-wrap justify-space-between align-center">
          <v-avatar class="ma-3" size="125" tile>
            <v-img :src="album.album.url_image"></v-img>
          </v-avatar>
          <div class="flex-grow-1 d-flex flex-column">
            <div class="text-h4 font-weight-light" v-text="album.album.name" />
          </div>
        </div>

        <div class="flex-grow-1 px-4 pb-4" style="overflow: auto; flex: auto">
          <v-skeleton-loader v-if="album.loading" type="text@5" />
          <div :color="album.album.color" v-else>
            <div v-for="music in album.musics" :key="music.id_music">
              <v-list-item-content>
                <v-list-item-title class="d-flex align-center">
                  <v-avatar color="primary" size="35" class="me-4">
                    {{ music.track }}
                  </v-avatar>
                  <div style="flex-grow: inherit; white-space: normal;">
                    {{ music.name }}
                  </div>
                  <music-bar
                    v-bind="{ ...music, album: album.album.name }"
                    @music="closeAlbum()"
                    @player="closeAlbum()"
                  />
                </v-list-item-title>
              </v-list-item-content>
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="closeAlbum()">
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-layout>

      <!--
      <v-layout column fill-height style="max-height: 90vh">
        <div class="flex-grow-0">
          <v-card-title>
            <v-skeleton-loader
              v-if="album.loading"
              width="100%"
              type="heading"
            />
            <span v-else>{{ album.music.name }}</span>
          </v-card-title>
          <v-card-subtitle v-if="!album.loading && album.album">
            <span>{{ album.album }}</span>
            <span v-if="album.track" class="text-lowercase">
              | {{ $t("track") }} {{ album.track }}
            </span>
          </v-card-subtitle>
        </div>
        <div class="flex-grow-1 px-4 pb-4" style="overflow: auto; flex: auto">
          <v-skeleton-loader v-if="album.loading" type="text@5" />
          <div v-else>
            <div v-for="item in album.music.album" :key="item.id_album">
              {{ item.album }}&nbsp;
            </div>
          </div>
        </div>
        <div class="flex-grow-0">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="error" @click="closeLetter()">
              {{ $t("close") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-layout>
      -->
    </v-card>
  </v-dialog>
</template>


<script>
const Album = require("@/helpers/Album.js");

export default {
  components: {
    MusicBar: () => import("@/components/MusicBar"),
  },
  data() {
    return {};
  },
  computed: {
    album: function () {
      return this.$store.state.album;
    },
  },
  methods: {
    closeAlbum: function () {
      Album.close();
    },
  },
};
</script>
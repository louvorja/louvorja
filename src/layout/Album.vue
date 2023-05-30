<template>
  <v-dialog theme="dark" v-model="album.show" width="80%">
    <v-card :color="album.album.color" id="album-card">
      <div class="d-flex flex-no-wrap align-stretch album-minus-height">
        <v-avatar class="ma-3" size="125" rounded="0">
          <v-img :src="album.album.url_image" />
        </v-avatar>

        <div class="flex-grow-1 d-flex align-center">
          <v-card-title class="text-h4 font-weight-light">
            {{ album.album.name }}
          </v-card-title>
        </div>

        <div class="d-flex align-start">
          <v-btn
            variant="text"
            icon="mdi-close"
            size="small"
            @click.native="closeAlbum()"
          />
        </div>
      </div>

      <v-skeleton-loader
        :color="album.album.color"
        v-if="album.loading"
        type="text@5"
      />
      <div v-else>
        <v-data-table-virtual
          :color="album.album.color"
          :headers="[
            {
              title: this.$t('track'),
              align: 'end',
              sortable: true,
              key: 'track',
              width: 100,
            },
            {
              title: this.$t('title'),
              sortable: true,
              key: 'name',
            },
            { title: '', key: 'options' },
          ]"
          :items="album.musics"
          :no-data-text="$t('message.no-data-text')"
          class="elevation-1"
          item-value="name"
          :height="table_height"
          fixed-header
          fixed-footer
          hover
        >
          <template v-slot:[`item.options`]="{ item }">
            <music-bar
              v-bind="{ ...item.props.title, album: album.album }"
              color="#FFFFFF"
              @music="closeAlbum()"
              @player="closeAlbum()"
            />
          </template>
        </v-data-table-virtual>
      </div>

      <v-card-actions class="album-minus-height">
        <v-spacer></v-spacer>
        <v-btn
          class="ms-2"
          variant="outlined"
          size="small"
          @click="closeAlbum()"
        >
          {{ $t("close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineAsyncComponent } from "vue";

const Album = require("@/helpers/Album.js");

export default {
  components: {
    MusicBar: defineAsyncComponent(() => import("@/components/MusicBar")),
  },
  data() {
    return {
      refresh: 0,
    };
  },
  computed: {
    album: function () {
      return this.$store.state.album;
    },
    table_height: function () {
      this.refresh;
      let height = this.$store.state.window.main.height - 50;
      document.querySelectorAll(".album-minus-height").forEach((el) => {
        height -= el.offsetHeight || 0;
      });
      return height;
    },
  },
  watch: {
    album: {
      handler: function () {
        this.refresh++;

        /*
         * Hack para mudar a cor da tabela, pois não está funcionando nativamente
         * pela propriedade "color"
         */
        if (!this.album.loading) {
          let self = this;
          setTimeout(function () {
            document
              .querySelectorAll(
                "#album-card table th, #album-card table td,#album-card .v-table__wrapper"
              )
              .forEach((element) => {
                element.style.backgroundColor = self.album.album.color;
              });
          }, 10);
        }
      },
      deep: true,
    },
  },
  methods: {
    closeAlbum: function () {
      Album.close();
    },
  },
  mounted() {
    this.refresh++;

    try {
      let self = this;
      document
        .getElementById("album-card")
        .addEventListener("scroll", function (event) {
          self.refresh++;
        });
    } catch (e) {}
  },
};
</script>
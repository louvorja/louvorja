<template>
  <l-window
    v-model="module.show"
    :title="$t(module.title)"
    :icon="module.icon"
    closable
    minimizable
    compact
    @close="
      close();
      $modules.close(module_id);
    "
    @minimize="$modules.minimize(module_id)"
    @scroll="onScroll"
    @hasScroll="hasScroll"
    :index="data.count"
  >
    <template v-slot:header>
      <div :class="classform.group">
        <div :class="classform.group_item" style="flex-basis: 600px">
          <l-search
            v-model="search"
            :label="$t('modules.musics.inputs.search')"
            :error="data.filter_count <= 0"
            :disabled="disabled"
            :disabled-hint="$t('modules.musics.inputs.search_disabled')"
          />
        </div>
        <div :class="classform.group_item" style="flex-basis: 250px">
          <l-checkbox
            v-model="search_name"
            :label="$t('modules.musics.inputs.filter_name')"
          />
          <l-checkbox
            v-model="search_lyric"
            :label="$t('modules.musics.inputs.filter_lyric')"
          />
          <l-checkbox
            v-model="search_album"
            :label="$t('modules.musics.inputs.filter_album')"
          />
        </div>
        <v-divider vertical />
        <div :class="classform.group_item" style="flex-basis: 200px">
          <div>
            <l-checkbox
              switch
              v-model="filter_instrumental_music"
              :label="$t('modules.musics.inputs.filter_instrumental')"
            />
          </div>
        </div>
      </div>
    </template>

    <l-table
      v-model="data"
      :search="search"
      :letter="letter"
      :searchable_fields="{
        name: search_name,
        lyric: search_lyric,
        albums_names: search_album,
      }"
      :filter="{ has_instrumental_music: filter_instrumental_music }"
      :scroll="scroll"
      :has_scroll="has_scroll"
      sort_by="name"
      :file="`${$i18n.locale}_musics`"
    >
      <thead>
        <tr>
          <th class="text-left">{{ $t("modules.musics.table.music_name") }}</th>
          <th v-if="!compact" class="text-left">
            {{ $t("modules.musics.table.album_name") }}
          </th>
          <th class="text-right">{{ $t("modules.musics.table.duration") }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.data" :key="item.id_music">
          <td>
            {{ item.name }}
            <div v-if="compact" class="pb-1">
              <v-chip
                v-for="album in item.albums"
                :key="album.id_album"
                :color="$theme.primary()"
                size="x-small"
                @click="openAlbum(album.id_album)"
              >
                {{ album.name }}
              </v-chip>
            </div>
          </td>
          <td v-if="!compact">
            <v-chip
              v-for="album in item.albums"
              :key="album.id_album"
              :color="$theme.primary()"
              density="compact"
              @click="openAlbum(album.id_album)"
            >
              {{ album.name }}
            </v-chip>
          </td>
          <td class="text-right">{{ $datetime.shortTime(item.duration) }}</td>
          <td>
            <div class="d-flex justify-end">
              <l-music-menu-table
                :id_music="item.id_music"
                :has_instrumental_music="item.has_instrumental_music"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </l-table>

    <v-alert
      v-if="search && data.filter_count <= 0"
      type="error"
      :text="$t('modules.musics.data.not_found')"
      variant="tonal"
      border="start"
      class="ma-2"
    />

    <template v-slot:footer>
      <div class="w-100">
        <l-letter-paginate v-model="letter" />
        <div class="text-right">
          <small>
            {{ $t("modules.musics.data.records") }}:
            {{ data.filter_count }}
          </small>
        </div>
      </div>
    </template>
  </l-window>
</template>

<script>
import LWindow from "@/components/Window.vue";
import LTable from "@/components/DataTable.vue";
import LSearch from "@/components/inputs/InputSearch.vue";
import LCheckbox from "@/components/inputs/CheckBox.vue";
import LMusicMenuTable from "@/components/MusicMenuTable.vue";
import LLetterPaginate from "@/components/LetterPagination.vue";

export default {
  name: "MusicModule",
  components: {
    LWindow,
    LTable,
    LSearch,
    LCheckbox,
    LMusicMenuTable,
    LLetterPaginate,
  },

  data: () => ({
    search: "",
    data: [],
    scroll: {},
    has_scroll: false,
    letter: "",
  }),
  computed: {
    module_id() {
      return "musics";
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    disabled() {
      return !this.search_name && !this.search_lyric && !this.search_album;
    },
    classform() {
      return {
        group: "d-flex flex-wrap",
        group_item:
          "flex-shrink-1 flex-grow-1 d-flex flex-wrap justify-space-around",
      };
    },
    search_name: {
      get() {
        return this.$userdata.get(`modules.${this.module_id}.search.name`);
      },
      set(value) {
        this.$userdata.set(`modules.${this.module_id}.search.name`, value);
      },
    },
    search_lyric: {
      get() {
        return this.$userdata.get(`modules.${this.module_id}.search.lyric`);
      },
      set(value) {
        this.$userdata.set(`modules.${this.module_id}.search.lyric`, value);
      },
    },
    search_album: {
      get() {
        return this.$userdata.get(`modules.${this.module_id}.search.album`);
      },
      set(value) {
        this.$userdata.set(`modules.${this.module_id}.search.album`, value);
      },
    },
    filter_instrumental_music: {
      get() {
        return this.$userdata.get(
          `modules.${this.module_id}.filter.instrumental_music`
        );
      },
      set(value) {
        this.$userdata.set(
          `modules.${this.module_id}.filter.instrumental_music`,
          value
        );
      },
    },
    compact: function () {
      return this.$vuetify.display.width <= 800;
    },
  },
  methods: {
    onScroll(data) {
      this.scroll = data;
    },
    hasScroll(data) {
      this.has_scroll = data;
    },
    openAlbum(id_album) {
      this.$media.openAlbum(id_album);
    },
    close() {
      //Se fechar a janela, não manter o histórico de pesquisa.
      this.search = "";
    },
  },
};
</script>

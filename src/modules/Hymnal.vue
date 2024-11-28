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
            :label="$t('modules.hymnal.inputs.search')"
            :error="data.filter_count <= 0"
          />
        </div>
      </div>
    </template>

    <l-table
      v-model="data"
      :search="search"
      letter=""
      :searchable_fields="{
        track: true,
        name: true,
      }"
      :scroll="scroll"
      :has_scroll="has_scroll"
      sort_by="track"
      :file="$path.db(`/database/${$i18n.locale}_hymnal.json`)"
    >
      <thead>
        <tr>
          <th class="text-right">{{ $t("modules.musics.table.track") }}</th>
          <th class="text-left">{{ $t("modules.musics.table.music_name") }}</th>
          <th class="text-right">{{ $t("modules.musics.table.duration") }}</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.data" :key="item.id_music">
          <td class="text-right">
            {{ item.track }}
          </td>
          <td>
            {{ item.name }}
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
import LMusicMenuTable from "@/components/MusicMenuTable.vue";

export default {
  name: "HymnalModule",
  components: {
    LWindow,
    LTable,
    LSearch,
    LMusicMenuTable,
  },

  data: () => ({
    search: "",
    data: [],
    scroll: {},
    has_scroll: false,
  }),
  computed: {
    module_id() {
      return "hymnal";
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    classform() {
      return {
        group: "d-flex flex-wrap",
        group_item:
          "flex-shrink-1 flex-grow-1 d-flex flex-wrap justify-space-around",
      };
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
    close() {
      //Se fechar a janela, não manter o histórico de pesquisa.
      this.search = "";
    },
  },
};
</script>

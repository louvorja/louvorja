<template>
  <l-window
    v-model="module.show"
    :title="module.data.name"
    :image="module.data.url_image ? $path.file(module.data.url_image) : ''"
    closable
    compact
    title-class="text-h4 font-weight-light"
    :image-size="125"
    :color="module.data.color"
    @close="$media.closeAlbum()"
    slot-left-class="w-100"
  >
    <template v-slot:left>
      <v-table
        fixed-header
        hover
        loading
        class="w-100 h-100"
        :style="{ backgroundColor: module.data.color, color: '#FFF' }"
      >
        <thead>
          <tr>
            <th
              class="text-right"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.musics.table.track") }}
            </th>
            <th
              class="text-left"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.musics.table.music_name") }}
            </th>
            <th
              class="text-right"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.musics.table.duration") }}
            </th>
            <th
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in module.data.musics" :key="item.id_music">
            <td class="text-right">
              {{ item.track }}
            </td>
            <td>{{ item.name }}</td>
            <td class="text-right">{{ $datetime.shortTime(item.duration) }}</td>
            <td>
              <div class="d-flex justify-end">
                <l-music-menu-table
                  color="#FFF"
                  :id_music="item.id_music"
                  :has_instrumental_music="item.has_instrumental_music"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </v-table>
    </template>

    <!--
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
      :file="$path.db(`/database/album_${module.id_album}.json`)"
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
    -->
  </l-window>
</template>

<script>
import LWindow from "@/components/Window.vue";
import LMusicMenuTable from "@/components/MusicMenuTable.vue";

export default {
  name: "AlbumModule",
  components: {
    LWindow,
    LMusicMenuTable,
  },

  computed: {
    module_id() {
      return "album";
    },
    module() {
      return this.$modules.get(this.module_id);
    },
  },
  methods: {},
};
</script>

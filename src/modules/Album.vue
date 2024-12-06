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
        v-if="!loading"
        fixed-header
        hover
        class="w-100 h-100"
        :style="{ backgroundColor: module.data.color, color: '#FFF' }"
      >
        <thead>
          <tr>
            <th
              class="text-right"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.album.table.track") }}
            </th>
            <th
              class="text-left"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.album.table.music_name") }}
            </th>
            <th
              class="text-right"
              :style="{ backgroundColor: module.data.color, color: '#FFF' }"
            >
              {{ $t("modules.album.table.duration") }}
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

      <v-progress-linear v-if="loading" color="white" indeterminate />
    </template>
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
    loading() {
      return this.$appdata.get("modules.album.loading");
    },
  },
};
</script>

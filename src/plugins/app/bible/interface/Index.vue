<template>
  <l-window
    v-model="module.show"
    :title="t('title')"
    :icon="module.icon"
    closable
    minimizable
    compact
    @close="
      close();
      $modules.close(module_id);
    "
    @minimize="$modules.minimize(module_id)"
    @resize="resize"
    slot-left-class="w-60"
  >
    <template v-slot:header>
      HEADER|{{ tab }}|{{ height }}| {{ book?.name }} {{ bible.chapter }}
    </template>

    <template v-slot:left>
      <div v-if="!error" class="d-flex flex-row h-100">
        <div class="w-70 h-100">
          <div
            :style="`height: ${height}px`"
            class="overflow-auto d-flex flex-row flex-wrap justify-center"
          >
            <v-card
              v-for="book in books"
              :key="book.id_bible_book"
              :color="book.color"
              class="ma-1 d-flex align-center flex-column"
              height="80"
              width="100"
              hover
              @click="selBook(book.id_bible_book)"
              :variant="
                book.id_bible_book == bible.id_bible_book ? 'flat' : 'tonal'
              "
            >
              <v-card-title
                class="flex-grow-1 pa-0 ma-0 text-h4 d-flex align-center"
              >
                {{ book.abbreviation }}
              </v-card-title>
              <v-card-text
                class="flex-grow-0 pa-0 px-1 ma-0 text-caption text-truncate text-center w-100"
              >
                {{ book.name }}
              </v-card-text>
            </v-card>
          </div>
        </div>
        <div class="w-30 h-100">
          <div :style="`height: ${height}px`" class="overflow-auto text-center">
            <v-avatar
              v-for="chapter in chapters"
              :key="chapter"
              :color="book?.color"
              class="ma-1 cursor-pointer"
              @click="selChapter(chapter)"
              :variant="chapter == bible.chapter ? 'flat' : 'tonal'"
            >
              {{ chapter }}
            </v-avatar>
          </div>
        </div>
      </div>
    </template>

    <v-alert
      v-if="error"
      type="error"
      :text="error"
      variant="tonal"
      border="start"
      class="ma-2"
    />

    <template v-slot:right>
      <pre>
        {{ bible }}
        ....
        {{ book }}
      </pre>
    </template>
  </l-window>
</template>

<script>
import manifest from "../manifest.json";
import LWindow from "@/components/Window.vue";

export default {
  name: "CollectionsModule",
  components: {
    LWindow,
  },
  data: () => ({
    lang: null,
    loading: false,
    error: null,
    tab: null,
    height: 0,
    bible: {
      id_bible_book: null,
      chapter: null,
    },
    books: [],
  }),
  computed: {
    /* COMPUTEDS OBRIGATÓRIAS - INÍCIO */
    /* NÃO MODIFICAR */
    module_id() {
      return manifest.id;
    },
    module() {
      return this.$modules.get(this.module_id);
    },
    /* COMPUTEDS OBRIGATÓRIAS - FIM */

    show() {
      return this.module.show;
    },

    book() {
      return this.books.find(
        (b) => b.id_bible_book == this.bible.id_bible_book
      );
    },
    chapters() {
      return this.book?.chapters;
    },
  },
  watch: {
    async show() {
      if (this.show && this.lang != this.$i18n.locale) {
        this.books = [];
        this.bible = {
          id_bible_book: null,
          chapter: null,
        };
        await this.loadData();
      }
    },
  },
  methods: {
    /* METHODS OBRIGATÓRIOS - INÍCIO */
    /* NÃO MODIFICAR */
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    /* METHODS OBRIGATÓRIOS - FIM */

    async loadData() {
      console.log("LOAD");
      this.loading = true;

      if (this.books.length <= 0) {
        console.log("BOOOK");
        this.books = await this.$database.get(
          `${this.$i18n.locale}_bible_book`
        );
        if (!this.bible.id_bible_book) {
          this.selBook(this.books[0].id_bible_book);
        }
      }
      /*
      this.categories = await this.$database.get(
        `${this.$i18n.locale}_categories`
      );

      if (this.categories == null) {
        this.$modules.close(this.module_id);
        return;
      }

      if (this.categories.length > 0) {
        this.categories.sort((a, b) => a.order - b.order);
        this.id_category = this.categories[0].id_category;
      } else {
        this.id_category = 0;
      }
*/
      this.lang = this.$i18n.locale;
      this.loading = false;
    },
    resize(data) {
      this.height = data.container_height;
    },

    selBook(id_bible_book) {
      this.bible.id_bible_book = id_bible_book;
      if (!this.bible.chapter) {
        this.selChapter(1);
      } else if (this.bible.chapter > this.book.chapters) {
        this.selChapter(this.book.chapters);
      } else {
        this.loadData();
      }
    },
    selChapter(chapter) {
      this.bible.chapter = chapter;
      this.loadData();
    },

    close() {
      //Se fechar a janela, não manter o histórico.
      /* */
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

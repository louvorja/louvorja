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
    :slot-left-style="`width: ${(width / 100) * 60}px`"
    :slot-right-style="`width: ${(width / 100) * 40}px`"
  >
    <template v-slot:header>
      HEADER|{{ tab }}|{{ width }} x {{ height }}|
      {{ scripturalReference(bible) }} |
      {{ scripturalReference(select_bible) }} |
      {{ last_verse }}
    </template>

    <template v-slot:left>
      <div class="d-flex flex-row h-100">
        <div class="w-70 h-100">
          <div
            :style="`height: ${height}px`"
            class="overflow-auto d-flex flex-row flex-wrap justify-center align-content-start"
          >
            <v-card
              v-for="book in books"
              :key="book.id_bible_book"
              :color="book.color"
              class="ma-1 d-flex align-center flex-column"
              height="80"
              width="100"
              hover
              :variant="
                book.id_bible_book == bible.id_bible_book ? 'flat' : 'tonal'
              "
              @click="selBook(book.id_bible_book)"
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
          <div
            :style="`height: ${height}px`"
            class="overflow-auto d-flex flex-row flex-wrap justify-center align-content-start"
          >
            <v-card
              v-for="chapter in chapters"
              :key="chapter"
              :color="book?.color"
              class="ma-1 d-flex align-center flex-column"
              height="40"
              width="40"
              hover
              :variant="chapter == bible.chapter ? 'flat' : 'tonal'"
              @click="selChapter(chapter)"
            >
              <v-card-title
                class="flex-grow-1 pa-0 ma-0 d-flex align-center font-weight-regular"
                style="font-size: 16px"
              >
                {{ chapter }}
              </v-card-title>
            </v-card>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:right>
      <div class="d-flex flex-row h-100">
        <div :style="`height: ${height}px; width: ${(width / 100) * 40}px`">
          <div>
            <v-autocomplete
              v-model="bible.id_bible_version"
              :items="versions_list"
              hide-details
              density="compact"
            />
          </div>
          <div class="h-50">
            <v-list class="overflow h-100 ma-0 pa-0 no-select" width="100%">
              <v-list-item
                v-for="(verse, num) in verses"
                :key="num"
                link
                variant="flat"
                :value="verse"
                :active="bible.verses.includes(+num)"
                @click="selVerse($event, num)"
                density="compact"
              >
                <template v-slot:prepend>
                  <v-chip class="mr-2">{{ num }}</v-chip>
                </template>

                <div v-html="verse" class="text-caption"></div>
              </v-list-item>
            </v-list>
          </div>
          <div>
            <a @click="popup()">ABRIR PPUP</a>
            {{ select_bible.text }}
            <br />
            {{ select_bible.scriptural_reference }}
            <Screen />
          </div>
        </div>
      </div>
    </template>
  </l-window>
</template>

<script>
import manifest from "../manifest.json";
import LWindow from "@/components/Window.vue";
import Screen from "../components/Screen.vue";

export default {
  name: "CollectionsModule",
  components: {
    LWindow,
    Screen,
  },
  data: () => ({
    lang: null,
    loading: false,
    tab: null,
    width: 0,
    height: 0,
    bible: {
      id_bible_version: null,
      id_bible_book: null,
      version: null,
      book: null,
      chapter: null,
      verses: [],
    },
    select_bible: {
      id_bible_version: null,
      id_bible_book: null,
      version: null,
      book: null,
      chapter: null,
      verses: [],
      scriptural_reference: null,
      text: null,
    },
    versions: [],
    books: [],
    verses: [],
    last_verse: 1,
    last_bible_file: null,
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
    version() {
      return this.versions.find(
        (b) => b.id_bible_version == this.bible.id_bible_version
      );
    },
    chapters() {
      return this.book?.chapters;
    },
    versions_list() {
      return this.versions.map((version) => ({
        title: version.abbreviation + " - " + version.name,
        value: version.id_bible_version,
      }));
    },
  },
  watch: {
    async show() {
      if (this.show && this.lang != this.$i18n.locale) {
        this.versions = [];
        this.books = [];
        this.verses = [];
        this.bible = {
          id_bible_version: null,
          id_bible_book: null,
          version: null,
          book: null,
          chapter: null,
          verses: [],
        };
        this.select_bible = Object.assign({}, this.bible);
        await this.loadData();
      }
    },
    async "bible.id_bible_version"() {
      await this.selVersion();
    },
    select_bible() {
      this.send("scriptural_reference", this.select_bible.scriptural_reference);
      this.send("text", this.select_bible.text);
    },
  },
  methods: {
    /* METHODS OBRIGATÓRIOS - INÍCIO */
    /* NÃO MODIFICAR */
    t(text) {
      return this.$t(`modules.${this.module_id}.${text}`);
    },
    /* METHODS OBRIGATÓRIOS - FIM */
    send(param, value) {
      this.$appdata.set(`modules.${this.module_id}.data.${param}`, value);
    },
    async loadData() {
      this.loading = true;

      if (this.books.length <= 0) {
        this.books = await this.$database.get(
          `${this.$i18n.locale}_bible_book`
        );
        if (!this.bible.id_bible_book) {
          await this.selBook(this.books[0].id_bible_book);
        }
      }

      if (this.versions.length <= 0) {
        this.versions = await this.$database.get(
          `${this.$i18n.locale}_bible_version`
        );
        if (!this.bible.id_bible_version) {
          await this.selVersion(this.versions[0].id_bible_version);
        }
      }

      const bible_file = `bible_${this.bible.id_bible_version}_${this.bible.id_bible_book}_${this.bible.chapter}.json`;
      if (bible_file != this.last_bible_file) {
        this.verses = await this.$database.get(bible_file);
        this.last_bible_file = bible_file;
      }

      if (
        this.select_bible.id_bible_book == this.bible.id_bible_book &&
        this.select_bible.chapter == this.bible.chapter &&
        this.select_bible.id_bible_version == this.bible.id_bible_version
      ) {
        this.bible.verses = this.select_bible.verses;
      }

      this.lang = this.$i18n.locale;
      this.loading = false;
    },
    resize(data) {
      this.width = data.container_width;
      this.height = data.container_height;
    },

    async selVersion(id_bible_version) {
      if (id_bible_version) {
        this.bible.id_bible_version = id_bible_version;
      }
      this.bible.version = this.version?.abbreviation;
      this.bible.verses = [];
      this.last_verse = 1;
      await this.loadData();
    },
    async selBook(id_bible_book) {
      this.bible.id_bible_book = id_bible_book;
      this.bible.book = this.book.name;
      this.bible.verses = [];
      this.last_verse = 1;
      if (!this.bible.chapter) {
        this.selChapter(1);
      } else if (this.bible.chapter > this.book.chapters) {
        this.selChapter(this.book.chapters);
      } else {
        await this.loadData();
      }
    },
    async selChapter(chapter) {
      this.bible.chapter = chapter;
      this.bible.verses = [];
      this.last_verse = 1;
      await this.loadData();
    },
    async selVerse(event, num) {
      event.preventDefault();

      num = parseInt(num);
      if (isNaN(num)) {
        return;
      }

      if (event.ctrlKey) {
        const index = this.bible.verses.indexOf(num);
        if (index === -1) {
          this.bible.verses.push(num);
        } else {
          this.bible.verses.splice(index, 1);
        }
      } else if (event.shiftKey) {
        const start = Math.min(num, this.last_verse);
        const end = Math.max(num, this.last_verse);
        for (let i = start; i <= end; i++) {
          if (!this.bible.verses.includes(i)) {
            this.bible.verses.push(i);
          }
        }
      } else {
        this.bible.verses = [num];
      }
      this.last_verse = num;
      this.bible.verses.sort((a, b) => a - b);
      this.select_bible = Object.assign({}, this.bible);
      this.select_bible.scriptural_reference = this.scripturalReference(
        this.select_bible
      );
      this.select_bible.text = this.getSelectedVerses(this.bible.verses);
    },
    numbersInterval(numbers) {
      if (!numbers || numbers.length === 0) return "";

      numbers.sort((a, b) => a - b);

      let result = [];
      let start = numbers[0];
      let end = numbers[0];

      for (let i = 1; i <= numbers.length; i++) {
        if (numbers[i] === end + 1) {
          // O número atual é uma continuação da sequência
          end = numbers[i];
        } else {
          // A sequência terminou
          if (start === end) {
            result.push(`${start}`);
          } else {
            result.push(`${start}-${end}`);
          }
          // Reinicia para a próxima sequência
          start = numbers[i];
          end = numbers[i];
        }
      }

      return result.join(", ");
    },
    scripturalReference(data) {
      const verses_interval = this.numbersInterval(data.verses);

      if (!data.book || !data.version) {
        return "";
      }

      return (
        data.book +
        " " +
        data.chapter +
        (verses_interval ? `:${verses_interval}` : "") +
        (data.version ? ` (${data.version})` : "")
      ).trim();
    },

    getSelectedVerses(keys) {
      keys.sort((a, b) => a - b); // Ordena os versículos para garantir a sequência correta
      let result = "";
      let previousKey = null;

      keys.forEach((key) => {
        if (previousKey !== null && key - previousKey > 1) {
          result += " [...] "; // Adiciona "..." se os versos não forem sequenciais
        } else if (result) {
          result += " "; // Adiciona um espaço entre versos consecutivos
        }
        result += this.verses[key];
        previousKey = key;
      });

      return result;
    },
    popup: function () {
      this.$popup.open("bible");
    },

    close() {
      this.$popup.exit();
      this.bible.verses = [];
      this.select_bible = {
        id_bible_version: null,
        id_bible_book: null,
        version: null,
        book: null,
        chapter: null,
        verses: [],
        scriptural_reference: null,
        text: null,
      };
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

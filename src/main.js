import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import store from "./store";
import { loadFonts } from "./plugins/webfontloader";
import { createI18nInstance } from "./i18n";
import shortkey from "vue3-shortkey";
import VueFullscreen from "vue-fullscreen";
import "./assets/styles/main.css";
import "./assets/styles/fonts.css";

loadFonts();

const app = createApp(App);

//Helpers
import Modules from "@/helpers/Modules";
import Dev from "@/helpers/Dev";
import String from "@/helpers/String";
import UserData from "@/helpers/UserData";
import AppData from "@/helpers/AppData";
import DateTime from "@/helpers/DateTime";
import Theme from "@/helpers/Theme";
import Path from "@/helpers/Path";
import Media from "@/helpers/Media";
import Alert from "@/helpers/Alert";
import Popup from "@/helpers/Popup";
app.mixin({
  beforeCreate() {
    this.$userdata = UserData;
    this.$appdata = AppData;
    this.$modules = Modules;
    this.$dev = Dev;
    this.$string = String;
    this.$datetime = DateTime;
    this.$theme = Theme;
    this.$path = Path;
    this.$media = Media;
    this.$alert = Alert;
    this.$popup = Popup;
  },
});

app.use(router);
app.use(vuetify);
app.use(store);
app.use(shortkey, { prevent: ["input", "textarea"] });
app.use(VueFullscreen);

createI18nInstance().then((i18n) => {
  app.use(i18n);
  app.mount("#app");
});

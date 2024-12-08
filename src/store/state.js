export default {
  is_dev: false,
  is_dark: false,
  is_popup: false,
  is_mobile: false,
  is_desktop: false,
  is_online: false,
  popup: null,
  popup_module: null,
  system_modules: ["dev", "theme"],
  modules: {
    //Módulos Dependentes
    media: {
      show: false,
      component: "Media",
      minimized: false,
      loading: false,
      id_music: null,
      id_album: null,
      data: {},
      config: {
        title: "",
        subtitle: "",
        track: 0,
        image: "",
        slide_index: 0,
        last_slide: 0,
        audio: "",
        mode: "",
        volume: 100,
        lazy: false,
        current_time: 0,
        duration: 0,
        progress: 0,
        slide_progress: 0,
        buffered: 0,
        is_paused: true,
        fullscreen: false,
      },
      times: [],
    },
    lyric: {
      show: false,
      component: "Lyric",
      loading: false,
      id_music: null,
      id_album: null,
      data: {},
      config: {
        title: "",
        subtitle: "",
        track: 0,
        image: "",
      },
    },
    album: {
      show: false,
      component: "Album",
      loading: false,
      id_album: null,
      data: {},
    },
  },
  module_group: {
    musics: {
      title: "module_group.musics.title",
      modules: ["musics", "hymnal", "hymnal_1996"],
    },
    bible: {
      title: "module_group.bible.title",
      modules: [],
    },
    utilities: {
      title: "module_group.utilities.title",
      modules: [],
    },
  },
  menu: {
    show: false,
    modules: [],
  },
  tray_area: {
    modules: [],
  },
  languages: {
    pt: { name: "Português", flag: "br" },
    es: { name: "Español", flag: "es" },
  },
  alert: {
    show: false,
    title: "",
    text: "",
    error: "",
    color: "",
    buttons: [],
    value: "",
    translate: false,
  },
  user_data: {
    theme: "",
    language: "",
    modules: {
      musics: {
        search: {
          name: true,
          lyric: false,
          album: false,
        },
        filter: {
          instrumental_music: false,
        },
      },
      media: {
        lazy_load: true,
      },
    },
  },
};

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "darkblue",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#29569b",
        },
      },
      darkblue: {
        dark: false,
        colors: {
          primary: "#1b2a41",
        },
      },
      blue: {
        dark: false,
        colors: {
          primary: "#0b3d62",
        },
      },
      green: {
        dark: false,
        colors: {
          primary: "#077568",
        },
      },
      orange: {
        dark: false,
        colors: {
          primary: "#d24726",
        },
      },
      purple: {
        dark: false,
        colors: {
          primary: "#80397b",
        },
      },
      pink: {
        dark: false,
        colors: {
          primary: "#e91e63",
        },
      },
      black: {
        dark: false,
        colors: {
          primary: "#2e2e2e",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#2e2e2e",
        },
      },
    },
  },
});

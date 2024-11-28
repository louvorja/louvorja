export default {
  write() {
    if (this.debug()) {
      console.log(...Array.from(arguments), " << ");
    }
  },
  debug() {
    return import.meta.env.VITE_APP_MODE == "development";
  },
};

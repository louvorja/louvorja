import $userdata from "@/helpers/UserData";

export default {
  db(path) {
    return path;
  },
  file(path) {
    let url = import.meta.env.VITE_URL_FILES;
    const lang = $userdata.get("language");

    url = url.replace("{lang}", lang);
    url = url.replace("{LANG}", lang.toUpperCase());

    return url + path;
  },
};

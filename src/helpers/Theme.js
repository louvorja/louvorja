import $appdata from "@/helpers/AppData";

export default {
  primary() {
    return !$appdata.get("is_dark") ? "primary" : undefined;
  },
};

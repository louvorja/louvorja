import $appdata from "@/helpers/AppData";
import $alert from "@/helpers/Alert";

export default {
  write() {
    if (this.debug()) {
      console.log(...Array.from(arguments), " << ");
    }
  },
  debug() {
    const is_dev = $appdata.get("is_dev");
    return is_dev;
  },
  toogle() {
    const is_dev = $appdata.get("is_dev");
    $appdata.set("is_dev", !is_dev);
    $alert.info(
      "messages." +
        (is_dev ? "developer_mode_disabled" : "developer_mode_enabled")
    );
  },
};

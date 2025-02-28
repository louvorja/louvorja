import $appdata from "@/helpers/AppData";
import $window from "@/helpers/Window";

export default {
  async open(params) {
    if (typeof params != "object") {
      params = { module: params };
    }

    let popup = $appdata.get("popup");
    if (popup && !popup.closed) {
      popup.focus();
    } else {
      popup = $window.open("/popup", "PopupWindow", "width=800,height=600");
    }
    $appdata.set("popup_module", params.module);
    $appdata.set("popup", popup);
  },
  async exit() {
    $appdata.set("popup_module", "");
  },
};

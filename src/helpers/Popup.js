import $appdata from "@/helpers/AppData";

export default {
  async open(params) {
    if (typeof params != "object") {
      params = { module: params };
    }

    let popup = window.open("/popup", "PopupWindow", "width=800,height=600");
    $appdata.set("popup_module", params.module);
    $appdata.set("popup", popup);
  },
};

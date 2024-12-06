import $appdata from "@/helpers/AppData";
import $alert from "@/helpers/Alert";
import $path from "@/helpers/Path";
import $dev from "@/helpers/Dev";

export default {
  async get(file) {
    try {
      //Se estiver usando versão On-line, salva em cache os dados
      const is_online = $appdata.get("is_online");
      const cache_name = `db-${file}`;
      const cache = window.sessionStorage.getItem(cache_name);

      if (is_online && cache) {
        $dev.write(`Lendo BD do cache`, file);
        return JSON.parse(cache);
      }

      $dev.write("Abrindo BD", file);
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const response = await fetch(`${$path.db(`/${file}`)}?${date}`, {
        headers: {
          "Api-Token": import.meta.env.VITE_API_TOKEN,
        },
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      if (is_online) {
        $dev.write("Salvando BD em cache", file);
        window.sessionStorage.setItem(cache_name, JSON.stringify(data));
        const expiration = 1000 * 60 * 60 * 24; // 1 dia
        window.sessionStorage.setItem(
          `${cache_name}-expiration`,
          (Date.now() + expiration).toString()
        );
      }
      return data;
    } catch (error) {
      $alert.error({ text: "messages.file_database_not_found", error });
      return null;
    }
  },
};

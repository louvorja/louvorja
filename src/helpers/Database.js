import $alert from "@/helpers/Alert";
import $path from "@/helpers/Path";
import $dev from "@/helpers/Dev";

export default {
  async get(file) {
    try {
      $dev.write("Abrindo BD", file);
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const response = await fetch(`${$path.db(`/${file}`)}?${date}`, {
        headers: {
          "Api-Token": import.meta.env.VITE_API_TOKEN,
        },
      });
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      $alert.error({ text: "messages.file_database_not_found", error });
      return null;
    }
  },
};

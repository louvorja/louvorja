import $alert from "@/helpers/Alert";
import $path from "@/helpers/Path";

export default {
  async get(file) {
    try {
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const response = await fetch(`${$path.db(`/${file}.json`)}?${date}`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch (error) {
      $alert.error({ text: "messages.file_database_not_found", error });
      return null;
    }
  },
};

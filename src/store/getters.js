export default {
  getData:
    (state) =>
    (data = "") => {
      if (!data) return state;

      const keys = data.split(".");
      let result = state;

      for (let key of keys) {
        if (result) {
          result = result[key];
        } else {
          return undefined;
        }
      }

      return result;
    },

  exists: (state) => (data) => {
    const keys = data.split(".");
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    return current[keys[keys.length - 1]] !== undefined;
  },
};

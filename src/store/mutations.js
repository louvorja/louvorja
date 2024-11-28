export default {
  setData(state, data) {
    const value = data.pop();
    const param = data.join(".");

    const keys = param.split(".");
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]] = value;
  },

  addElementArray(state, data) {
    const value = data.pop();
    const param = data.join(".");

    const keys = param.split(".");
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    current[keys[keys.length - 1]].push(value);
  },
  removeElementArray(state, data) {
    const value = data.pop();
    const param = data.join(".");

    const keys = param.split(".");
    let current = state;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = current[keys[keys.length - 1]].filter(
      (item) => item !== value
    );
  },
};

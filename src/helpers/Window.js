export default {
  open(url, target, features) {
    if (url.startsWith("/")) {
      console.log(
        "ffff",
        import.meta.env,
        import.meta.env.BASE_URL,
        import.meta.env.BASE_URL ?? "/"
      );
      url = (import.meta.env.BASE_URL ?? "/") + url.slice(1);
    }
    return window.open(url, target, features);
  },
};

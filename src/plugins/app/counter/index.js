import BasePlugin from "../BasePlugin";
import es from "./lang/es.json";
import pt from "./lang/pt.json";
import manifest from "./manifest.json";

export default class extends BasePlugin {
  constructor() {
    // Load translations
    manifest.translations = { pt, es };

    // Load components (All files and folders in the components folder will be loaded)
    const componentsContext = import.meta.glob("./interface/**/*.vue");

    manifest.components = componentsContext;
    manifest.componentsEntry = "Index"; // Default component to load (without the .vue extension)

    // Load manifest
    super(manifest);
  }

  onInstall() {
    console.log(`${this.manifest.name} installed successfully`);
  }
}

import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as dashboards } from "./dashboards/manifest.js";
import { manifests as sectionManifests } from "./section/manifest.js";
import { manifests as menuManifests } from "./menu/manifest.js";
import { manifests as sidebarManifests } from "./sidebar/manifest.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...entrypoints,
  ...sectionManifests,
  ...menuManifests,
  ...sidebarManifests,
  ...dashboards,
];

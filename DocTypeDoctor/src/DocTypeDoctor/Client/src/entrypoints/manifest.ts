export const manifests: Array<UmbExtensionManifest> = [
  {
    name: "Doc Type Doctor Entrypoint",
    alias: "DocTypeDoctor.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint.js"),
  },
];

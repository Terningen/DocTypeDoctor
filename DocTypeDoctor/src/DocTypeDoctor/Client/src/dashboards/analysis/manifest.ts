export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "dashboard",
    alias: "DocTypeDoctor.Dashboard.Analysis",
    name: "DocType Doctor Analysis",
    js: () => import("./analysis-dashboard.element.js"),
    weight: 100,
    meta: {
      label: "DocType Doctor",
      pathname: "doctype-doctor",
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings",
      },
    ],
  },
];

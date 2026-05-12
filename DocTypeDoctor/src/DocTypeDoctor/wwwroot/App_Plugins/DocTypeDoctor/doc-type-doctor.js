const t = [
  {
    name: "Doc Type Doctor Entrypoint",
    alias: "DocTypeDoctor.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BSlTz4-p.js")
  }
], n = [
  {
    type: "dashboard",
    alias: "DocTypeDoctor.Dashboard.Analysis",
    name: "DocType Doctor Analysis",
    js: () => import("./analysis-dashboard.element-I4zS6gfs.js"),
    weight: 100,
    meta: {
      label: "DocType Doctor",
      pathname: "doctype-doctor"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Settings"
      }
    ]
  }
], o = [
  ...n
], e = [], s = [
  {
    type: "menuItem",
    kind: "link",
    alias: "DocTypeDoctor.MenuItem.Analysis",
    name: "Analysis",
    weight: 100,
    meta: {
      label: "Analysis",
      icon: "icon-heart-alt",
      menus: ["Umb.Section.Settings"],
      href: "#/section/settings/dashboard/doctypedoctor-analysis"
    }
  },
  {
    type: "menuItem",
    kind: "link",
    alias: "DocTypeDoctor.MenuItem.Migration",
    name: "Migration",
    weight: 200,
    meta: {
      label: "Migration",
      icon: "icon-wand",
      menus: ["Umb.Section.Settings"],
      href: "#/section/settings/dashboard/doctypedoctor-analysis"
    }
  }
], i = [], a = [
  ...t,
  ...e,
  ...s,
  ...i,
  ...o
];
export {
  a as manifests
};
//# sourceMappingURL=doc-type-doctor.js.map

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'menuItem',
    kind: 'link',
    alias: 'DocTypeDoctor.MenuItem.Analysis',
    name: 'Analysis',
    weight: 100,
    meta: {
      label: 'Analysis',
      icon: 'icon-heart-alt',
      menus: ['Umb.Section.Settings'],
      href: '#/section/settings/dashboard/doctypedoctor-analysis',
    },
  },
  {
    type: 'menuItem',
    kind: 'link',
    alias: 'DocTypeDoctor.MenuItem.Migration',
    name: 'Migration',
    weight: 200,
    meta: {
      label: 'Migration',
      icon: 'icon-wand',
      menus: ['Umb.Section.Settings'],
      href: '#/section/settings/dashboard/doctypedoctor-analysis',
    },
  },
];

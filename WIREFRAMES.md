# DocType Doctor - Wireframes & Planning (Updated for Umbraco Conventions)

## Visual Planning - Wireframes

### Main Section Layout (Following Blueprint Pattern)
```
┌─────────────────────────────────────────────────────┐
│ Content | Media | Settings | [DocType Doctor]      │ <- Section in top nav
├──────────┬──────────────────────────────────────────┤
│ SIDEBAR  │  MAIN AREA                              │
│ +-------+│  +------------------------------------+  │
│ | Menu  ││  │ [Dashboard] (when nothing selected)│  │
│ |       ││  │ Welcome to DocType Doctor           │  │
│ | Analysis││  | [uui-button: Run Analysis]        │  │
│ |       ││  | [uui-button: Start Migration]     │  │
│ | Migration││  +------------------------------------+  │
│ |       ││                                         │
│ +-------+│  +------------------------------------+  │
│    ^     │  │ [Workspace: Analysis] (when Analysis│  │
│    |     │  │  menu item clicked)                  │  │
│  MenuItem │  │ [uui-tab-group]                    │  │
│           │  │ Similarity | Unused | Comp | Naming│  │
│           │  +------------------------------------+  │
│           │  │ [uui-table: Similar Doctypes]     │  │
│           │  │ [uui-table: Unused Properties]    │  │
│           │  +------------------------------------+  │
└──────────┴──────────────────────────────────────────┘
```

### Migration Workspace Layout
```
┌─────────────────────────────────────────────────────┐
│ Content | Media | Settings | [DocType Doctor]      │
├──────────┬──────────────────────────────────────────┤
│ SIDEBAR  │  MAIN AREA                              │
│ +-------+│  +------------------------------------+  │
│ | Menu  ││  │ [Workspace: Migration] (when       │  │
│ |       ││  │  Migration menu item clicked)       │  │
│ | Analysis││  |                                   │  │
│ |       ││  | Property Migration Wizard           │  │
│ | Migration││  | Step 1: Select Source             │  │
│ |       ││  | [uui-select: Source DocType]       │  │
│ +-------+│  | [uui-select: Source Property]      │  │
│    ^     │  | [uui-button: Next]                 │  │
│    |     │  |                                   │  │
│  MenuItem │  | Step 2: Select Target             │  │
│           │  | [uui-select: Target DocType]       │  │
│           │  | [uui-select: Target Property]      │  │
│           │  | [uui-select: Conversion Type]      │  │
│           │  | [uui-button: Preview]              │  │
│           │  +------------------------------------+  │
└──────────┴──────────────────────────────────────────┘
```

## Extension Type Selection

| UI Location | Extension Type | Purpose |
|-------------|----------------|---------|
| Left sidebar tab | `section` | New "DocType Doctor" section |
| Section navigation | `menu` | Menu items: "Analysis", "Migration" |
| Analysis main view | `dashboard` | Analysis results with tabs |
| Migration main view | `workspace` | Migration wizard with entity context |
| Help/documentation | `headerApp` | Help icon in top right |
| Detailed property view | `modal` | Property comparison dialog |

## UUI Component Selection

### Layout Components
- `uui-box` - Container for analysis results
- `uui-card` - Individual analysis metric cards
- `uui-table` - Display analysis results (similar doctypes, unused properties, etc.)
- `uui-tab-group` - Tab navigation for different analysis types

### Form Components
- `uui-button` - Action buttons (Run Analysis, Export, Next, Preview, Execute)
- `uui-select` - Dropdowns for selecting doctypes, properties, conversion types
- `uui-input` - Text inputs for filtering/searching
- `uui-checkbox` - Options for migration settings
- `uui-toggle` - Toggle switches for options

### Feedback Components
- `uui-loader` - Loading state during analysis/migration
- `uui-badge` - Status badges (e.g., "90% similar", "6 levels deep")
- `uui-tag` - Tags for property types, severity levels
- `uui-progress-bar` - Similarity score visualization
- `uui-alert` - Warning messages for potential data loss

### Navigation Components
- `uui-tab-group` - Tab navigation between analysis types
- `uui-pagination` - Pagination for large result sets

## Data Flow Mapping

```
[Section: DocType Doctor]
       │
       ▼
[Menu: Analysis/Migration]
       │
       ▼
[Dashboard/Workspace]
       │
       ├─consume──► [UMB_CURRENT_USER_CONTEXT] (for permissions)
       │
       ├─consume──► [UMB_NOTIFICATION_CONTEXT] (for feedback)
       │
       ▼
[Custom Repository: DocTypeDoctorRepository]
       │
       ├─fetch──► [AnalysisApiController] (C#)
       │          │
       │          └─use──► [IContentTypeService]
       │          └─use──► [IContentService]
       │          └─use──► [IDataTypeService]
       │
       └─fetch──► [MigrationApiController] (C#)
                  │
                  └─use──► [IContentService]
                  └─use──► [IContentTypeService]
                  └─use──► [IMediaService]
```

## File Structure Plan (Following Umbraco Conventions)

### Backend (C#) - Following notes-wiki pattern
```
DocTypeDoctor/
├── Constants.cs                              # Central constants
├── Controllers/
│   └── DocTypeDoctorController.cs           # Single controller with multiple endpoints
├── Services/
│   ├── Interfaces/
│   │   ├── IAnalysisService.cs
│   │   ├── IMigrationService.cs
│   │   ├── ISimilarityAnalyzer.cs
│   │   ├── IUnusedPropertyDetector.cs
│   │   ├── ICompositionAnalyzer.cs
│   │   └── IPropertyNamingAnalyzer.cs
│   └── Implementations/
│       ├── AnalysisService.cs
│       ├── MigrationService.cs
│       ├── SimilarityAnalyzer.cs
│       ├── UnusedPropertyDetector.cs
│       ├── CompositionAnalyzer.cs
│       └── PropertyNamingAnalyzer.cs
├── Models/
│   ├── Analysis/
│   │   ├── SimilarityResult.cs
│   │   ├── UnusedPropertyResult.cs
│   │   ├── CompositionChainResult.cs
│   │   └── PropertyNamingIssue.cs
│   └── Migration/
│       ├── MigrationRequest.cs
│       ├── MigrationResponse.cs
│       └── MigrationPreview.cs
├── Composers/
│   └── DocTypeDoctorComposer.cs            # DI and Swagger setup
└── DocTypeDoctor.csproj
```

### Frontend (TypeScript) - Following notes-wiki pattern
```
Client/src/
├── constants.ts                             # Central TypeScript constants
├── bundle.manifests.ts                      # Manifest aggregator
├── entrypoints/
│   ├── entrypoint.ts                        # Extension lifecycle
│   └── manifest.ts
├── section/                                 # Section registration
│   └── manifest.ts
├── sidebar/                                 # SectionSidebarApp
│   └── manifest.ts
├── menu/                                    # Menu + MenuItem
│   ├── manifest.ts
│   └── constants.ts
├── dashboard/                               # Welcome dashboard
│   ├── dashboard.element.ts
│   └── manifest.ts
├── workspace/                               # Workspaces
│   ├── analysis/
│   │   ├── analysis-workspace.element.ts
│   │   ├── similarity-workspace-view.element.ts
│   │   ├── unused-properties-workspace-view.element.ts
│   │   ├── composition-workspace-view.element.ts
│   │   ├── naming-workspace-view.element.ts
│   │   ├── context.ts
│   │   ├── context-token.ts
│   │   └── manifest.ts
│   └── migration/
│       ├── migration-workspace.element.ts
│       ├── wizard-workspace-view.element.ts
│       ├── preview-workspace-view.element.ts
│       ├── context.ts
│       ├── context-token.ts
│       └── manifest.ts
├── repository/                              # Data access layer
│   ├── doctypedoctor.repository.interface.ts
│   └── doctypedoctor.repository.ts
├── types/                                   # TypeScript interfaces
│   ├── analysis.types.ts
│   └── migration.types.ts
├── localization/                            # Multi-language support
│   └── en-us.ts
└── api/                                     # Generated OpenAPI client
```

## Sub-Skills to Invoke

Based on extension types identified:
- `umbraco-sections` - Create DocType Doctor section
- `umbraco-menu-items` - Create Analysis and Migration menu items
- `umbraco-dashboard` - Create Analysis dashboard
- `umbraco-workspace` - Create Migration workspace
- `umbraco-modals` - Create property comparison modal
- `umbraco-header-apps` - Create help header app
- `umbraco-extension-registry` - Register all extensions

## Planning Checklist

- [x] Wireframe drawn with extension types labeled
- [x] UUI components identified
- [x] Data sources/APIs identified (IContentTypeService, IContentService, etc.)
- [x] Sub-skills to invoke identified
- [x] File structure planned (following Umbraco conventions)
- [x] entityType linking pattern identified (critical for menu-to-workspace)
- [x] Constants file pattern established (C# and TypeScript consistency)

## Post-Build Validation (REQUIRED)

After implementation is complete:
- [ ] Run `npm run build` - must compile without errors
- [ ] Spawn `umbraco-extension-reviewer` agent for code review
- [ ] Fix all High/Medium severity issues
- [ ] Browser test: extension loads, UI renders, interactions work

## Post-Build Validation (REQUIRED)

After implementation is complete:
- [ ] Run `npm run build` - must compile without errors
- [ ] Spawn `umbraco-extension-reviewer` agent for code review
- [ ] Fix all High/Medium severity issues
- [ ] Browser test: extension loads, UI renders, interactions work

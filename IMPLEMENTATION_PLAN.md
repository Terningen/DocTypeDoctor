# DocType Doctor - Implementation Plan (Hackathon Version)

## Overview
DocType Doctor is an Umbraco backoffice extension that analyzes Document Types for technical debt and provides property migration capabilities. **Built as a Settings section dashboard for hackathon.**

## Key Decisions
- **Location**: Settings section dashboard (not a new top-level section)
- **Built with AI**: Rapid development for hackathon
- **Demo scenario**: Site with closely matching doctypes (great for similarity detection demo)
- **User-adjustable similarity threshold**: Slider/number input (not hardcoded 90%)
- **Migrations**: Use Umbraco's built-in migration infrastructure (`MigrationPlan`/`IMigration`) - no custom rollback needed

## Features

### 1. Document Type Analysis (MVP for Demo)
- **Similarity Detection**: Identify similar doctypes with **user-adjustable threshold** (slider/input)
  - Default: 70% (lower than 90% to show more results in demo)
  - Range: 0-100%
  - Suggest merging or extracting composition
- **Unused Properties**: Find properties never filled in on any content node
- **Composition Chain Analysis**: Detect deep composition chains (configurable depth threshold)
- **Property Naming Consistency**: Identify inconsistent property names across doctypes

### 2. Property Migration (Using Umbraco Migrations)
- **Data Migration**: Move data from property A to property B (same or different doctypes)
- **Type Conversion**: Support string → int, string → string conversions
- **Media Transformation**: Convert media without crop to media with crop
- **Migration Framework**: Use Umbraco's `MigrationPlan` and `IMigration` for safe execution

## Architecture (Following Umbraco Conventions)

### Backend (C#) - Following notes-wiki pattern
```
DocTypeDoctor/
├── Constants.cs                              # Central constants (aliases, entity types)
├── Controllers/
│   └── DocTypeDoctorController.cs           # API endpoints (rename from existing)
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
└── Extensions/
    └── DocTypeDoctorSection.cs             # Section definition (if needed)
```

### Frontend (TypeScript) - Simplified for Settings Dashboard
```
Client/src/
├── constants.ts                             # Central TypeScript constants
├── bundle.manifests.ts                      # Manifest aggregator
├── entrypoints/
│   ├── entrypoint.ts                        # Extension lifecycle
│   └── manifest.ts
├── dashboards/
│   ├── analysis/
│   │   ├── analysis-dashboard.element.ts    # Main analysis dashboard
│   │   ├── similarity-tab.element.ts        # Similarity tab with slider
│   │   ├── unused-properties-tab.element.ts # Unused properties tab
│   │   ├── composition-tab.element.ts       # Composition chains tab
│   │   ├── naming-tab.element.ts            # Naming issues tab
│   │   └── manifest.ts
│   └── migration/
│       ├── migration-dashboard.element.ts   # Migration wizard
│       ├── migration-preview.element.ts     # Preview component
│       └── manifest.ts
├── repository/                              # Data access layer
│   ├── doctypedoctor.repository.ts
│   └── doctypedoctor.repository.interface.ts
├── types/                                   # TypeScript interfaces
│   ├── analysis.types.ts
│   └── migration.types.ts
└── api/                                     # Generated OpenAPI client
```

**Note:** No section/sidebar/menu/workspace folders needed - we're using existing Settings section.

## Extension Type Registration (Following Umbraco Conventions)

### Constants File (C#)
```csharp
// Constants.cs
namespace DocTypeDoctor
{
    public static class Constants
    {
        public static class Sections
        {
            public const string DocTypeDoctor = "DocTypeDoctor.Section";
        }

        public static class EntityTypes
        {
            public const string AnalysisRoot = "doctypedoctor-analysis-root";
            public const string MigrationRoot = "doctypedoctor-migration-root";
        }

        public static class Aliases
        {
            public const string Section = "DocTypeDoctor";
            public const string SidebarApp = "DocTypeDoctor.SidebarApp";
            public const string Menu = "DocTypeDoctor.Menu";
            public const string AnalysisMenuItem = "DocTypeDoctor.MenuItem.Analysis";
            public const string MigrationMenuItem = "DocTypeDoctor.MenuItem.Migration";
            public const string Dashboard = "DocTypeDoctor.Dashboard";
            public const string AnalysisWorkspace = "DocTypeDoctor.Workspace.Analysis";
            public const string MigrationWorkspace = "DocTypeDoctor.Workspace.Migration";
        }
    }
}
```

### Constants File (TypeScript)
```typescript
// constants.ts
export const DOCTORTYPE_SECTION_ALIAS = 'DocTypeDoctor.Section';
export const DOCTORTYPE_ANALYSIS_ENTITY_TYPE = 'doctypedoctor-analysis-root';
export const DOCTORTYPE_MIGRATION_ENTITY_TYPE = 'doctypedoctor-migration-root';
```

### Extension Type Connections (Settings Section Dashboard Pattern)
```
Umb.Section.Settings (existing Umbraco section)
    │
    ├── Dashboard: "Analysis" Tab
    │   └── conditions: SectionAlias = "Umb.Section.Settings"
    │   └── Contains:
    │       - Similarity slider (threshold control)
    │       - Tab group: Similarity | Unused | Composition | Naming
    │       - Results tables for each analysis type
    │
    └── Dashboard: "Migration" Tab
        └── conditions: SectionAlias = "Umb.Section.Settings"
        └── Contains:
            - Migration wizard (source → target → conversion → preview → execute)
            - Uses Umbraco's MigrationPlan for safe execution
```

**Why Settings dashboard instead of new section:**
- Discoverable for developers (already in Settings working with doctypes)
- Less code (no section/menu/workspace registration needed)
- Faster to implement for hackathon
- Follows pattern of other dev tools (Models Builder, Examine, etc.)

## Detailed Implementation Plan

### Phase 1: Core Infrastructure (Foundation)

#### 1.1 Constants Setup
- Create `Constants.cs` with all aliases and entity types
- Create `constants.ts` with matching TypeScript constants
- Ensure consistency between C# and TypeScript

#### 1.2 Backend Services Setup
- **Document Type Analysis Service**
  - Methods: `AnalyzeAllDocumentTypes()`, `GetSimilarDocumentTypes()`, `GetUnusedProperties()`, `AnalyzeCompositionChains()`, `AnalyzePropertyNaming()`
  - Dependencies: `IContentTypeService`, `IContentService`, `IDataTypeService`

- **Property Migration Service**
  - Methods: `MigratePropertyData()`, `PreviewMigration()`, `ValidateMigration()`, `ExecuteMigration()`
  - Dependencies: `IContentService`, `IContentTypeService`, `IMediaService`

#### 1.3 API Controller (Single Controller Pattern)
Following Umbraco conventions, use a single controller with multiple endpoints:
```csharp
// DocTypeDoctorController.cs
[ApiController]
[ApiVersion("1.0")]
[Route("api/v1/doctypedoctor")]
public class DocTypeDoctorController : ControllerBase
{
    // Analysis endpoints
    [HttpGet("analysis/similarity")]
    public async Task<IActionResult> GetSimilarity() { }

    [HttpGet("analysis/unused-properties")]
    public async Task<IActionResult> GetUnusedProperties() { }

    [HttpGet("analysis/composition-chains")]
    public async Task<IActionResult> GetCompositionChains() { }

    [HttpGet("analysis/naming-issues")]
    public async Task<IActionResult> GetNamingIssues() { }

    // Migration endpoints
    [HttpPost("migration/preview")]
    public async Task<IActionResult> PreviewMigration() { }

    [HttpPost("migration/validate")]
    public async Task<IActionResult> ValidateMigration() { }

    [HttpPost("migration/execute")]
    public async Task<IActionResult> ExecuteMigration() { }
}
```

### Phase 2: Document Type Analysis Features

#### 2.1 Similarity Detection (With User-Adjustable Threshold)
**Algorithm:**
1. Get all document types via `IContentTypeService`
2. For each pair of document types:
   - Compare property collections (names, aliases, data types)
   - Calculate similarity score based on:
     - Matching properties (weighted 40%)
     - Matching data types (weighted 30%)
     - Similar property names (weighted 20%)
     - Tab structure similarity (weighted 10%)
3. Return pairs with similarity ≥ **user-defined threshold** (passed via query param)

**API Endpoint:**
```
GET /api/v1/doctypedoctor/analysis/similarity?threshold=70
```

**UI Component:**
- `uui-slider` or `uui-input type="number"` for threshold (0-100%)
- Default value: 70%
- Live update on threshold change (debounced)
- Show count of matches at current threshold

**Data Model:**
```csharp
public class DocumentTypeSimilarityResult
{
    public Guid DocType1Id { get; set; }
    public string DocType1Name { get; set; }
    public Guid DocType2Id { get; set; }
    public string DocType2Name { get; set; }
    public double SimilarityScore { get; set; }
    public List<string> MatchingProperties { get; set; }
    public List<string> DifferingProperties { get; set; }
    public string Recommendation { get; set; } // "Merge" or "Extract Composition"
}
```

#### 2.2 Unused Property Detection
**Algorithm:**
1. Get all document types and their properties
2. For each property:
   - Query content nodes of that document type
   - Check if property has ever been set (not null/default)
   - Track usage count
3. Return properties with 0 usage

**Data Model:**
```csharp
public class UnusedPropertyResult
{
    public Guid DocTypeId { get; set; }
    public string DocTypeName { get; set; }
    public Guid PropertyId { get; set; }
    public string PropertyAlias { get; set; }
    public string PropertyName { get; set; }
    public int TotalNodes { get; set; }
    public int UsageCount { get; set; }
}
```

#### 2.3 Composition Chain Analysis
**Algorithm:**
1. Get all document types
2. For each document type:
   - Traverse composition chain recursively
   - Track depth
   - Detect circular references
3. Return chains with depth ≥ 6

**Data Model:**
```csharp
public class CompositionChainResult
{
    public Guid DocTypeId { get; set; }
    public string DocTypeName { get; set; }
    public int Depth { get; set; }
    public List<string> CompositionPath { get; set; }
    public bool HasCircularReference { get; set; }
}
```

#### 2.4 Property Naming Consistency
**Algorithm:**
1. Get all properties across all document types
2. Group by semantic similarity (fuzzy matching on aliases/names)
3. Identify inconsistencies:
   - Same concept, different aliases (e.g., "pageTitle" vs "page_title")
   - Different naming conventions (camelCase vs PascalCase)
   - Inconsistent use of prefixes/suffixes

**Data Model:**
```csharp
public class PropertyNamingIssue
{
    public List<PropertyInfo> InconsistentProperties { get; set; }
    public string IssueType { get; set; } // "AliasFormat", "NamingConvention", "InconsistentPrefix"
    public string SuggestedStandard { get; set; }
}

public class PropertyInfo
{
    public Guid DocTypeId { get; set; }
    public string DocTypeName { get; set; }
    public string PropertyAlias { get; set; }
    public string PropertyName { get; set; }
}
```

### Phase 3: Property Migration (Using Umbraco's Migration Framework)

**Key Approach:** Use Umbraco's built-in `MigrationPlan` and `IMigration` infrastructure instead of building custom migration logic. This gives us:
- Built-in safety (migrations run in transactions)
- Migration history tracking
- Idempotent execution
- No need for custom rollback strategy

#### 3.1 Migration Request Model
```csharp
public class PropertyMigrationRequest
{
    public Guid SourceDocTypeId { get; set; }
    public Guid TargetDocTypeId { get; set; }
    public string SourcePropertyAlias { get; set; }
    public string TargetPropertyAlias { get; set; }
    public TypeConversionStrategy ConversionStrategy { get; set; }
    public bool PreviewOnly { get; set; }
}

public enum TypeConversionStrategy
{
    None,
    StringToInt,
    IntToString,
    StringToString,
    MediaWithoutCropToWithCrop,
    Custom
}
```

#### 3.2 Migration Implementation Using Umbraco's IMigration
**Custom IMigration class for property data migration:**
```csharp
public class PropertyDataMigration : MigrationBase
{
    private readonly PropertyMigrationRequest _request;
    
    public PropertyDataMigration(IMigrationContext context, PropertyMigrationRequest request) 
        : base(context)
    {
        _request = request;
    }

    protected override void Migrate()
    {
        // Use Database.Query / Database.Execute to migrate data
        // Umbraco handles the transaction automatically
    }
}
```

**Migration Plan:**
```csharp
public class DocTypeDoctorMigrationPlan : MigrationPlan
{
    public DocTypeDoctorMigrationPlan() : base("DocTypeDoctor")
    {
        From(string.Empty)
            .To<PropertyDataMigration>("property-migration-{guid}");
    }
}
```

**Execution via IMigrationPlanExecutor:**
```csharp
var upgrader = new Upgrader(new DocTypeDoctorMigrationPlan());
upgrader.Execute(migrationPlanExecutor, coreScopeProvider, keyValueService);
```

#### 3.3 Process Flow
1. **Preview Phase** (no Umbraco migration needed)
   - Sample affected content nodes
   - Apply conversion to sample (in memory)
   - Return preview of changes
   - Count total affected nodes

2. **Execution Phase** (uses Umbraco migration)
   - Generate unique migration name (with GUID)
   - Create migration plan with PropertyDataMigration
   - Execute via Upgrader - Umbraco handles:
     - Transaction safety
     - Migration history (umbracoKeyValue table)
     - Idempotency (won't run twice)

#### 3.4 Type Conversion Strategies
- **String → Int**: Parse string, validate numeric, handle errors gracefully
- **String → String**: Simple copy, optional transformation (trim, case change)
- **Media Without Crop → With Crop**: 
  - Get media item
  - Add crop coordinates (default: 0,0,100%,100%)
  - Update media item
  - Update property reference

### Phase 4: UI Components (Following Umbraco Workspace Pattern)

#### 4.1 Dashboard (Welcome Screen)
- **Location**: Shows when no menu item is selected
- **Components**:
  - Welcome message
  - Quick action buttons: "Run Analysis", "Start Migration"
  - Overview cards (last analysis date, total issues found)
  - Recent activity list

#### 4.2 Analysis Workspace
- **Context**: `AnalysisContext` with observable state for analysis results
- **Views** (WorkspaceViews):
  - **Similarity View** (`similarity-workspace-view.element.ts`)
    - Table showing similar doctype pairs
    - Similarity score visualization (uui-progress-bar)
    - Side-by-side property comparison
    - "Suggest Merge" or "Extract Composition" actions
  - **Unused Properties View** (`unused-properties-workspace-view.element.ts`)
    - Table showing unused properties
    - Filter by doctype (uui-select)
    - "Safe Delete" action (validates no content uses it)
    - "Mark for Review" action
  - **Composition Chains View** (`composition-workspace-view.element.ts`)
    - Tree visualization of composition chains
    - Color-coded by depth (uui-badge)
    - "Flatten Composition" action suggestion
  - **Naming Issues View** (`naming-workspace-view.element.ts`)
    - Grouped inconsistencies
    - "Rename Property" action (with content update)
    - "Suggest Standard" action

#### 4.3 Migration Workspace
- **Context**: `MigrationContext` with observable state for migration wizard
- **Views** (WorkspaceViews):
  - **Wizard View** (`migration-wizard-workspace-view.element.ts`)
    - Step 1: Select source doctype and property (uui-select)
    - Step 2: Select target doctype and property (uui-select)
    - Step 3: Choose conversion strategy (uui-select)
    - Step 4: Preview changes (uui-box with before/after)
    - Step 5: Confirm and execute (uui-button)
  - **Preview View** (`preview-workspace-view.element.ts`)
    - Show sample before/after values (uui-code-block)
    - Count of affected nodes (uui-badge)
    - Warning for potential data loss (uui-alert)
    - "Execute Migration" button (uui-button)

#### 4.4 Repository Pattern
Following Umbraco conventions, create a repository for data access:
```typescript
// doctypedoctor.repository.interface.ts
export interface IDocTypeDoctorRepository {
  getSimilarityResults(): Promise<SimilarityResult[]>;
  getUnusedProperties(): Promise<UnusedPropertyResult[]>;
  getCompositionChains(): Promise<CompositionChainResult[]>;
  getNamingIssues(): Promise<PropertyNamingIssue[]>;
  previewMigration(request: MigrationRequest): Promise<MigrationPreview>;
  executeMigration(request: MigrationRequest): Promise<MigrationResponse>;
}

// doctypedoctor.repository.ts
export class DocTypeDoctorRepository extends UmbRepositoryBase implements IDocTypeDoctorRepository {
  // Implementation using the generated API client
}
```

### Phase 5: Extension Registration (Settings Dashboard Pattern)

**Simplified manifests - only need dashboards in Settings section:**

```typescript
// dashboards/analysis/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'dashboard',
    alias: 'DocTypeDoctor.Dashboard.Analysis',
    name: 'DocType Doctor Analysis',
    js: () => import('./analysis-dashboard.element.js'),
    weight: 100,
    meta: {
      label: 'DocType Doctor - Analysis',
      pathname: 'doctype-doctor-analysis',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Settings',
      },
    ],
  },
];

// dashboards/migration/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'dashboard',
    alias: 'DocTypeDoctor.Dashboard.Migration',
    name: 'DocType Doctor Migration',
    js: () => import('./migration-dashboard.element.js'),
    weight: 99,
    meta: {
      label: 'DocType Doctor - Migration',
      pathname: 'doctype-doctor-migration',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: 'Umb.Section.Settings',
      },
    ],
  },
];
```

---

### REMOVED FROM ORIGINAL PLAN (Not Needed for Settings Dashboard)

The following are NO LONGER needed since we're using Settings section:
- ~~Section registration~~
- ~~SectionSidebarApp~~
- ~~Menu/MenuItem~~
- ~~Workspace/WorkspaceView~~
- ~~Workspace Context~~
- ~~EntityType linking pattern~~

### LEGACY: Full Section Pattern (For Reference Only)

#### 5.1 Section Manifest
```typescript
// section/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'section',
    alias: Constants.Sections.DocTypeDoctor,
    name: 'DocType Doctor Section',
    meta: {
      label: 'DocType Doctor',
      icon: 'icon-medical',
      pathname: 'doctype-doctor',
    },
  },
];
```

#### 5.2 Sidebar Manifest
```typescript
// sidebar/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'sectionSidebarApp',
    alias: Constants.Aliases.SidebarApp,
    name: 'DocType Doctor Sidebar',
    meta: {
      label: 'DocType Doctor',
      section: Constants.Sections.DocTypeDoctor,
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
];
```

#### 5.3 Menu Manifest
```typescript
// menu/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'menu',
    alias: Constants.Aliases.Menu,
    name: 'DocType Doctor Menu',
    meta: {
      label: 'DocType Doctor',
      section: Constants.Sections.DocTypeDoctor,
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
  {
    type: 'menuItem',
    alias: Constants.Aliases.AnalysisMenuItem,
    name: 'Analysis Menu Item',
    meta: {
      label: 'Analysis',
      entityType: Constants.EntityTypes.AnalysisRoot,
      menu: Constants.Aliases.Menu,
    },
  },
  {
    type: 'menuItem',
    alias: Constants.Aliases.MigrationMenuItem,
    name: 'Migration Menu Item',
    meta: {
      label: 'Migration',
      entityType: Constants.EntityTypes.MigrationRoot,
      menu: Constants.Aliases.Menu,
    },
  },
];
```

#### 5.4 Dashboard Manifest
```typescript
// dashboard/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'dashboard',
    alias: Constants.Aliases.Dashboard,
    name: 'DocType Doctor Dashboard',
    js: () => import('./analysis-dashboard.element.js'),
    meta: {
      label: 'DocType Doctor',
      pathname: 'doctype-doctor/dashboard',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
];
```

#### 5.5 Analysis Workspace Manifest
```typescript
// workspace/analysis/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'workspace',
    alias: Constants.Aliases.AnalysisWorkspace,
    name: 'Analysis Workspace',
    js: () => import('./analysis-workspace.element.js'),
    meta: {
      entityType: Constants.EntityTypes.AnalysisRoot,
      label: 'Analysis',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
  // Workspace Views
  {
    type: 'workspaceView',
    alias: 'DocTypeDoctor.WorkspaceView.Similarity',
    name: 'Similarity View',
    js: () => import('./similarity-tab.element.js'),
    meta: {
      label: 'Similarity',
      entityType: Constants.EntityTypes.AnalysisRoot,
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
  // Add other views (Unused, Composition, Naming) similarly
];
```

#### 5.6 Migration Workspace Manifest
```typescript
// workspace/migration/manifest.ts
export const manifests: Array<UmbExtensionManifest> = [
  {
    type: 'workspace',
    alias: Constants.Aliases.MigrationWorkspace,
    name: 'Migration Workspace',
    js: () => import('./migration-workspace.element.js'),
    meta: {
      entityType: Constants.EntityTypes.MigrationRoot,
      label: 'Migration',
    },
    conditions: [
      {
        alias: 'Umb.Condition.SectionAlias',
        match: Constants.Sections.DocTypeDoctor,
      },
    ],
  },
  // Workspace Views (Wizard, Preview)
];
```

#### 5.7 Bundle Manifest
```typescript
// bundle.manifests.ts
import { manifests as sectionManifests } from './section/manifest.js';
import { manifests as sidebarManifests } from './sidebar/manifest.js';
import { manifests as menuManifests } from './menu/manifest.js';
import { manifests as dashboardManifests } from './dashboard/manifest.js';
import { manifests as analysisWorkspaceManifests } from './workspace/analysis/manifest.js';
import { manifests as migrationWorkspaceManifests } from './workspace/migration/manifest.js';

export const manifests: Array<UmbExtensionManifest> = [
  ...sectionManifests,
  ...sidebarManifests,
  ...menuManifests,
  ...dashboardManifests,
  ...analysisWorkspaceManifests,
  ...migrationWorkspaceManifests,
];
```

## Implementation Order (Hackathon Priority)

### MUST HAVE (Demo MVP)
1. **Settings Dashboard registration** - Get dashboard showing in Settings
2. **Similarity detection backend** - Core algorithm
3. **Similarity tab UI with slider** - User-adjustable threshold (THE KEY DEMO FEATURE)
4. **Similarity results table** - Show matched doctype pairs
5. **Unused properties detection** - Quick to implement, clear value

### NICE TO HAVE (If Time Permits)
6. Composition chain analysis
7. Property naming consistency
8. Simple migration (string → string rename within same doctype)
9. Migration preview

### POST-HACKATHON
10. Media transformation
11. Cross-doctype migration
12. Type conversion (string → int)
13. Full migration wizard with all conversion strategies

## Technical Considerations

### Performance
- Analysis operations should be async and cancellable
- Use pagination for large result sets
- Cache analysis results (with invalidation on doctype change)
- Background processing for large migrations

### Security
- All operations require backoffice authentication
- Migration operations require specific permissions
- Audit log for all migration operations
- Preview before destructive operations

### Error Handling
- Graceful handling of type conversion failures
- Clear error messages for users
- Rollback capability for failed migrations
- Logging for debugging

### Testing
- Unit tests for all analysis algorithms
- Integration tests for migration operations
- E2E tests for UI workflows
- Test with large datasets (1000+ nodes)

## Resolved Decisions

1. ✅ **Location**: Settings section dashboard (not new top-level section)
2. ✅ **Similarity threshold**: User-adjustable via slider/input (default 70%)
3. ✅ **Migration safety**: Use Umbraco's `MigrationPlan` framework (no custom rollback)
4. ✅ **Demo target**: Site with closely matching doctypes
5. ✅ **Development**: AI-assisted for hackathon speed

## Next Steps

1. Create `Constants.cs` with aliases
2. Set up backend services (AnalysisService with similarity detection first)
3. Create Settings dashboard with similarity slider (MVP demo feature)
4. Wire up API and show results table
5. Add other analysis features if time permits

## Post-Build Validation (REQUIRED)

After implementation is complete:
- [ ] Run `npm run build` - must compile without errors
- [ ] Spawn `umbraco-extension-reviewer` agent for code review
- [ ] Fix all High/Medium severity issues
- [ ] Browser test: extension loads, UI renders, interactions work

## Sub-Skills to Invoke

Following the strict Umbraco workflow, invoke these skills in order:

1. **umbraco-sections** - Create DocType Doctor section
2. **umbraco-menu-items** - Create Analysis and Migration menu items
3. **umbraco-dashboard** - Create welcome dashboard
4. **umbraco-workspace** - Create Analysis and Migration workspaces
5. **umbraco-context-api** - Create workspace contexts for state management
6. **umbraco-repository-pattern** - Create repository for data access
7. **umbraco-openapi-client** - Set up OpenAPI client for API calls
8. **umbraco-localization** - Add multi-language support
9. **umbraco-controllers** - Ensure C# controllers follow Umbraco conventions
10. **umbraco-bundle** - Ensure proper manifest aggregation
11. **umbraco-entry-point** - Ensure proper extension lifecycle

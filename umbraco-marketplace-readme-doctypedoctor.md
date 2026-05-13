# Doc Type Doctor

Doc Type Doctor helps you analyze and manage your Umbraco document types with ease. Identify unused properties, find inconsistencies, and keep your content model healthy.

## Features

- **Similar Document Types Detection** — find document types that might be duplicates or could be consolidated
- **Unused Properties Analysis** — identify properties that are defined but never used in your content
- **Composition Chain Analysis** — visualize complex composition hierarchies and prevent circular dependencies
- **Property Naming Issues** — detect inconsistent property naming conventions across your document types

## Screenshots

<img alt="Unused Properties Analysis" src="https://raw.githubusercontent.com/Terningen/DocTypeDoctor/main/DocTypeDoctor/docs/screenshots/UnusedProperties.png" width="600">

<img alt="Similar Document Types" src="https://raw.githubusercontent.com/Terningen/DocTypeDoctor/main/DocTypeDoctor/docs/screenshots/Similarity.png" width="600">

<img alt="Composition Chains" src="https://raw.githubusercontent.com/Terningen/DocTypeDoctor/main/DocTypeDoctor/docs/screenshots/CompositionChains.png" width="600">

<img alt="Naming Issues" src="https://raw.githubusercontent.com/Terningen/DocTypeDoctor/main/DocTypeDoctor/docs/screenshots/NamingIssue.png" width="600">

## Installation

```bash
dotnet add package DocTypeDoctor
```

Once installed, Doc Type Doctor is available in the Settings section of the Umbraco backoffice.

## Requirements

- Umbraco CMS v17 or higher
- .NET 10.0 or higher

## Issues & Contributing

- Report issues: <https://github.com/Terningen/DocTypeDoctor/issues>
- Contributions welcome — see the [Contributing Guidelines](https://github.com/Terningen/DocTypeDoctor/blob/main/.github/CONTRIBUTING.md)

## License

MIT — see [LICENSE](https://github.com/Terningen/DocTypeDoctor/blob/main/LICENSE).

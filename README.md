# Doc Type Doctor

[![Downloads](https://img.shields.io/nuget/dt/DocTypeDoctor?color=cc9900)](https://www.nuget.org/packages/DocTypeDoctor/)
[![NuGet](https://img.shields.io/nuget/vpre/DocTypeDoctor?color=0273B3)](https://www.nuget.org/packages/DocTypeDoctor)
[![GitHub license](https://img.shields.io/github/license/Terningen/DocTypeDoctor?color=8AB803)](LICENSE)

> [!IMPORTANT]
> ## Version Compatibility
> - 17.x is compatible with Umbraco version 17.

Doc Type Doctor helps you analyze and manage your Umbraco document types with ease. Identify unused properties, find inconsistencies, and keep your content model healthy.

## Features

- **Similar Document Types Detection**: Find document types that might be duplicates or could be consolidated
- **Unused Properties Analysis**: Identify properties that are defined but never used in your content
- **Composition Chain Analysis**: Visualize and analyze complex composition hierarchies to prevent circular dependencies
- **Property Naming Issues**: Detect inconsistent property naming conventions across your document types

## Screenshots

<img alt="Unused Properties Analysis" src="https://github.com/Terningen/DocTypeDoctor/blob/main/DocTypeDoctor/docs/screenshots/UnusedProperties.png" width="400">

<img alt="Similar Document Types" src="https://github.com/Terningen/DocTypeDoctor/blob/main/DocTypeDoctor/docs/screenshots/Similarity.png" width="400">

<img alt="Composition Chains" src="https://github.com/Terningen/DocTypeDoctor/blob/main/DocTypeDoctor/docs/screenshots/CompositionChains.png" width="400">

<img alt="Naming Issues" src="https://github.com/Terningen/DocTypeDoctor/blob/main/DocTypeDoctor/docs/screenshots/NamingIssue.png" width="400">

## Installation

Add the package to an existing Umbraco website (v17+) from NuGet:

```bash
dotnet add package Umbraco.Community.DocTypeDoctor
```

Once installed, the Doc Type Doctor will be available in the Settings section of the Umbraco backoffice, allowing you to analyze your document types and identify potential issues.

## Requirements

- Umbraco CMS v17 or higher
- .NET 10.0 or higher

## Development

### Prerequisites

- Node LTS Version 20.17.0+
- .NET 10.0 SDK

### Building

1. Clone the repository
2. Navigate to the `Client` folder: `cd DocTypeDoctor/src/DocTypeDoctor/Client`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. The build output is copied to `wwwroot/App_Plugins/DocTypeDoctor/doc-type-doctor.js`

### File Watching

For development with hot reload:
1. Add the Razor Class Library Project as a project reference to an Umbraco Website project
2. From the `Client` folder run: `npm run watch`
3. With the Umbraco website project running, changes will trigger a rebuild and browser refresh

## Contributing

Contributions to this package are most welcome! Please read the [Contributing Guidelines](.github/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

Built with ❤️ for the Umbraco community.

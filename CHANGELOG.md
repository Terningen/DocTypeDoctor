# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [17.0.6] - 2026-05-13

### Changed
- Updated Release dropdown labels to package-minor/package-major/umbraco-major

### Fixed
- Fix NuGet push step to use explicit artifacts path

## [17.0.5] - 2026-05-13

### Added
- Added CI workflow and renamed Release bump choices
- Added Create Release Tag GitHub Action for one-click releases

### Changed
- Reorganize release into one workflow

## [17.0.4] - 2026-05-13

### Added
- Package-specific Umbraco Marketplace JSON file (`umbraco-marketplace-doctypedoctor.json`)
- Package-specific Umbraco Marketplace README file (`umbraco-marketplace-readme-doctypedoctor.md`)

### Fixed
- Install command in `README.md` corrected to `dotnet add package DocTypeDoctor`
- Eliminates all Umbraco Marketplace package validator warnings

## [17.0.3] - 2026-05-13

### Fixed
- Category changed to "Developer Tools" to pass Umbraco Marketplace validation
- README-nuget.md path fixed for NuGet packaging

## [17.0.2] - 2026-05-13

### Fixed
- Package ID changed to "DocTypeDoctor" to match NuGet package name
- Badges updated to use correct package name "DocTypeDoctor"
- README-nuget.md path corrected for proper packaging

## [17.0.1] - 2026-05-13

### Added
- Package description for NuGet and Umbraco Marketplace
- Package icon (256x256 PNG) for better package visibility
- Screenshots showcasing the package functionality
- Comprehensive README.md with features, installation, and development setup
- Enhanced CONTRIBUTING.md with detailed guidelines
- CHANGELOG.md for tracking version changes

## [17.0.0] - 2026-05-12

### Added
- Initial release for Umbraco v17
- Similar Document Types Detection
- Unused Properties Analysis
- Composition Chain Analysis
- Property Naming Issues detection

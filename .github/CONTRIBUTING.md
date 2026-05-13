# Contributing Guidelines

Contributions to Doc Type Doctor are most welcome! Thank you for considering contributing to this project.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find that the same problem was already reported or has already been fixed.

When creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you expected and what actually happened**
- **Include screenshots if applicable**
- **Mention your Umbraco version**
- **Mention your operating system**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List some examples of how this feature would be used**

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes following the existing code style
4. Add tests if applicable
5. Ensure all tests pass
6. Commit your changes with a clear commit message
7. Push to your fork and submit a pull request

### Development Setup

There is a test site in the solution to make working with this repository easier.
It is configured to do an unattended install. Check `DocTypeDoctor/src/DocTypeDoctor.TestSite/appSettings.json` for the login details.

#### Prerequisites

- Node LTS Version 20.17.0+
- .NET 10.0 SDK
- Umbraco CMS v17+

#### Building the Project

1. Clone the repository
2. Navigate to the `Client` folder: `cd DocTypeDoctor/src/DocTypeDoctor/Client`
3. Install dependencies: `npm install`
4. Build the project: `npm run build`

#### Development with Hot Reload

1. Add the Razor Class Library Project as a project reference to an Umbraco Website project
2. From the `Client` folder run: `npm run watch`
3. With the Umbraco website project running, changes will trigger a rebuild and browser refresh

## Code Style

- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and concise

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
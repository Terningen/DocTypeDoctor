# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 17.x.x  | :white_check_mark: |
| < 17.0  | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Doc Type Doctor, please report it responsibly.

### How to Report

1. **Do not** create a public issue
2. Send an email to the project maintainer: [security@example.com](mailto:security@example.com)
3. Include details about the vulnerability:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### What Happens Next

1. You will receive an acknowledgment of the report
2. We will assess the severity and determine a timeline
3. We will work on a fix and coordinate disclosure
4. Once fixed, we will release a security update
5. We will publicly disclose the vulnerability (with your consent, we may credit you)

### Security Best Practices

- Keep your Umbraco installation and all packages updated
- Review and audit user permissions regularly
- Use HTTPS in production environments
- Implement proper authentication and authorization
- Monitor logs for suspicious activity

## Security Features

Doc Type Doctor is designed with security in mind:

- Read-only analysis of document types (no modifications)
- No external network calls
- No data exfiltration
- Runs within the Umbraco backoffice security context
- Respects Umbraco user permissions

## Dependencies

We regularly update dependencies to include security patches. If you discover a vulnerability in any of our dependencies, please report it through the standard channels for that dependency.

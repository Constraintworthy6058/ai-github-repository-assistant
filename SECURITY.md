# Security policy

## Supported versions

Security fixes are applied to the latest release on the `main` branch.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use GitHub's private vulnerability reporting feature for this repository. Include a minimal reproduction, impact, affected versions, and suggested mitigation. Do not include real access tokens, client secrets, session cookies, private repository content, or personal data.

## Operator guidance

- Generate a unique `AUTH_SECRET` and rotate it if exposed.
- Use separate GitHub OAuth apps for local, staging, and production environments.
- Keep `.env` and SQLite database files out of source control and backups shared with others.
- Bind Ollama only to trusted interfaces.
- Review dependency advisories and upgrade deliberately.
- Treat AI output as untrusted advice that requires developer verification.

## Scope

The application reads repository data and creates local drafts. It has no GitHub mutation route in v0.1.0. If a future feature can post a review or modify an issue, it must require a separate explicit confirmation and display the exact payload before submission.

# RepoLens AI — AI GitHub Repository Assistant

Understand repositories faster with private, local AI.

RepoLens AI is an open-source Next.js application that connects to GitHub, lets developers explore accessible repositories, and provides evidence-grounded assistance for source code, architecture, pull requests, issues, and commits. Ollama is the default AI provider, so no paid AI service is required and selected repository context can stay on your machine.

> Status: v1.0.0 public release. GitHub OAuth, repository exploration, grounded AI assistance, Ollama integration, automated tests, and GitHub Actions CI are implemented. GitHub App installations and webhooks are documented future work.

## Features

- GitHub OAuth sign-in with secure, server-only token access
- Accessible repositories with public/private visibility and filtering
- Repository overview with language, stars, forks, issues, pull requests, and activity
- Recursive folder navigation and safe source-code viewing
- GitHub code search with file paths, context, and links
- Recent commit details and risk analysis
- Repository reports covering architecture, entry points, technologies, risks, tests, documentation, and improvements
- Repository chat that cites verified file paths and admits missing evidence
- Pull request summaries, diff explanations, risk detection, bug suggestions, and review checklists
- Issue summaries, categorization, label suggestions, implementation plans, related-file suggestions, and response drafts
- Per-file explanation, bug finding, and improvement suggestions
- Ollama availability and model status without application crashes
- Responsive, accessible light/dark interface
- No automatic GitHub review, comment, issue, or code mutations

## Privacy and safety

When Ollama is selected, the AI request travels from the Next.js server to the Ollama service configured by `OLLAMA_BASE_URL`. With the default local URL, repository context stays on the same computer. No external AI provider is required.

RepoLens AI does not execute repository code. It retrieves a bounded selection of text files, displays source as text, and asks the model to cite only verified paths. AI output is labeled as a suggestion and should be reviewed by a developer.

GitHub client secrets and access tokens are never exposed through client-side environment variables or application API responses. GitHub data is retrieved on demand rather than duplicated locally.

## Architecture

```text
Browser ── secure session ──► Next.js 16
                               ├─ Better Auth ─ Prisma ─ SQLite
                               ├─ GitHub service ─ GitHub REST API
                               └─ AIProvider ─ Ollama
```

The `AIProvider` interface keeps completion and health behavior independent from Ollama. A future OpenAI-compatible implementation can be added without changing GitHub or UI domain code. Prisma access is isolated so SQLite can later be replaced with PostgreSQL.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for boundaries, context selection, security properties, and migration guidance.

## Technology

- Next.js 16 App Router, React, and strict TypeScript
- Tailwind CSS 4 plus a project-specific tokenized design system
- Better Auth with GitHub OAuth
- Prisma ORM and SQLite
- GitHub REST API
- Ollama local chat API
- Zod validation
- Vitest
- GitHub Actions CI

## Prerequisites

- Node.js 20.9 or newer (Node.js 24 LTS recommended)
- npm 10 or newer
- A GitHub account and GitHub OAuth app
- Ollama, plus a locally installed model for live AI features

## Quick start on Windows

```powershell
git clone https://github.com/Wadan3/ai-github-repository-assistant.git
cd ai-github-repository-assistant
Copy-Item .env.example .env
npm.cmd install
npm.cmd run db:push
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `GITHUB_CLIENT_ID` | For sign-in | — | GitHub OAuth app client ID |
| `GITHUB_CLIENT_SECRET` | For sign-in | — | GitHub OAuth app client secret |
| `AUTH_SECRET` | For sign-in | — | High-entropy session/authentication secret |
| `BETTER_AUTH_URL` | Recommended | `http://localhost:3000` | Canonical application origin |
| `OLLAMA_BASE_URL` | No | `http://localhost:11434` | Ollama HTTP endpoint |
| `OLLAMA_MODEL` | No | `qwen2.5:3b` | Installed Ollama chat model |
| `DATABASE_URL` | No | `file:./dev.db` | Prisma database URL |

Copy `.env.example` to `.env`. Never prefix secrets with `NEXT_PUBLIC_` and never commit `.env`.

Generate `AUTH_SECRET` with:

```powershell
npx.cmd auth@latest secret
```

## GitHub OAuth

Create an OAuth App in [GitHub Developer Settings](https://github.com/settings/developers):

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

Copy its client ID and client secret into `.env`. This application requests `read:user`, `user:email`, and `repo`; the latter allows access to private repositories the signed-in user can already read. There are no GitHub write endpoints in this release.

See [docs/GITHUB_SETUP.md](docs/GITHUB_SETUP.md) for organization restrictions, production origins, and security notes.

## Ollama

Install Ollama, then explicitly download the default model:

```powershell
ollama pull qwen2.5:3b
ollama list
```

The application remains usable for GitHub exploration if Ollama is stopped. AI controls display `Ollama is not currently running.` rather than crashing.

See [docs/OLLAMA_SETUP.md](docs/OLLAMA_SETUP.md) for custom models and Docker host connectivity.

## Local development

```powershell
npm.cmd install
npm.cmd run db:push
npm.cmd run dev
```

Useful commands:

```powershell
npm.cmd run lint        # ESLint
npm.cmd run typecheck   # Prisma generation + strict TypeScript
npm.cmd test            # mocked automated test suite
npm.cmd run build       # production build
npm.cmd run db:studio   # inspect the local database
```

Tests never require GitHub credentials or a running Ollama instance.

## Docker

Create `.env` before starting Compose. When Ollama runs directly on the Windows host:

```powershell
docker compose build
docker compose run --rm app npx prisma db push
docker compose up
```

Compose changes `OLLAMA_BASE_URL` to `http://host.docker.internal:11434` and persists SQLite data in the `app-data` volume. It does not download models automatically.

## Error behavior

The product has explicit, safe messages for expired authentication, missing repository access, not-found resources, GitHub API failures and rate limits, empty search, invalid input, missing Ollama models, Ollama downtime, timeouts, and network failures. Server stack traces and secrets are not returned to the browser.

## GitHub integration and future GitHub App

Version 1.0.0 uses GitHub OAuth and the versioned GitHub REST API. The service layer is deliberately token-source agnostic so a GitHub App installation token can later replace the OAuth token.

Planned GitHub App work includes installation records, repository permission selection, signed webhook verification, deduplicated deliveries, and handlers for pull request, issue, push, installation, and installation-repository events. None of that webhook functionality is presented as implemented today.

Read [docs/FUTURE_GITHUB_APP.md](docs/FUTURE_GITHUB_APP.md) for the proposed permission and token model.

## Project structure

```text
app/                 pages and protected API route handlers
components/          UI, dashboard, GitHub, repository, and assistant components
lib/ai/              AIProvider and Ollama implementation
lib/auth/            Better Auth, sessions, and server-only GitHub token access
lib/db/              Prisma client
lib/github/          REST API client, errors, types, and context selection
prisma/              SQLite schema
tests/               unit, mocked service, and route tests
docs/                architecture and provider setup
.github/              CI and community templates
```

## Security

Please review [SECURITY.md](SECURITY.md). Report vulnerabilities through GitHub private vulnerability reporting, never in a public issue. Do not include tokens, cookies, secrets, private code, or personal data in reports.

## Roadmap

- Optional OpenAI-compatible AI provider
- GitHub App installation and least-privilege repository access
- Verified webhook processing for PR, Issue, and push events
- Incremental repository indexing and semantic retrieval
- Saved and exportable developer reports
- Explicit confirmation-gated GitHub comments and reviews
- PostgreSQL deployment profile
- Improved repository-wide analysis for slower local models

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). All changes should preserve server-only secrets, verified-source grounding, no code execution, and explicit confirmation before any future GitHub write.

## Release

Latest public release: [RepoLens AI v1.0.0](https://github.com/Wadan3/ai-github-repository-assistant/releases/latest)

## License

[MIT](LICENSE) © 2026 Wadan3

# Architecture

RepoLens AI is a single Next.js 16 application with server-rendered product pages and protected Route Handlers. The browser never receives a GitHub access token.

## System boundaries

```text
Browser
  │ secure session cookie
  ▼
Next.js application
  ├── Better Auth ── Prisma ── SQLite
  ├── GitHub service ───────── GitHub REST API
  └── AIProvider ───────────── Ollama on localhost
```

The application retrieves GitHub data on demand and does not mirror repositories into SQLite. Only identities, OAuth accounts, sessions, saved analyses, chats, messages, and repository preferences have database models.

## Major modules

- `app/` contains routes, server-rendered pages, and API endpoints.
- `components/` contains accessible product UI grouped by domain.
- `lib/auth/` configures Better Auth and server-only token retrieval.
- `lib/github/` wraps the REST API, normalizes errors, and selects bounded AI context.
- `lib/ai/` defines `AIProvider` and the Ollama implementation.
- `lib/db/` owns the Prisma singleton.
- `lib/validation.ts` validates all public API inputs with Zod.

## AI grounding

Repository analysis uses a conservative, bounded selection process:

1. Read the repository root.
2. Prioritize README and manifest files.
3. Inspect one level inside common source/configuration directories.
4. Ignore binary and oversized files.
5. Send verified paths alongside file content.
6. Require the model to cite only supplied paths and admit missing evidence.

This is deliberate retrieval, not a full semantic index. It keeps local requests responsive and makes sources auditable.

## Security properties

- GitHub OAuth secrets and tokens are accessed only by server code.
- All GitHub/AI application APIs require a valid session except the non-sensitive Ollama health endpoint.
- Owner, repository, path, query, SHA, action, and prompt inputs are bounded and validated.
- Repository code is displayed as text and is never executed.
- There are no GitHub write endpoints. AI comments, responses, and reviews remain drafts.
- User-facing errors omit stack traces and credentials.

## PostgreSQL migration

The application isolates Prisma access. A future migration changes the schema provider to `postgresql`, installs `@prisma/adapter-pg`, updates `lib/db/prisma.ts`, creates a migration, and changes `DATABASE_URL`. Domain code does not depend on SQLite-specific queries.

## Future GitHub App

See [FUTURE_GITHUB_APP.md](./FUTURE_GITHUB_APP.md). OAuth is the only implemented GitHub authentication mode in this release.

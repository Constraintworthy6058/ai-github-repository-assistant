# Future GitHub App architecture

GitHub OAuth is implemented today. GitHub App functionality described here is a roadmap, not a claim of current support.

## Planned data model

- `GitHubInstallation`: installation ID, account identity, suspended state, and encrypted metadata.
- `InstallationRepository`: installation-to-repository access mapping where explicit selection is enabled.
- `WebhookDelivery`: delivery ID, event type, processing state, attempt count, and timestamps—never raw secrets.

## Minimum permissions

Start with read-only permissions and add write permissions only alongside an explicit user-confirmed workflow:

- Metadata: read
- Contents: read
- Pull requests: read
- Issues: read
- Commit statuses/checks: read only if a feature needs them

## Webhook plan

A future `/api/webhooks/github` route would verify the `X-Hub-Signature-256` HMAC against the raw request body before parsing. It would deduplicate `X-GitHub-Delivery`, enqueue work, return quickly, and handle:

- `pull_request` for cache invalidation and optional analysis triggers
- `issues` for triage queue updates
- `push` for repository summary refresh
- `installation` and `installation_repositories` for access synchronization

No webhook route or background processor is implemented in v0.1.0.

## Token flow

The server would sign a short-lived JWT with the App private key, exchange it for an installation token, cache that token only until shortly before expiry, and select the token by installation and repository. Private keys would remain in a secret manager and never enter the database or browser.

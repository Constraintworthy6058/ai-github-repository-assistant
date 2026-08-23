# Contributing

Thanks for contributing to RepoLens AI.

## Development

1. Fork and clone the repository.
2. Copy `.env.example` to `.env` and configure local values.
3. Run `npm install` and `npm run db:push`.
4. Create a focused branch.
5. Before opening a pull request, run:

   ```powershell
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

## Expectations

- Keep GitHub tokens server-only.
- Do not add GitHub write behavior without an explicit confirmation UI and threat review.
- Never execute code fetched from repositories.
- Keep AI claims grounded in verified input and label suggestions.
- Add or update tests for behavior changes.
- Avoid unrelated refactors in a focused pull request.

Report security issues privately according to [SECURITY.md](./SECURITY.md), not in public issues.

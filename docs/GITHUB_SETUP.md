# GitHub OAuth setup

## Create the OAuth app

1. Open **GitHub → Settings → Developer settings → OAuth Apps**.
2. Select **New OAuth App**.
3. Use `AI GitHub Repository Assistant` as the application name.
4. Set **Homepage URL** to `http://localhost:3000`.
5. Set **Authorization callback URL** to:

   ```text
   http://localhost:3000/api/auth/callback/github
   ```

6. Register the app and generate a client secret.
7. Copy `.env.example` to `.env` and set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `AUTH_SECRET`.

Generate a strong authentication secret with:

```powershell
npx auth@latest secret
```

Never commit `.env`, paste the client secret into an issue, or expose it through a `NEXT_PUBLIC_` variable.

## Permissions

This local OAuth release requests `read:user`, `user:email`, and `repo`. The `repo` scope is needed to read private repositories accessible to the user. The application does not implement GitHub write operations.

For organizations that restrict OAuth apps, an organization owner may need to approve the app. If repositories are missing, verify organization OAuth restrictions and sign in again after approval.

## Production callback

Create a separate OAuth app for each deployed environment. Use the deployment origin for `BETTER_AUTH_URL`, homepage URL, and callback URL. HTTPS is required for a real deployment.

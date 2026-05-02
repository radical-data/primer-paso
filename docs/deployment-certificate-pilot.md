# Certificate pilot deployment

This note records the minimum deployment setup for testing the certificate draft handoff flow with a collaborating organisation.

It covers deployment only. Certificate issue, email login, audit viewing, member management, retention jobs, rate limiting, and tenant isolation hardening are later production-hardening work.

Certificate handoff access is QR/link-only. The organisation must scan the QR code or use the secure handoff link. The reference code is only a support identifier and cannot open a draft.

## Deployment shape

Deploy the public service and organisation portal as separate sites:

```txt
primerpaso.org      -> apps/public
org.primerpaso.org  -> apps/org-portal
```

Both can run on Netlify using the SvelteKit Netlify adapter. Use Node-based serverless functions for the organisation portal, not Edge Functions.

## Netlify config

The root `netlify.toml` builds the public app.

The organisation portal uses:

```txt
netlify.org-portal.toml
```

If the Netlify UI cannot use this config file directly, copy its build command and publish directory into the organisation portal site settings.

## Database

The handoff flow requires Postgres. Use a managed database and prefer a pooled connection string for serverless deployments.

Apply migrations before enabling handoff creation:

```sh
pnpm db:migrate
```

Applied migrations are tracked in:

```txt
schema_migrations
```

Do not edit an already-applied migration. Add a new migration instead.

## Environment checks

Validate the public app environment with:

```sh
pnpm check:analytics-env:strict
```

Validate the organisation portal environment with:

```sh
pnpm check:org-env:strict
```

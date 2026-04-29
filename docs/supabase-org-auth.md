# Supabase Auth setup for the organisation portal

The organisation portal uses Supabase Auth for email magic-link sign-in.

Supabase Auth is the identity layer. Primer Paso still controls authorisation
through `organisation_members` in the application database. A person can only
request a sign-in link if their email belongs to an active organisation member.

## Required environment variables

Set these for the organisation portal:

```sh
PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
PUBLIC_ORG_PORTAL_URL=https://org.primerpaso.org
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

For local development:

```sh
PUBLIC_ORG_PORTAL_URL=http://localhost:5174
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=false
```

Only set `PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true` after custom SMTP is
configured and tested in Supabase.

## Supabase dashboard setup

### 1. Authentication -> URL Configuration

Set:

```txt
Site URL: https://org.primerpaso.org
```

Add redirect URLs:

```txt
https://org.primerpaso.org/auth/callback
http://localhost:5174/auth/callback
```

Add any deploy-preview or staging callback URLs used for testing, for example:

```txt
https://preview-org-primer-paso.example.netlify.app/auth/callback
```

Do not use broad wildcard redirects for production unless there is a reviewed
deployment reason.

### 2. Authentication -> Providers -> Email

Enable email sign-ins.

The application calls Supabase with:

```ts
supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: 'https://org.primerpaso.org/auth/callback?next=/dashboard'
  }
})
```

Supabase names the method `signInWithOtp`, but it can send a magic link when
the email template uses the confirmation URL.

Use a magic-link email template that includes the confirmation URL.

### 3. Authentication -> Emails -> SMTP Settings

Production and preview environments must use custom SMTP.

Supabase's default email service is suitable for development and testing only.
For production use, configure a real SMTP provider in Supabase before setting:

```sh
PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true
```

Recommended sender identity:

```txt
From name: Primer Paso
From email: no-reply@primerpaso.org
Reply-to: support or operations mailbox, not a personal address
```

### 4. Database API and RLS posture

For this project, keep the generated Data API off unless there is a specific
reviewed need for browser-side table access.

Recommended Supabase database settings:

```txt
Enable Data API: Off
Automatically expose new tables and functions: Off
Enable automatic RLS: On
```

The organisation portal should access application tables through SvelteKit
server code, not through browser-side Supabase table queries.

## Local testing checklist

1. Start the organisation portal.
2. Open `http://localhost:5174/login`.
3. Enter an email that exists in `organisation_members`.
4. Confirm Supabase sends a magic-link email.
5. Click the link.
6. Confirm the callback lands on `/dashboard` or the pending handoff route.
7. Confirm unauthorised emails do not receive a usable login.

## Production checklist

Before enabling a real pilot:

1. Custom SMTP is configured and tested.
2. `PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true` is set only in environments where SMTP is live.
3. The production callback URL is allow-listed in Supabase.
4. Preview callback URLs are allow-listed only where needed.
5. Organisation members are seeded or managed before users attempt sign-in.
6. Audit logs record magic-link sends, denials, successful logins, and logouts.
7. A follow-up rate-limit control exists for repeated login attempts by email and IP.

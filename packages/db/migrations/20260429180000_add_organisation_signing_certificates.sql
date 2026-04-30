create table if not exists organisation_signing_certificates (
  id uuid primary key default gen_random_uuid(),

  organisation_id uuid not null references organisations(id) on delete cascade,

  encrypted_pkcs12 text not null,
  encrypted_passphrase text not null,

  subject text not null,
  issuer text not null,
  serial_number text not null,
  fingerprint_sha256 text not null,
  not_before timestamptz,
  not_after timestamptz,

  created_by_user_id uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  disabled_at timestamptz,

  constraint organisation_signing_certificates_fingerprint_format
    check (fingerprint_sha256 ~ '^[a-f0-9]{64}$')
);

create unique index if not exists organisation_signing_certificates_one_active_per_org
  on organisation_signing_certificates (organisation_id)
  where disabled_at is null;

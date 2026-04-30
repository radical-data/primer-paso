create table if not exists certificate_handoffs (
	id uuid primary key,
	reference_code text not null unique,
	token_hash text not null unique,
	status text not null default 'active',
	draft jsonb not null,
	consent jsonb not null,
	created_at timestamptz not null default now(),
	expires_at timestamptz not null,
	created_from_session_id text,
	opened_at timestamptz,
	revoked_at timestamptz,
	issued_certificate_id uuid,
	constraint certificate_handoffs_status_check check (
		status in ('active', 'opened', 'issued', 'expired', 'revoked')
	)
);

create index if not exists certificate_handoffs_token_hash_idx
	on certificate_handoffs (token_hash);

create index if not exists certificate_handoffs_reference_code_idx
	on certificate_handoffs (reference_code);

create index if not exists certificate_handoffs_expires_at_idx
	on certificate_handoffs (expires_at);

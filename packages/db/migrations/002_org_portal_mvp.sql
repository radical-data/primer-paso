create table if not exists organisations (
	id uuid primary key,
	name text not null,
	registration_number text,
	nif_cif text,
	address text,
	email text,
	phone text,
	entity_type text not null default 'third_sector_or_union',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint organisations_entity_type_check check (
		entity_type in ('public_administration', 'third_sector_or_union')
	)
);

create table if not exists organisation_members (
	id uuid primary key,
	organisation_id uuid not null references organisations(id),
	email text not null,
	name text not null,
	role text not null,
	status text not null default 'active',
	created_at timestamptz not null default now(),
	unique (organisation_id, email),
	constraint organisation_members_role_check check (
		role in ('admin', 'audit_viewer', 'intake_volunteer', 'authorised_signer')
	),
	constraint organisation_members_status_check check (
		status in ('invited', 'active', 'disabled')
	)
);

create unique index if not exists organisation_members_email_active_idx
	on organisation_members (lower(email))
	where status = 'active';

create table if not exists organisation_sessions (
	id uuid primary key,
	member_id uuid not null references organisation_members(id),
	session_hash text not null unique,
	created_at timestamptz not null default now(),
	expires_at timestamptz not null,
	last_seen_at timestamptz,
	revoked_at timestamptz
);

create index if not exists organisation_sessions_session_hash_idx
	on organisation_sessions (session_hash);

create index if not exists organisation_sessions_member_id_idx
	on organisation_sessions (member_id);

create table if not exists certificate_handoff_reviews (
	id uuid primary key,
	handoff_id uuid not null references certificate_handoffs(id),
	organisation_id uuid not null references organisations(id),
	reviewer_member_id uuid not null references organisation_members(id),
	status text not null default 'in_review',
	draft_snapshot jsonb not null,
	reviewed_data jsonb not null,
	verification jsonb,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	ready_to_issue_at timestamptz,
	issued_at timestamptz,
	unique (handoff_id, organisation_id),
	constraint certificate_handoff_reviews_status_check check (
		status in ('in_review', 'ready_to_issue', 'issued', 'cancelled')
	)
);

create index if not exists certificate_handoff_reviews_handoff_id_idx
	on certificate_handoff_reviews (handoff_id);

create index if not exists certificate_handoff_reviews_organisation_id_idx
	on certificate_handoff_reviews (organisation_id);

create table if not exists audit_events (
	id uuid primary key,
	organisation_id uuid references organisations(id),
	member_id uuid references organisation_members(id),
	handoff_id uuid references certificate_handoffs(id),
	review_id uuid references certificate_handoff_reviews(id),
	event_type text not null,
	event_data jsonb not null default '{}',
	ip_address inet,
	user_agent text,
	created_at timestamptz not null default now()
);

create index if not exists audit_events_organisation_id_created_at_idx
	on audit_events (organisation_id, created_at desc);

create index if not exists audit_events_handoff_id_created_at_idx
	on audit_events (handoff_id, created_at desc);

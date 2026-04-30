create table if not exists organisation_auth_rate_limits (
	id uuid primary key,
	identifier text not null,
	identifier_type text not null,
	action text not null,
	attempt_count integer not null default 1,
	window_started_at timestamptz not null,
	last_attempt_at timestamptz not null,
	blocked_until timestamptz,
	constraint organisation_auth_rate_limits_identifier_type_check check (
		identifier_type in ('email', 'ip', 'email_ip')
	),
	constraint organisation_auth_rate_limits_action_check check (
		action in ('magic_link')
	),
	constraint organisation_auth_rate_limits_attempt_count_check check (attempt_count > 0),
	unique (identifier, identifier_type, action)
);

create index if not exists organisation_auth_rate_limits_blocked_until_idx
	on organisation_auth_rate_limits (blocked_until);

create index if not exists organisation_auth_rate_limits_last_attempt_at_idx
	on organisation_auth_rate_limits (last_attempt_at);

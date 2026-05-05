alter table certificate_handoff_reviews
	add column if not exists corrections jsonb not null default '[]'::jsonb;

create index if not exists certificate_handoff_reviews_corrections_gin_idx
	on certificate_handoff_reviews
	using gin (corrections);

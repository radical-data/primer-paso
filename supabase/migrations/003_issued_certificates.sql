create table if not exists issued_certificates (
	id uuid primary key,
	review_id uuid not null references certificate_handoff_reviews(id),
	handoff_id uuid not null references certificate_handoffs(id),
	organisation_id uuid not null references organisations(id),
	signer_member_id uuid not null references organisation_members(id),
	issue_request jsonb not null,
	pdf_bytes bytea not null,
	filename text not null,
	content_type text not null,
	created_at timestamptz not null default now(),
	unique (review_id)
);

create index if not exists issued_certificates_handoff_id_idx
	on issued_certificates (handoff_id);

create index if not exists issued_certificates_organisation_id_created_at_idx
	on issued_certificates (organisation_id, created_at desc);

create index if not exists issued_certificates_signer_member_id_idx
	on issued_certificates (signer_member_id);

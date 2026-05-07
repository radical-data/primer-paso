alter table certificate_handoff_reviews
	alter column handoff_id drop not null;

alter table certificate_handoff_reviews
	add column if not exists origin text not null default 'public_handoff';

alter table certificate_handoff_reviews
	add column if not exists applicant_confirmation jsonb;

alter table certificate_handoff_reviews
	drop constraint if exists certificate_handoff_reviews_origin_check;

alter table certificate_handoff_reviews
	add constraint certificate_handoff_reviews_origin_check check (
		origin in ('public_handoff', 'organisation_created')
	);

alter table certificate_handoff_reviews
	drop constraint if exists certificate_handoff_reviews_origin_handoff_check;

alter table certificate_handoff_reviews
	add constraint certificate_handoff_reviews_origin_handoff_check check (
		(origin = 'public_handoff' and handoff_id is not null)
		or (origin = 'organisation_created' and handoff_id is null)
	);

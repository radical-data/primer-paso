alter table organisation_members
	add column if not exists updated_at timestamptz not null default now();

alter table organisation_members
	add column if not exists disabled_at timestamptz;

alter table organisation_members
	add column if not exists disabled_by_member_id uuid references organisation_members(id);

create index if not exists organisation_members_organisation_id_idx
	on organisation_members (organisation_id);

create index if not exists organisation_members_organisation_status_role_idx
	on organisation_members (organisation_id, status, role);

create index if not exists audit_events_member_id_created_at_idx
	on audit_events (member_id, created_at desc);

create or replace function set_organisation_members_updated_at()
returns trigger
language plpgsql
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists organisation_members_set_updated_at on organisation_members;

create trigger organisation_members_set_updated_at
	before update on organisation_members
	for each row
	execute function set_organisation_members_updated_at();

update organisation_members
set
	updated_at = created_at,
	disabled_at = case when status = 'disabled' then created_at else disabled_at end
where updated_at is null
	or (status = 'disabled' and disabled_at is null);

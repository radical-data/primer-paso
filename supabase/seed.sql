insert into organisations (
	id,
	name,
	registration_number,
	nif_cif,
	address,
	email,
	phone,
	entity_type,
	created_at,
	updated_at
)
values (
	'00000000-0000-4000-8000-000000000001',
	'Entidad Colaboradora Local',
	'LOCAL-0001',
	'G00000000',
	'Calle Local 1, 28001 Madrid',
	'certificados@example.invalid',
	'+34 910 000 000',
	'third_sector_or_union',
	now(),
	now()
)
on conflict (id) do update set
	name = excluded.name,
	registration_number = excluded.registration_number,
	nif_cif = excluded.nif_cif,
	address = excluded.address,
	email = excluded.email,
	phone = excluded.phone,
	entity_type = excluded.entity_type,
	updated_at = now();

insert into organisation_members (
	id,
	organisation_id,
	email,
	name,
	role,
	status,
	created_at,
	updated_at
)
values
	(
		'00000000-0000-4000-8000-000000000101',
		'00000000-0000-4000-8000-000000000001',
		'admin@example.invalid',
		'Alex Admin',
		'admin',
		'active',
		now(),
		now()
	),
	(
		'00000000-0000-4000-8000-000000000102',
		'00000000-0000-4000-8000-000000000001',
		'volunteer@example.invalid',
		'Valeria Volunteer',
		'intake_volunteer',
		'active',
		now(),
		now()
	),
	(
		'00000000-0000-4000-8000-000000000103',
		'00000000-0000-4000-8000-000000000001',
		'signer@example.invalid',
		'Sofia Signer',
		'authorised_signer',
		'active',
		now(),
		now()
	)
on conflict (organisation_id, email) do update set
	name = excluded.name,
	role = excluded.role,
	status = excluded.status,
	updated_at = now(),
	disabled_at = null,
	disabled_by_member_id = null;

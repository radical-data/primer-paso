import postgres from 'postgres'

const databaseUrl = process.env.PRIVATE_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()

if (!databaseUrl) {
	console.error(
		'Set PRIVATE_DATABASE_URL or DATABASE_URL before running the local organisation portal seed.'
	)
	process.exit(1)
}

const sql = postgres(databaseUrl, {
	prepare: false,
	max: 1
})

const organisation = {
	id: '00000000-0000-4000-8000-000000000001',
	name: 'Entidad Colaboradora Local',
	registrationNumber: 'LOCAL-0001',
	nifCif: 'G00000000',
	address: 'Calle Local 1, 28001 Madrid',
	email: 'certificados@example.invalid',
	phone: '+34 910 000 000',
	entityType: 'third_sector_or_union'
} as const

const members = [
	{
		id: '00000000-0000-4000-8000-000000000101',
		email: 'admin@example.invalid',
		name: 'Alex Admin',
		role: 'admin'
	},
	{
		id: '00000000-0000-4000-8000-000000000102',
		email: 'volunteer@example.invalid',
		name: 'Valeria Volunteer',
		role: 'intake_volunteer'
	},
	{
		id: '00000000-0000-4000-8000-000000000103',
		email: 'signer@example.invalid',
		name: 'Sofia Signer',
		role: 'authorised_signer'
	}
] as const

const main = async () => {
	await sql.begin(async (tx) => {
		await tx`
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
				${organisation.id},
				${organisation.name},
				${organisation.registrationNumber},
				${organisation.nifCif},
				${organisation.address},
				${organisation.email},
				${organisation.phone},
				${organisation.entityType},
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
				updated_at = now()
		`

		for (const member of members) {
			await tx`
				insert into organisation_members (
					id,
					organisation_id,
					email,
					name,
					role,
					status,
					created_at
				)
				values (
					${member.id},
					${organisation.id},
					${member.email},
					${member.name},
					${member.role},
					'active',
					now()
				)
				on conflict (organisation_id, email) do update set
					name = excluded.name,
					role = excluded.role,
					status = excluded.status
			`
		}
	})

	console.log('Seeded local organisation portal data.')
	console.log('')
	console.log('Organisation:')
	console.log(`- ${organisation.name}`)
	console.log('')
	console.log('Members:')
	for (const member of members) {
		console.log(`- ${member.email} (${member.role})`)
	}
	console.log('')
	console.log(
		'Use organisation portal magic-link sign-in with any seeded email above (Supabase Auth).'
	)
}

main()
	.catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(async () => {
		await sql.end()
	})

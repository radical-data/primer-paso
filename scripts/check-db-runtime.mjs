import postgres from 'postgres'

const args = new Set(process.argv.slice(2))
const strict = args.has('--strict')
const smoke = args.has('--smoke')

const read = (key) => process.env[key]

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const redactDatabaseUrl = (value) => {
	if (!isNonEmptyString(value)) return '(missing)'

	try {
		const url = new URL(value)
		if (url.password) url.password = '***'
		if (url.username) url.username = `${url.username.split('.')[0]}...`
		return url.toString()
	} catch {
		return '(invalid URL)'
	}
}

const parseDatabaseUrl = (value) => {
	if (!isNonEmptyString(value)) return null

	try {
		return new URL(value)
	} catch {
		return null
	}
}

const isPostgresProtocol = (url) => url.protocol === 'postgres:' || url.protocol === 'postgresql:'

const looksLikeSupabasePooler = (url) =>
	url.hostname.endsWith('.pooler.supabase.com') || url.hostname.includes('.pooler.supabase.')

const looksLikeSupabaseDirectHost = (url) =>
	url.hostname.endsWith('.supabase.co') || url.hostname.includes('.supabase.co')

const isTransactionPoolerPort = (url) => url.port === '6543'

const provider = read('PRIVATE_DATABASE_PROVIDER')?.trim().toLowerCase()
const databaseUrl = read('PRIVATE_DATABASE_URL')?.trim()
const environment = read('PRIVATE_ORG_PORTAL_ENVIRONMENT')?.trim()
const handoffEnabled = read('PUBLIC_CERTIFICATE_HANDOFF_ENABLED')?.trim()

const failures = []
const warnings = []

if (provider && provider !== 'supabase' && provider !== 'postgres') {
	failures.push('PRIVATE_DATABASE_PROVIDER must be "supabase" or "postgres" when provided')
}

const parsed = parseDatabaseUrl(databaseUrl)

if (!parsed) {
	if (handoffEnabled === 'true' || environment === 'preview' || environment === 'production') {
		failures.push('PRIVATE_DATABASE_URL is required for deployed storage-backed environments')
	} else {
		warnings.push('PRIVATE_DATABASE_URL is not set; storage-backed features will be unavailable')
	}
} else {
	if (!isPostgresProtocol(parsed)) {
		failures.push('PRIVATE_DATABASE_URL must use postgres:// or postgresql://')
	}

	if (!parsed.username) {
		failures.push('PRIVATE_DATABASE_URL must include a database username')
	}

	if (!parsed.password) {
		failures.push('PRIVATE_DATABASE_URL must include a database password')
	}

	if (!parsed.hostname) {
		failures.push('PRIVATE_DATABASE_URL must include a hostname')
	}

	if (
		provider === 'supabase' ||
		looksLikeSupabasePooler(parsed) ||
		looksLikeSupabaseDirectHost(parsed)
	) {
		if (!looksLikeSupabasePooler(parsed)) {
			warnings.push(
				'PRIVATE_DATABASE_URL does not look like a Supabase pooler URL. For Netlify/serverless, prefer the Transaction pooler URL.'
			)
		}

		if (looksLikeSupabasePooler(parsed) && !isTransactionPoolerPort(parsed)) {
			warnings.push(
				'PRIVATE_DATABASE_URL looks like a Supabase pooler URL but is not using port 6543. Confirm whether this is transaction or session pooling.'
			)
		}

		const sslmode = parsed.searchParams.get('sslmode')
		if (sslmode !== 'require') {
			warnings.push('Supabase runtime URLs should usually include sslmode=require')
		}
	}
}

const runSmokeCheck = async () => {
	if (!databaseUrl || failures.length > 0) return

	const sql = postgres(databaseUrl, {
		prepare: false,
		max: 1
	})

	try {
		const rows = await sql`
			select
				current_database() as database_name,
				current_user as user_name,
				version() as version
		`

		const migrationRows = await sql`
			select to_regclass('public.schema_migrations') as schema_migrations_table
		`

		const migrationTable = migrationRows[0]?.schema_migrations_table
		if (!migrationTable) {
			warnings.push(
				'schema_migrations table was not found. Run pnpm db:migrate before using storage-backed features.'
			)
		}

		return rows[0]
	} finally {
		await sql.end()
	}
}

const smokeResult = smoke
	? await runSmokeCheck().catch((error) => {
			failures.push(`Database smoke check failed: ${error.message}`)
			return null
		})
	: null

const lines = []

if (failures.length > 0) {
	lines.push('Database runtime check failed:')
	for (const failure of failures) lines.push(`- ${failure}`)
}

if (warnings.length > 0) {
	lines.push('Warnings:')
	for (const warning of warnings) lines.push(`- ${warning}`)
}

if (failures.length === 0) {
	lines.push('Database runtime check passed.')
	lines.push(`- provider: ${provider || '(unset)'}`)
	lines.push(`- database URL: ${redactDatabaseUrl(databaseUrl)}`)
	lines.push(`- storage configured: ${isNonEmptyString(databaseUrl) ? 'yes' : 'no'}`)
	if (smokeResult) {
		lines.push(`- connected database: ${smokeResult.database_name}`)
		lines.push(`- connected user: ${smokeResult.user_name}`)
	}
	if (!smoke) {
		lines.push('- smoke query: skipped; pass --smoke to test a live connection')
	}
}

console.log(lines.join('\n'))

if (strict && failures.length > 0) {
	process.exit(1)
}

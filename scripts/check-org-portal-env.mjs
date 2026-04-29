const args = new Set(process.argv.slice(2))
const strict = args.has('--strict')

const read = (key) => process.env[key]

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const isBooleanString = (value) => value === 'true' || value === 'false'

const isAbsoluteHttpUrl = (value) => {
	if (!isNonEmptyString(value)) return false
	try {
		const url = new URL(value)
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

const parseUrl = (value) => {
	if (!isNonEmptyString(value)) return null
	try {
		return new URL(value)
	} catch {
		return null
	}
}

const isPostgresUrl = (url) => url.protocol === 'postgres:' || url.protocol === 'postgresql:'

const looksLikeSupabasePooler = (url) =>
	url.hostname.endsWith('.pooler.supabase.com') || url.hostname.includes('.pooler.supabase.')

const looksLikeSupabaseDirectHost = (url) =>
	url.hostname.endsWith('.supabase.co') || url.hostname.includes('.supabase.co')

const usesTransactionPoolerPort = (url) => url.port === '6543'

const isValidOrgPortalEnvironment = (value) =>
	value === 'local' || value === 'test' || value === 'preview' || value === 'production'

const failures = []
const warnings = []

const requiredKeys = [
	'PUBLIC_ORG_PORTAL_URL',
	'PRIVATE_ORG_PORTAL_ENVIRONMENT',
	'PUBLIC_SUPABASE_URL',
	'PUBLIC_SUPABASE_PUBLISHABLE_KEY',
	'PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED'
]

for (const key of requiredKeys) {
	if (!isNonEmptyString(read(key))) {
		failures.push(`${key} is missing`)
	}
}

const environment = read('PRIVATE_ORG_PORTAL_ENVIRONMENT')
if (environment !== undefined && !isValidOrgPortalEnvironment(environment)) {
	failures.push(
		'PRIVATE_ORG_PORTAL_ENVIRONMENT must be one of "local", "test", "preview", or "production"'
	)
}

const orgPortalUrl = read('PUBLIC_ORG_PORTAL_URL')
if (orgPortalUrl !== undefined && !isAbsoluteHttpUrl(orgPortalUrl)) {
	failures.push('PUBLIC_ORG_PORTAL_URL must be an absolute http or https URL')
}

if (environment === 'production' && orgPortalUrl?.startsWith('http://')) {
	failures.push('PUBLIC_ORG_PORTAL_URL must use https in production')
}

const supabaseUrl = read('PUBLIC_SUPABASE_URL')
if (supabaseUrl !== undefined && !isAbsoluteHttpUrl(supabaseUrl)) {
	failures.push('PUBLIC_SUPABASE_URL must be an absolute http or https URL')
}

if (environment === 'production' && supabaseUrl?.startsWith('http://')) {
	failures.push('PUBLIC_SUPABASE_URL must use https in production')
}

if (environment === 'production' && !String(supabaseUrl ?? '').includes('.supabase.co')) {
	warnings.push('PUBLIC_SUPABASE_URL does not look like a hosted Supabase project URL')
}

const supabasePublishableKey = read('PUBLIC_SUPABASE_PUBLISHABLE_KEY')
if (
	isNonEmptyString(supabasePublishableKey) &&
	!supabasePublishableKey.trim().startsWith('sb_publishable_')
) {
	warnings.push(
		'PUBLIC_SUPABASE_PUBLISHABLE_KEY does not look like a current Supabase publishable key'
	)
}

const databaseUrl = read('PRIVATE_DATABASE_URL')
const databaseProvider = read('PRIVATE_DATABASE_PROVIDER')?.trim().toLowerCase()

if (
	databaseProvider !== undefined &&
	databaseProvider !== '' &&
	databaseProvider !== 'supabase' &&
	databaseProvider !== 'postgres'
) {
	failures.push('PRIVATE_DATABASE_PROVIDER must be "supabase" or "postgres" when provided')
}

if (environment === 'production' || environment === 'preview') {
	if (!isNonEmptyString(databaseUrl)) {
		failures.push('PRIVATE_DATABASE_URL is required for deployed organisation portal environments')
	}
}

const parsedDatabaseUrl = parseUrl(databaseUrl)
if (isNonEmptyString(databaseUrl) && !parsedDatabaseUrl) {
	failures.push('PRIVATE_DATABASE_URL must be a valid Postgres connection URL')
}

if (parsedDatabaseUrl && !isPostgresUrl(parsedDatabaseUrl)) {
	failures.push('PRIVATE_DATABASE_URL must use postgres:// or postgresql://')
}

if (
	parsedDatabaseUrl &&
	(environment === 'production' || environment === 'preview') &&
	(databaseProvider === 'supabase' || looksLikeSupabaseDirectHost(parsedDatabaseUrl)) &&
	!looksLikeSupabasePooler(parsedDatabaseUrl)
) {
	warnings.push('For deployed Supabase Postgres on Netlify, prefer the Transaction pooler URL.')
}

if (
	parsedDatabaseUrl &&
	looksLikeSupabasePooler(parsedDatabaseUrl) &&
	!usesTransactionPoolerPort(parsedDatabaseUrl)
) {
	warnings.push(
		'Supabase pooler URL is not using port 6543. Confirm whether this is the intended pooler mode.'
	)
}

const handoffEnabled = read('PUBLIC_CERTIFICATE_HANDOFF_ENABLED')
if (handoffEnabled !== undefined && !isBooleanString(handoffEnabled)) {
	failures.push('PUBLIC_CERTIFICATE_HANDOFF_ENABLED must be "true" or "false" when provided')
}

const devLoginEnabled = read('PRIVATE_ORG_PORTAL_DEV_LOGIN_ENABLED')
if (devLoginEnabled !== undefined && !isBooleanString(devLoginEnabled)) {
	failures.push('PRIVATE_ORG_PORTAL_DEV_LOGIN_ENABLED must be "true" or "false" when provided')
}

if (environment === 'production' && devLoginEnabled === 'true') {
	failures.push('PRIVATE_ORG_PORTAL_DEV_LOGIN_ENABLED must not be true in production')
}

const customSmtpConfigured = read('PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED')
if (customSmtpConfigured !== undefined && !isBooleanString(customSmtpConfigured)) {
	failures.push('PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED must be "true" or "false"')
}

if (
	(environment === 'production' || environment === 'preview') &&
	customSmtpConfigured !== 'true'
) {
	failures.push(
		'PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED=true is required for deployed organisation portal environments'
	)
}

const lines = []

if (failures.length > 0) {
	lines.push('Organisation portal environment check failed:')
	for (const failure of failures) {
		lines.push(`- ${failure}`)
	}
}

if (warnings.length > 0) {
	lines.push('Warnings:')
	for (const warning of warnings) {
		lines.push(`- ${warning}`)
	}
}

if (failures.length === 0) {
	lines.push('Organisation portal environment check passed.')
	lines.push(`- environment: ${environment ?? '(missing)'}`)
	lines.push(`- organisation portal URL: ${orgPortalUrl ?? '(missing)'}`)
	lines.push(`- database provider: ${databaseProvider || '(unset)'}`)
	lines.push(`- database configured: ${isNonEmptyString(databaseUrl) ? 'yes' : 'no'}`)
	lines.push(`- dev login enabled: ${devLoginEnabled ?? '(unset)'}`)
	lines.push(`- Supabase auth configured: ${isNonEmptyString(supabaseUrl) ? 'yes' : 'no'}`)
	lines.push(
		`- Supabase publishable key configured: ${isNonEmptyString(supabasePublishableKey) ? 'yes' : 'no'}`
	)
	lines.push(`- custom SMTP configured: ${customSmtpConfigured ?? '(missing)'}`)
}

console.log(lines.join('\n'))

if (strict && failures.length > 0) {
	process.exit(1)
}

const requiredKeys = [
	'PUBLIC_MATOMO_URL',
	'PUBLIC_MATOMO_ENABLED',
	'PUBLIC_MATOMO_DIMENSION_LOCALE',
	'PUBLIC_MATOMO_DIMENSION_ENVIRONMENT',
	'PUBLIC_MATOMO_DIMENSION_ROUTE_GROUP',
	'PUBLIC_MATOMO_DIMENSION_STEP_SLUG',
	'PUBLIC_MATOMO_DIMENSION_RESULT_STATE',
	'PUBLIC_MATOMO_DIMENSION_RECOMMENDED_ROUTE',
	'PUBLIC_MATOMO_SITE_ID_PRODUCTION',
	'PUBLIC_MATOMO_SITE_ID_TEST',
	'PUBLIC_MATOMO_LOCAL_ANALYTICS',
	'PUBLIC_MATOMO_PRODUCTION_HOSTS',
	'PUBLIC_CERTIFICATE_HANDOFF_ENABLED',
	'PUBLIC_ORG_PORTAL_URL'
]

const args = new Set(process.argv.slice(2))
const strict = args.has('--strict')

const read = (key) => process.env[key]

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0

const isPositiveIntegerString = (value) => {
	if (!isNonEmptyString(value)) return false
	return /^[1-9]\d*$/.test(value.trim())
}

const isBooleanString = (value) => value === 'true' || value === 'false'

const isLocalAnalyticsMode = (value) => value === 'off' || value === 'test'

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

const parseHosts = (value) =>
	(value ?? '')
		.split(',')
		.map((host) => host.trim().toLowerCase())
		.filter(Boolean)

const failures = []
const warnings = []

for (const key of requiredKeys) {
	if (!isNonEmptyString(read(key))) {
		failures.push(`${key} is missing`)
	}
}

const enabled = read('PUBLIC_MATOMO_ENABLED')
if (enabled !== undefined && !isBooleanString(enabled)) {
	failures.push('PUBLIC_MATOMO_ENABLED must be "true" or "false"')
}

const certificateHandoffEnabled = read('PUBLIC_CERTIFICATE_HANDOFF_ENABLED')
if (certificateHandoffEnabled !== undefined && !isBooleanString(certificateHandoffEnabled)) {
	failures.push('PUBLIC_CERTIFICATE_HANDOFF_ENABLED must be "true" or "false"')
}

const orgPortalUrl = read('PUBLIC_ORG_PORTAL_URL')
if (orgPortalUrl !== undefined && !isAbsoluteHttpUrl(orgPortalUrl)) {
	failures.push('PUBLIC_ORG_PORTAL_URL must be an absolute http or https URL')
}

const databaseUrl = read('PRIVATE_DATABASE_URL')
const databaseProvider = read('PRIVATE_DATABASE_PROVIDER')?.trim().toLowerCase()
const parsedDatabaseUrl = parseUrl(databaseUrl)

if (certificateHandoffEnabled === 'true' && !isNonEmptyString(databaseUrl)) {
	failures.push('PRIVATE_DATABASE_URL is required when PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true')
}

if (
	databaseProvider !== undefined &&
	databaseProvider !== '' &&
	databaseProvider !== 'supabase' &&
	databaseProvider !== 'postgres'
) {
	failures.push('PRIVATE_DATABASE_PROVIDER must be "supabase" or "postgres" when provided')
}

if (isNonEmptyString(databaseUrl) && !parsedDatabaseUrl) {
	failures.push('PRIVATE_DATABASE_URL must be a valid Postgres connection URL')
}

if (parsedDatabaseUrl && !isPostgresUrl(parsedDatabaseUrl)) {
	failures.push('PRIVATE_DATABASE_URL must use postgres:// or postgresql://')
}

if (
	parsedDatabaseUrl &&
	databaseProvider === 'supabase' &&
	looksLikeSupabaseDirectHost(parsedDatabaseUrl) &&
	!looksLikeSupabasePooler(parsedDatabaseUrl)
) {
	warnings.push('For deployed Supabase Postgres on Netlify, prefer the Transaction pooler URL.')
}

const matomoUrl = read('PUBLIC_MATOMO_URL')
if (matomoUrl !== undefined && !isAbsoluteHttpUrl(matomoUrl)) {
	failures.push('PUBLIC_MATOMO_URL must be an absolute http or https URL')
}

for (const key of [
	'PUBLIC_MATOMO_DIMENSION_LOCALE',
	'PUBLIC_MATOMO_DIMENSION_ENVIRONMENT',
	'PUBLIC_MATOMO_DIMENSION_ROUTE_GROUP',
	'PUBLIC_MATOMO_DIMENSION_STEP_SLUG',
	'PUBLIC_MATOMO_DIMENSION_RESULT_STATE',
	'PUBLIC_MATOMO_DIMENSION_RECOMMENDED_ROUTE',
	'PUBLIC_MATOMO_SITE_ID_PRODUCTION',
	'PUBLIC_MATOMO_SITE_ID_TEST'
]) {
	const value = read(key)
	if (value !== undefined && !isPositiveIntegerString(value)) {
		failures.push(`${key} must be a positive integer string`)
	}
}

const localAnalytics = read('PUBLIC_MATOMO_LOCAL_ANALYTICS')
if (localAnalytics !== undefined && !isLocalAnalyticsMode(localAnalytics)) {
	failures.push('PUBLIC_MATOMO_LOCAL_ANALYTICS must be "off" or "test"')
}

const productionHosts = parseHosts(read('PUBLIC_MATOMO_PRODUCTION_HOSTS'))
if (productionHosts.length === 0) {
	failures.push('PUBLIC_MATOMO_PRODUCTION_HOSTS must contain at least one hostname')
}

for (const host of productionHosts) {
	if (host.includes('://') || host.includes('/')) {
		failures.push(
			'PUBLIC_MATOMO_PRODUCTION_HOSTS must contain hostnames only, without protocol or path'
		)
		break
	}
}

if (enabled === 'false') {
	warnings.push(
		'PUBLIC_MATOMO_ENABLED=false: analytics is disabled, but the environment contract is still being validated'
	)
}

const lines = []

if (failures.length > 0) {
	lines.push('Matomo environment check failed:')
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
	lines.push('Matomo environment check passed.')
	lines.push(`- enabled: ${enabled ?? '(missing)'}`)
	lines.push(`- local analytics: ${localAnalytics ?? '(missing)'}`)
	lines.push(`- production hosts: ${productionHosts.join(', ') || '(none)'}`)
	lines.push(`- certificate handoff enabled: ${certificateHandoffEnabled ?? '(missing)'}`)
	lines.push(`- organisation portal URL: ${orgPortalUrl ?? '(missing)'}`)
	lines.push(`- database provider: ${databaseProvider || '(unset)'}`)
	lines.push(`- database configured: ${isNonEmptyString(databaseUrl) ? 'yes' : 'no'}`)
}

console.log(lines.join('\n'))

if (strict && failures.length > 0) {
	process.exit(1)
}

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

const isValidOrgPortalEnvironment = (value) =>
	value === 'local' || value === 'test' || value === 'preview' || value === 'production'

const failures = []
const warnings = []

const requiredKeys = [
	'PUBLIC_ORG_PORTAL_URL',
	'PRIVATE_ORG_PORTAL_ENVIRONMENT',
	'PRIVATE_ORG_PORTAL_LOGIN_CODE'
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

const databaseUrl = read('PRIVATE_DATABASE_URL')
if (environment === 'production' || environment === 'preview') {
	if (!isNonEmptyString(databaseUrl)) {
		failures.push('PRIVATE_DATABASE_URL is required for deployed organisation portal environments')
	}
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

const loginCode = read('PRIVATE_ORG_PORTAL_LOGIN_CODE')
if (isNonEmptyString(loginCode) && loginCode.trim().length < 10 && environment === 'production') {
	warnings.push(
		'PRIVATE_ORG_PORTAL_LOGIN_CODE is shorter than 10 characters. This is only a temporary pilot login mechanism.'
	)
}

if (environment === 'production') {
	warnings.push(
		'Bootstrap login code is enabled for production. Replace it with per-user email login before a wider pilot.'
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
	lines.push(`- database configured: ${isNonEmptyString(databaseUrl) ? 'yes' : 'no'}`)
	lines.push(`- dev login enabled: ${devLoginEnabled ?? '(unset)'}`)
}

console.log(lines.join('\n'))

if (strict && failures.length > 0) {
	process.exit(1)
}

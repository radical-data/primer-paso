const publicUrl = process.env.PUBLIC_APP_URL?.trim() || 'https://primerpaso.org'
const orgUrl = process.env.PUBLIC_ORG_PORTAL_URL?.trim() || 'https://org.primerpaso.org'

const checks = [
	{
		name: 'Public app home',
		url: `${publicUrl.replace(/\/+$/, '')}/es`
	},
	{
		name: 'Public app screener',
		url: `${publicUrl.replace(/\/+$/, '')}/es/screener`
	},
	{
		name: 'Organisation portal login',
		url: `${orgUrl.replace(/\/+$/, '')}/login`
	}
]

const fetchCheck = async ({ name, url }) => {
	const response = await fetch(url, {
		redirect: 'manual',
		headers: {
			'user-agent': 'primer-paso-certificate-pilot-smoke-check'
		}
	})

	const ok = response.status >= 200 && response.status < 400

	return {
		name,
		url,
		status: response.status,
		ok
	}
}

const main = async () => {
	const results = []

	for (const check of checks) {
		results.push(await fetchCheck(check))
	}

	let failed = false

	for (const result of results) {
		const marker = result.ok ? 'ok' : 'failed'
		console.log(`${marker}: ${result.name}`)
		console.log(`  ${result.url}`)
		console.log(`  status: ${result.status}`)

		if (!result.ok) {
			failed = true
		}
	}

	console.log('')
	console.log('This smoke script only checks deployed entry points.')
	console.log('Complete the manual handoff smoke test in docs/deployment-certificate-pilot.md.')

	if (failed) {
		process.exit(1)
	}
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})

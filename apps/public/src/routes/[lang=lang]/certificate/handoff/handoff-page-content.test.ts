import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const here = dirname(fileURLToPath(import.meta.url))
const pageSvelte = readFileSync(join(here, '+page.svelte'), 'utf8')
const pageServer = readFileSync(join(here, '+page.server.ts'), 'utf8')

describe('public certificate handoff page', () => {
	it('positions reference code as support-only, not as an opener', () => {
		expect(pageSvelte).toContain(
			'Use this code only if support staff need to identify this handoff'
		)
		expect(pageSvelte).toContain('It cannot open the draft')
		expect(pageSvelte).not.toContain('Show the QR code or reference code')
		expect(pageSvelte).toContain('Show this QR code or secure link to the organisation')
	})

	it('describes QR and secure link access without reference-code fallback', () => {
		expect(pageSvelte).toContain('This QR code opens the secure organisation handoff link')
		expect(pageSvelte).toContain('copy or type this secure link')
		expect(pageSvelte).toContain('data.orgHandoffUrl')
		expect(pageSvelte).toContain('Copy secure link')
		expect(pageSvelte).toContain('Link copied.')
		expect(pageSvelte).toContain('aria-live="polite"')
	})

	it('builds org handoff and QR URLs from the opaque token', () => {
		expect(pageServer).toContain("url.searchParams.set('token', token)")
		expect(pageServer).toContain('/handoff')
		expect(pageServer).toContain('qr.svg')
		expect(pageServer).toContain('encodeURIComponent(token)')
	})
})

import { describe, expect, it } from 'vitest'
import { extractHandoffToken, looksLikeReferenceCode } from './handoff-token-input'

describe('extractHandoffToken', () => {
	it('returns token query param from a full handoff URL', () => {
		const token = 'abc-def_ghi'
		const url = `https://org.primerpaso.org/handoff?token=${encodeURIComponent(token)}`
		expect(extractHandoffToken(url)).toBe(token)
	})

	it('returns raw string when input is not a URL', () => {
		const raw = 'xYz123-_'
		expect(extractHandoffToken(raw)).toBe(raw)
	})

	it('returns empty for whitespace-only', () => {
		expect(extractHandoffToken('   ')).toBe('')
	})

	it('returns empty when URL has no token param', () => {
		expect(extractHandoffToken('https://org.primerpaso.org/handoff')).toBe('')
	})

	it('does not read ref or reference query params', () => {
		const url = 'https://org.primerpaso.org/handoff?ref=ABCD-1234-EF&referenceCode=ABCD-1234-EF'
		expect(extractHandoffToken(url)).toBe('')
	})
})

describe('looksLikeReferenceCode', () => {
	it('matches support-style reference codes', () => {
		expect(looksLikeReferenceCode('ABCD-1234-EF')).toBe(true)
		expect(looksLikeReferenceCode('abcd 1234 ef')).toBe(true)
	})

	it('does not match typical opaque handoff tokens', () => {
		expect(
			looksLikeReferenceCode(
				'8K3nF9pQx2mL5vR1tY7wZ4bC6dE0gH2jJ4kM8nPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVw'
			)
		).toBe(false)
	})
})

import { describe, expect, it } from 'vitest'

import { getSafeReturnTo, resolveReturnTo } from './journey'

describe('journey return navigation', () => {
	it('does not prefill returnTo without an explicit query parameter', () => {
		const url = new URL('https://example.com/es/previous-residence-countries')

		expect(getSafeReturnTo(url, '/es/evidence-before-cutoff')).toBeUndefined()
	})

	it('preserves an explicit check-answers returnTo', () => {
		const url = new URL(
			'https://example.com/es/previous-residence-countries?returnTo=%2Fes%2Fcheck-answers'
		)

		expect(getSafeReturnTo(url, '/es/evidence-before-cutoff')).toBe('/es/check-answers')
	})

	it('uses the computed next step when no returnTo was submitted', () => {
		expect(resolveReturnTo(null, '/es/criminal-record-certificates')).toBe(
			'/es/criminal-record-certificates'
		)
	})

	it('honours a submitted check-answers returnTo', () => {
		expect(resolveReturnTo('/es/check-answers', '/es/criminal-record-certificates')).toBe(
			'/es/check-answers'
		)
	})
})

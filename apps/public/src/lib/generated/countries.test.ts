import { describe, expect, it } from 'vitest'

import {
	getCountries,
	getCountryName,
	isValidPreviousResidenceCountryCode
} from '$lib/generated/countries'

describe('countries', () => {
	it('returns ISO alpha-2 country options', () => {
		const countries = getCountries('en')
		expect(countries.length).toBeGreaterThan(100)
		expect(countries).toContainEqual(
			expect.objectContaining({
				code: 'CO',
				name: expect.any(String)
			})
		)
	})

	it('includes Spain in country options and previous residence validation', () => {
		expect(getCountries('en')).toContainEqual(
			expect.objectContaining({
				code: 'ES',
				name: expect.any(String)
			})
		)

		expect(isValidPreviousResidenceCountryCode('ES')).toBe(true)
	})

	it('validates real ISO alpha-2 codes', () => {
		expect(isValidPreviousResidenceCountryCode('CO')).toBe(true)
		expect(isValidPreviousResidenceCountryCode('MA')).toBe(true)
		expect(isValidPreviousResidenceCountryCode('XX')).toBe(false)
	})

	it('returns country names with fallback to code', () => {
		expect(getCountryName('CO', 'en')).toBeTruthy()
		expect(getCountryName('XX', 'en')).toBe('XX')
	})
})

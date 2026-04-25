import { describe, expect, it } from 'vitest'
import { APP_URL } from '$lib'
import { SUPPORTED_LOCALES } from '$lib/content'
import { getAllOrganisations } from '$lib/organisations/repository'
import { getSitemapEntries, renderSitemapXml } from './sitemap'

describe('getSitemapEntries', () => {
	it('includes the canonical public routes for every supported locale', () => {
		const entries = getSitemapEntries()

		for (const locale of SUPPORTED_LOCALES) {
			expect(entries.some((entry) => entry.url === `${APP_URL}/${locale}`)).toBe(true)
			expect(entries.some((entry) => entry.url === `${APP_URL}/${locale}/screener`)).toBe(true)
			expect(entries.some((entry) => entry.url === `${APP_URL}/${locale}/organisations`)).toBe(true)
		}
	})

	it('includes organisation detail pages for every supported locale', () => {
		const entries = getSitemapEntries()
		const organisationCount = getAllOrganisations().length

		const organisationEntries = entries.filter((entry) => entry.url.includes('/organisations/'))
		expect(organisationEntries).toHaveLength(organisationCount * SUPPORTED_LOCALES.length)
	})

	it('does not include non-indexable journey routes', () => {
		const entries = getSitemapEntries()

		expect(entries.some((entry) => entry.url.includes('/check-answers'))).toBe(false)
		expect(entries.some((entry) => entry.url.includes('/result'))).toBe(false)
		expect(entries.some((entry) => entry.url.includes('/handover'))).toBe(false)
		expect(entries.some((entry) => entry.url.includes('/language'))).toBe(false)
	})
})

describe('renderSitemapXml', () => {
	it('renders multilingual alternate links including x-default', () => {
		const xml = renderSitemapXml(getSitemapEntries().slice(0, 1))

		expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
		expect(xml).toContain('rel="alternate" hreflang="es"')
		expect(xml).toContain('rel="alternate" hreflang="en"')
		expect(xml).toContain('rel="alternate" hreflang="ar"')
		expect(xml).toContain('rel="alternate" hreflang="fr"')
		expect(xml).toContain('rel="alternate" hreflang="x-default"')
	})
})

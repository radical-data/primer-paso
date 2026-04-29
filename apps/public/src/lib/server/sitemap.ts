import { APP_URL } from '$lib'
import { DEFAULT_LOCALE, type Locale, SUPPORTED_LOCALES } from '$lib/content'
import { getAlternateLocaleHrefs, getDefaultLocaleHref } from '$lib/i18n/routing'
import { getAllOrganisations } from '$lib/organisations/repository'

interface SitemapAlternate {
	locale: string
	url: string
}

export interface SitemapEntry {
	url: string
	alternates: SitemapAlternate[]
}

const XML_ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;'
}

const escapeXml = (value: string) => value.replace(/[&<>"']/g, (char) => XML_ESCAPES[char])

const toAbsoluteUrl = (href: string) => new URL(href, APP_URL).toString()

const buildAlternates = (href: string): SitemapAlternate[] => {
	const alternates = getAlternateLocaleHrefs(href).map(({ locale, href: localisedHref }) => ({
		locale,
		url: toAbsoluteUrl(localisedHref)
	}))

	const defaultHref = getDefaultLocaleHref(href)
	const hasDefaultLocale = alternates.some((alternate) => alternate.locale === DEFAULT_LOCALE)

	return [
		...alternates,
		...(hasDefaultLocale ? [{ locale: 'x-default', url: toAbsoluteUrl(defaultHref) }] : [])
	]
}

const buildLocaleEntry = (locale: Locale, href: string): SitemapEntry => ({
	url: toAbsoluteUrl(`/${locale}${href === '/' ? '' : href}`),
	alternates: buildAlternates(href)
})

export const getSitemapEntries = (): SitemapEntry[] => {
	const publicPaths = ['/', '/screener', '/organisations'] as const
	const organisationPaths = getAllOrganisations().map(
		(organisation) => `/organisations/${organisation.slug}`
	)

	const paths = [...publicPaths, ...organisationPaths]

	return SUPPORTED_LOCALES.flatMap((locale) => paths.map((href) => buildLocaleEntry(locale, href)))
}

export const renderSitemapXml = (entries: SitemapEntry[]) => {
	const body = entries
		.map(
			(entry) => `  <url>
    <loc>${escapeXml(entry.url)}</loc>
${entry.alternates
	.map(
		(alternate) =>
			`    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.locale)}" href="${escapeXml(alternate.url)}" />`
	)
	.join('\n')}
  </url>`
		)
		.join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${body}
</urlset>
`
}

import { DEFAULT_LOCALE, isLocale, type Locale, SUPPORTED_LOCALES } from '$lib/content'

const ABSOLUTE_URL_RE = /^[a-z]+:/i

const splitHref = (href: string) => {
	const [beforeHash, hash = ''] = href.split('#')
	const [pathname, search = ''] = beforeHash.split('?')
	return {
		pathname: pathname || '/',
		search: search ? `?${search}` : '',
		hash: hash ? `#${hash}` : ''
	}
}

export const getLocaleFromPathname = (pathname: string): Locale | null => {
	const segment = pathname.split('/').filter(Boolean)[0] ?? null
	return isLocale(segment) ? segment : null
}

export const stripLocaleFromPathname = (pathname: string) => {
	const segments = pathname.split('/').filter(Boolean)
	if (segments.length > 0 && isLocale(segments[0])) {
		const next = `/${segments.slice(1).join('/')}`
		return next === '/' ? '/' : next.replace(/\/+$/, '')
	}

	const normalised = pathname.startsWith('/') ? pathname : `/${pathname}`
	return normalised === '' ? '/' : normalised
}

export const localiseHref = (locale: Locale, href: string) => {
	if (!href || ABSOLUTE_URL_RE.test(href) || href.startsWith('//')) {
		return href
	}

	const { pathname, search, hash } = splitHref(href)
	const strippedPathname = stripLocaleFromPathname(pathname)
	const base = strippedPathname === '/' ? '' : strippedPathname

	return `/${locale}${base}${search}${hash}`
}

export const replaceLocaleInHref = (href: string, locale: Locale) => localiseHref(locale, href)

export const getPathnameWithSearch = (url: URL) => `${url.pathname}${url.search}`

export const getAlternateLocaleHrefs = (href: string) =>
	SUPPORTED_LOCALES.map((locale) => ({
		locale,
		href: localiseHref(locale, href)
	}))

export const getDefaultLocaleHref = (href: string) => localiseHref(DEFAULT_LOCALE, href)

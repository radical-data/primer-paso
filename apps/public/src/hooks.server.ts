import type { Handle } from '@sveltejs/kit'

import { getTextDirection, resolveLocale } from '$lib/content'
import { getLocaleFromPathname, localiseHref } from '$lib/i18n/routing'
import { getJourneyState } from '$lib/server/journey'

const PUBLIC_FILE_RE = /\/[^/]+\.[a-z0-9]+$/i
const BYPASS_PREFIXES = ['/_app', '/.well-known']

const shouldBypassLocaleRedirect = (pathname: string) =>
	PUBLIC_FILE_RE.test(pathname) || BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))

export const handle: Handle = async ({ event, resolve }) => {
	const state = getJourneyState(event.cookies)
	const pathnameLocale = getLocaleFromPathname(event.url.pathname)
	const cookieLocale = resolveLocale(state.answers.language)

	if (
		!pathnameLocale &&
		(event.request.method === 'GET' || event.request.method === 'HEAD') &&
		!shouldBypassLocaleRedirect(event.url.pathname)
	) {
		const target = localiseHref(cookieLocale, `${event.url.pathname}${event.url.search}`)

		return new Response(null, {
			status: 308,
			headers: {
				location: target
			}
		})
	}

	const locale = pathnameLocale ?? cookieLocale
	const dir = getTextDirection(locale)

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html.replace('<html lang="es" dir="ltr">', `<html lang="${locale}" dir="${dir}">`)
	})
}

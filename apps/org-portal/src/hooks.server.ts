import type { Handle } from '@sveltejs/kit'
import { getSessionFromCookies } from '$lib/server/auth'

const SENSITIVE_PATH_PREFIXES = ['/dashboard', '/handoff', '/reviews', '/admin']

const isSensitivePath = (pathname: string) =>
	SENSITIVE_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = await getSessionFromCookies(event.cookies)

	const response = await resolve(event)

	if (isSensitivePath(event.url.pathname)) {
		response.headers.set('cache-control', 'no-store')
		response.headers.set('x-robots-tag', 'noindex, nofollow, noarchive')
		response.headers.set('referrer-policy', 'no-referrer')
		response.headers.set('x-content-type-options', 'nosniff')
	}

	return response
}

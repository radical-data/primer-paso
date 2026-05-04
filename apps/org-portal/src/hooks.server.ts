import type { Handle } from '@sveltejs/kit'
import { resolveSupabaseAuthSession } from '$lib/server/auth'
import { createSupabaseServerClient } from '$lib/server/supabase'

const SENSITIVE_PATH_PREFIXES = ['/dashboard', '/handoff', '/reviews', '/admin']

const isSensitivePath = (pathname: string) =>
	SENSITIVE_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createSupabaseServerClient(event)
	event.locals.supabaseUser = null
	event.locals.session = null

	const authResult = await resolveSupabaseAuthSession(event.locals.supabase)
	event.locals.supabaseUser = authResult.user
	event.locals.session = authResult.session

	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version'
		}
	})

	if (isSensitivePath(event.url.pathname)) {
		response.headers.set('cache-control', 'no-store')
		response.headers.set('x-robots-tag', 'noindex, nofollow, noarchive')
		response.headers.set('referrer-policy', 'same-origin')
		response.headers.set('x-content-type-options', 'nosniff')
	}

	return response
}

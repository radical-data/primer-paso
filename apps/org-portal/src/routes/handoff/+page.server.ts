import { redirect } from '@sveltejs/kit'
import { requirePermission, setPendingHandoffToken } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

const extractToken = (value: string) => {
	const trimmed = value.trim()
	if (!trimmed) return ''

	try {
		const url = new URL(trimmed)
		return url.searchParams.get('token')?.trim() ?? ''
	} catch {
		return trimmed
	}
}

export const load: PageServerLoad = ({ cookies, locals, url }) => {
	const token = extractToken(url.searchParams.get('token') ?? '')

	if (!token) {
		return {
			hasToken: false,
			signedIn: Boolean(locals.session)
		}
	}

	if (!locals.session) {
		setPendingHandoffToken(cookies, token)
		redirect(303, '/login?next=/handoff')
	}

	requirePermission(locals, 'handoff:open')

	redirect(303, `/handoff/${encodeURIComponent(token)}`)
}

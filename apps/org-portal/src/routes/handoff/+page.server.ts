import { redirect } from '@sveltejs/kit'
import { requirePermission, setPendingHandoffToken } from '$lib/server/auth'
import { extractHandoffToken, looksLikeReferenceCode } from '$lib/server/handoff-token-input'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, locals, url }) => {
	const rawTokenParam = url.searchParams.get('token')
	const hasTokenParam = url.searchParams.has('token')
	const token = extractHandoffToken(rawTokenParam ?? '')

	if (!token) {
		return {
			hasToken: false,
			signedIn: Boolean(locals.session),
			error: hasTokenParam ? 'missing_token' : undefined
		}
	}

	if (looksLikeReferenceCode(token)) {
		return {
			hasToken: false,
			signedIn: Boolean(locals.session),
			error: 'reference_code_not_supported'
		}
	}

	if (!locals.session) {
		setPendingHandoffToken(cookies, token)
		redirect(303, '/login?next=/handoff')
	}

	requirePermission(locals, 'handoff:open')

	redirect(303, `/handoff/${encodeURIComponent(token)}`)
}

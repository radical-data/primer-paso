import { error, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import {
	clearPendingHandoffToken,
	getPendingHandoffToken,
	normaliseEmail,
	resolveSupabaseAuthSession
} from '$lib/server/auth'
import type { RequestHandler } from './$types'

const safeNextPath = (value: string | null) => {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return '/dashboard'
	}
	if (value === '/login' || value.startsWith('/auth/')) {
		return '/dashboard'
	}
	return value
}

export const GET: RequestHandler = async ({ cookies, locals, request, url }) => {
	const code = url.searchParams.get('code')
	const next = safeNextPath(url.searchParams.get('next'))

	if (!code) {
		error(400, 'Missing authentication code.')
	}

	const { error: exchangeError } = await locals.supabase.auth.exchangeCodeForSession(code)
	if (exchangeError) {
		await writeAuditEvent({
			eventType: 'auth.magic_link_exchange_failed',
			eventData: {
				reason: exchangeError.message
			},
			request
		})
		error(401, 'This sign-in link could not be used.')
	}

	const { user, session } = await resolveSupabaseAuthSession(locals.supabase)
	locals.supabaseUser = user
	locals.session = session

	if (!user || !session) {
		const email = normaliseEmail(user?.email ?? '')
		const supabaseUserId = user?.id
		await locals.supabase.auth.signOut()
		await writeAuditEvent({
			eventType: 'auth.login_denied',
			eventData: {
				email,
				supabaseUserId,
				reason: 'no_active_organisation_member'
			},
			request
		})
		error(403, 'Your email is not linked to an active organisation member.')
	}

	await writeAuditEvent({
		eventType: 'auth.login_succeeded',
		eventData: {
			email: session.email,
			supabaseUserId: user.id
		},
		organisationId: session.organisationId,
		memberId: session.memberId,
		request
	})

	const pendingHandoffToken = getPendingHandoffToken(cookies)
	if (pendingHandoffToken) {
		clearPendingHandoffToken(cookies)
		redirect(303, `/handoff/${encodeURIComponent(pendingHandoffToken)}`)
	}

	redirect(303, next)
}

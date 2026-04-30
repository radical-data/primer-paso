import { fail, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import {
	assertProductionAuthConfiguration,
	assertSupabaseAuthConfigured,
	checkMagicLinkRateLimit,
	GENERIC_MAGIC_LINK_RESPONSE,
	getAuthConfirmUrl,
	getPendingHandoffToken,
	normaliseEmail
} from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { Actions, PageServerLoad } from './$types'

const safeNextPath = (value: string | null) => {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return '/dashboard'
	}
	if (value === '/login' || value.startsWith('/auth/')) {
		return '/dashboard'
	}
	return value
}

export const load: PageServerLoad = ({ locals, cookies, url }) => {
	assertSupabaseAuthConfigured()
	assertProductionAuthConfiguration()
	const pendingHandoffToken = getPendingHandoffToken(cookies)
	if (locals.session) {
		if (pendingHandoffToken) {
			redirect(303, `/handoff/${encodeURIComponent(pendingHandoffToken)}`)
		}
		redirect(303, safeNextPath(url.searchParams.get('next')))
	}
	return {
		hasPendingHandoff: Boolean(pendingHandoffToken),
		email: normaliseEmail(url.searchParams.get('email') ?? ''),
		next: safeNextPath(url.searchParams.get('next'))
	}
}

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		assertSupabaseAuthConfigured()
		assertProductionAuthConfiguration()
		const formData = await request.formData()
		const email = normaliseEmail(String(formData.get('email') ?? ''))
		const next = safeNextPath(String(formData.get('next') ?? url.searchParams.get('next') ?? ''))

		if (!email || !email.includes('@')) {
			return fail(400, {
				error: 'Enter your organisation email address.',
				email
			})
		}

		const rateLimit = await checkMagicLinkRateLimit({ email, request })
		if (!rateLimit.allowed) {
			await writeAuditEvent({
				eventType: 'auth.magic_link_rate_limited',
				eventData: {
					email,
					blockedUntil: rateLimit.blockedUntil
				},
				request
			})

			return {
				success: true,
				message: GENERIC_MAGIC_LINK_RESPONSE,
				email,
				next
			}
		}

		const repository = getOrgPortalRepository()
		if (!repository) {
			return fail(503, {
				error: 'Organisation portal storage is not configured.',
				email
			})
		}

		const member = await repository.findActiveOrganisationMemberByEmail(email)
		if (!member) {
			await writeAuditEvent({
				eventType: 'auth.magic_link_denied',
				eventData: { email, reason: 'no_active_organisation_member' },
				request
			})

			return {
				success: true,
				message: GENERIC_MAGIC_LINK_RESPONSE,
				email,
				next
			}
		}

		const redirectTo = getAuthConfirmUrl()

		// Supabase Auth users are provisioned lazily, but only after the email has
		// matched an active organisation member in our database. Portal access is
		// still resolved on every request through organisation_members.
		const { error: signInError } = await locals.supabase.auth.signInWithOtp({
			email,
			options: {
				shouldCreateUser: true,
				emailRedirectTo: redirectTo
			}
		})

		if (signInError) {
			await writeAuditEvent({
				eventType: 'auth.magic_link_send_failed',
				eventData: { email, reason: signInError.message },
				organisationId: member.organisationId,
				memberId: member.id,
				request
			})
			return fail(400, {
				error: 'We could not send a sign-in email. Please try again.',
				email
			})
		}

		await writeAuditEvent({
			eventType: 'auth.magic_link_sent',
			eventData: { email },
			organisationId: member.organisationId,
			memberId: member.id,
			request
		})

		return {
			success: true,
			message: GENERIC_MAGIC_LINK_RESPONSE,
			email,
			next
		}
	}
}

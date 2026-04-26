import { fail, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import {
	authenticateMemberWithBootstrapCode,
	clearPendingHandoffToken,
	getPendingHandoffToken,
	normaliseEmail,
	setOrgSessionCookie
} from '$lib/server/auth'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals, cookies }) => {
	const pendingHandoffToken = getPendingHandoffToken(cookies)

	if (locals.session) {
		if (pendingHandoffToken) {
			redirect(303, `/handoff/${encodeURIComponent(pendingHandoffToken)}`)
		}

		redirect(303, '/dashboard')
	}

	return {
		hasPendingHandoff: Boolean(pendingHandoffToken)
	}
}

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData()
		const email = normaliseEmail(String(formData.get('email') ?? ''))
		const code = String(formData.get('code') ?? '')

		if (!email || !code) {
			return fail(400, {
				error: 'Enter your organisation email and access code.',
				email
			})
		}

		const created = await authenticateMemberWithBootstrapCode({ email, code })

		if (!created) {
			await writeAuditEvent({
				eventType: 'auth.login_failed',
				eventData: { email },
				request
			})

			return fail(401, {
				error: 'These sign-in details were not recognised.',
				email
			})
		}

		setOrgSessionCookie(cookies, created.token)

		await writeAuditEvent({
			eventType: 'auth.login_succeeded',
			organisationId: created.member.organisationId,
			memberId: created.member.id,
			request
		})

		const pendingHandoffToken = getPendingHandoffToken(cookies)
		if (pendingHandoffToken) {
			clearPendingHandoffToken(cookies)
			redirect(303, `/handoff/${encodeURIComponent(pendingHandoffToken)}`)
		}

		redirect(303, '/dashboard')
	}
}

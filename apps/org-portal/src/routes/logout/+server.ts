import { redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { clearOrgSessionCookie, ORG_SESSION_COOKIE } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, locals, request }) => {
	const token = cookies.get(ORG_SESSION_COOKIE)
	const repository = getOrgPortalRepository()

	if (token && repository) {
		await repository.revokeOrganisationSessionByToken(token)
	}

	if (locals.session) {
		await writeAuditEvent({
			eventType: 'auth.logout',
			organisationId: locals.session.organisationId,
			memberId: locals.session.memberId,
			request
		})
	}

	clearOrgSessionCookie(cookies)
	redirect(303, '/login')
}

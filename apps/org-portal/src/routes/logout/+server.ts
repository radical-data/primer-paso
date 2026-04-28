import { redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ locals, request }) => {
	if (locals.session) {
		await writeAuditEvent({
			eventType: 'auth.logout',
			organisationId: locals.session.organisationId,
			memberId: locals.session.memberId,
			request
		})
	}
	await locals.supabase.auth.signOut()
	redirect(303, '/login')
}

import { error } from '@sveltejs/kit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const session = requirePermission(locals, 'audit:read')
	const repository = getOrgPortalRepository()

	if (!repository) {
		error(503, 'Organisation portal storage is not configured.')
	}

	const [organisation, events] = await Promise.all([
		repository.findOrganisationById(session.organisationId),
		repository.listOrganisationAuditEvents(session.organisationId, 150)
	])

	if (!organisation) {
		error(404, 'Organisation not found.')
	}

	return { organisation, events }
}

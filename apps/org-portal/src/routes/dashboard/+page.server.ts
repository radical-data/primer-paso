import { requireSession } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals, url }) => {
	const session = requireSession(locals)

	return {
		session,
		permissionError: url.searchParams.get('error') === 'permission',
		adminLinks: {
			canManageOrganisation: session.permissions.includes('organisation:manage_profile'),
			canManageMembers: session.permissions.includes('organisation:manage_members'),
			canReadAudit: session.permissions.includes('audit:read')
		}
	}
}

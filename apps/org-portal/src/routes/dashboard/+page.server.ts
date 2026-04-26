import { requireSession } from '$lib/server/auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals, url }) => {
	const session = requireSession(locals)

	return {
		session,
		permissionError: url.searchParams.get('error') === 'permission'
	}
}

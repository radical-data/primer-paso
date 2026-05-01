import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = ({ locals }) => {
	const session = locals.session
	return {
		session: session
			? {
					email: session.email,
					role: session.role,
					permissions: session.permissions
				}
			: null
	}
}

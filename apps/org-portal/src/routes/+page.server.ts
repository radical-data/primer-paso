import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals }) => {
	if (locals.session) {
		redirect(303, '/dashboard')
	}
}

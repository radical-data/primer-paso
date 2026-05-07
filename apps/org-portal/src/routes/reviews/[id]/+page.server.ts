import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ params }) => {
	throw redirect(308, `/certificates/review/${params.id}`)
}

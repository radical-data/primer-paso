import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ params }) => {
	throw redirect(308, `/certificates/review/${params.id}/certificate.pdf`)
}

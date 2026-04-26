import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ url }) => {
	const token = url.searchParams.get('token') ?? ''

	return {
		hasToken: token.length > 0,
		// Do not expose the token back to the client page. This placeholder only
		// confirms that the QR/link destination exists.
		tokenReceived: token.length > 0
	}
}

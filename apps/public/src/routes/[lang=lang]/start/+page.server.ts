import { clearJourneyState, getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, params, url }) => {
	if (url.searchParams.get('new') === '1') {
		clearJourneyState(cookies)
	}

	return { locale: params.lang, hasSession: Boolean(getJourneyState(cookies).sessionId) }
}

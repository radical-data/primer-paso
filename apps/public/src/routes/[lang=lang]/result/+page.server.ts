import { localiseHref } from '$lib/i18n/routing'
import { OFFICIAL_PORTAL_URL } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import { runTriage } from '$lib/triage/engine'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	const result = runTriage(state.answers)

	return {
		result,
		locale: params.lang,
		province: state.answers.province,
		sessionId: state.sessionId,
		officialPortalUrl: OFFICIAL_PORTAL_URL,
		organisationsHref: localiseHref(params.lang, '/organisations'),
		handoverHref: localiseHref(params.lang, '/handover'),
		handoverJsonHref: localiseHref(params.lang, '/handover.json')
	}
}

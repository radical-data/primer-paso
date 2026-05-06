import { redirect } from '@sveltejs/kit'
import { localiseHref } from '$lib/i18n/routing'
import { OFFICIAL_PORTAL_URL } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import { runTriage } from '$lib/triage/engine'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)
	// `language` is set on every visit by the layout; any other answer means the
	// visitor has actually started the screener. If they haven't, the result page
	// has nothing meaningful to show — send them home.
	const hasStartedScreener = Object.keys(state.answers).some((key) => key !== 'language')

	if (!hasStartedScreener) {
		redirect(303, localiseHref(params.lang, '/'))
	}

	const result = runTriage(state.answers)

	return {
		result,
		locale: params.lang,
		province: state.answers.province,
		sessionId: state.sessionId,
		officialPortalUrl: OFFICIAL_PORTAL_URL,
		organisationsHref: localiseHref(params.lang, '/organisations'),
		certificateHref: localiseHref(params.lang, '/certificate'),
		handoverHref: localiseHref(params.lang, '/handover'),
		handoverJsonHref: localiseHref(params.lang, '/handover.json')
	}
}

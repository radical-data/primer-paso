import { redirect } from '@sveltejs/kit'
import { resolveLocale } from '$lib/content'
import { COLLABORATORS_PDF_URL, OFFICIAL_PORTAL_URL } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import { runTriage } from '$lib/triage/engine'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)

	if (!state.answers.province) {
		redirect(303, '/province')
	}

	const result = runTriage(state.answers)

	return {
		result,
		locale: resolveLocale(state.answers.language),
		province: state.answers.province,
		sessionId: state.sessionId,
		officialPortalUrl: OFFICIAL_PORTAL_URL,
		collaboratorsPdfUrl: COLLABORATORS_PDF_URL,
		handoverHref: '/handover',
		handoverJsonHref: '/handover.json'
	}
}

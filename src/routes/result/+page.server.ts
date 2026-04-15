import { redirect } from '@sveltejs/kit'
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
		province: state.answers.province,
		sessionId: state.sessionId
	}
}

import { redirect } from '@sveltejs/kit'
import { resolveLocale } from '$lib/content'
import { buildHandoverPacket } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ cookies }) => {
	const state = getJourneyState(cookies)
	if (!state.answers.province) {
		redirect(303, '/province')
	}

	const locale = resolveLocale(state.answers.language)
	const packet = buildHandoverPacket(state, locale)

	return new Response(JSON.stringify(packet, null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'content-disposition': `attachment; filename="primer-paso-handover-${state.sessionId}.json"`
		}
	})
}

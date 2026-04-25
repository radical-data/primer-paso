import { buildHandoverPacket } from '$lib/server/handover'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	const locale = params.lang
	const packet = buildHandoverPacket(state, locale)

	return new Response(JSON.stringify(packet, null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'content-disposition': `attachment; filename="primer-paso-handover-${state.sessionId}.json"`,
			'x-robots-tag': 'noindex, nofollow, noarchive'
		}
	})
}

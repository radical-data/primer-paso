import { buildHandoverPacket } from '$lib/server/handover'
import { buildHandoverPdf } from '$lib/server/handover-pdf'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ cookies, params }) => {
	const state = getJourneyState(cookies)
	const locale = params.lang
	const packet = buildHandoverPacket(state, locale)
	const pdfBytes = await buildHandoverPdf(packet, locale)
	const body = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' })

	return new Response(body, {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `attachment; filename="primer-paso-handover-${state.sessionId}.pdf"`,
			'cache-control': 'no-store',
			'content-length': String(body.size),
			'x-robots-tag': 'noindex, nofollow, noarchive'
		}
	})
}

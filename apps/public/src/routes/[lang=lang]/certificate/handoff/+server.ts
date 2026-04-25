import { localiseHref } from '$lib/i18n/routing'
import { isCertificateHandoffEnabled } from '$lib/server/certificate'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	if (!state.certificateDraft?.draft) {
		return new Response(null, {
			status: 303,
			headers: { location: localiseHref(params.lang, '/certificate') }
		})
	}

	if (!state.certificateDraft.consent) {
		return new Response(null, {
			status: 303,
			headers: { location: localiseHref(params.lang, '/certificate/check') }
		})
	}

	if (!isCertificateHandoffEnabled()) {
		return new Response(
			JSON.stringify({
				error: 'certificate_handoff_disabled',
				message:
					'Certificate handoff creation is disabled until database-backed token storage is implemented.'
			}),
			{
				status: 501,
				headers: {
					'content-type': 'application/json; charset=utf-8',
					'cache-control': 'no-store',
					'x-robots-tag': 'noindex, nofollow, noarchive'
				}
			}
		)
	}

	return new Response(
		JSON.stringify({
			error: 'certificate_handoff_not_implemented',
			message:
				'Enablement is present, but token creation must be implemented in the database-backed handoff PR.'
		}),
		{
			status: 501,
			headers: { 'content-type': 'application/json; charset=utf-8' }
		}
	)
}

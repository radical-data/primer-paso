import { localiseHref } from '$lib/i18n/routing'
import { isCertificateHandoffEnabled } from '$lib/server/certificate'
import { createCertificateHandoff } from '$lib/server/certificate-handoff'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ cookies, params }) => {
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
					'Certificate handoff creation is disabled. Set PUBLIC_CERTIFICATE_HANDOFF_ENABLED=true after configuring persistence.'
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

	const handoff = await createCertificateHandoff(
		{
			draft: state.certificateDraft.draft,
			consent: state.certificateDraft.consent
		},
		state.sessionId
	)

	const location = `${localiseHref(params.lang, '/certificate/handoff')}?token=${encodeURIComponent(
		handoff.token
	)}`

	return new Response(null, {
		status: 303,
		headers: { location, 'cache-control': 'no-store' }
	})
}

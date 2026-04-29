import { localiseHref } from '$lib/i18n/routing'
import { getJourneyState } from '$lib/server/journey'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	if (!state.certificateDraft?.draft) {
		return new Response(null, {
			status: 303,
			headers: { location: localiseHref(params.lang, '/certificate') }
		})
	}

	const body = JSON.stringify(state.certificateDraft, null, 2)

	return new Response(body, {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'content-disposition': `attachment; filename="primer-paso-certificate-draft-${state.certificateDraft.draft.draftId}.json"`,
			'cache-control': 'no-store',
			'x-robots-tag': 'noindex, nofollow, noarchive'
		}
	})
}

import { fail, redirect } from '@sveltejs/kit'
import { localiseHref } from '$lib/i18n/routing'
import {
	isCertificateHandoffEnabled,
	parsePublicCertificateConsentForm
} from '$lib/server/certificate'
import { getJourneyState, updateCertificateDraft } from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	if (!state.certificateDraft?.draft) {
		redirect(303, localiseHref(params.lang, '/certificate'))
	}

	return {
		locale: params.lang,
		draft: state.certificateDraft.draft,
		consent: state.certificateDraft.consent,
		editHref: localiseHref(params.lang, '/certificate'),
		jsonHref: localiseHref(params.lang, '/certificate/draft.json'),
		handoffHref: localiseHref(params.lang, '/certificate/handoff'),
		handoffEnabled: isCertificateHandoffEnabled()
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const state = getJourneyState(cookies)

		if (!state.certificateDraft?.draft) {
			redirect(303, localiseHref(params.lang, '/certificate'))
		}

		const consent = parsePublicCertificateConsentForm(await request.formData())
		if (!consent) {
			return fail(400, { error: 'Confirm each consent statement before continuing.' })
		}

		updateCertificateDraft(cookies, { draft: state.certificateDraft.draft, consent })
		redirect(303, localiseHref(params.lang, '/certificate/check'))
	}
}

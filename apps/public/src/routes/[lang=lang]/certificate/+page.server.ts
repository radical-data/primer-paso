import { fail, redirect } from '@sveltejs/kit'
import { getApplicantVulnerabilityReasonOptions } from '$lib/certificate/vulnerability-reasons'
import { resolveLocale } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'
import {
	certificateDraftToFormValue,
	parsePublicCertificateDraftForm
} from '$lib/server/certificate'
import { getJourneyState, updateCertificateDraft } from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const documentTypeOptions = [
	{ value: 'passport', label: 'Passport' },
	{ value: 'national_id', label: 'National identity card' },
	{ value: 'travel_document', label: 'Travel document' },
	{ value: 'other', label: 'Other identity document' }
]

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	return {
		locale: params.lang,
		value: certificateDraftToFormValue(state),
		documentTypeOptions,
		vulnerabilityReasonOptions: getApplicantVulnerabilityReasonOptions(resolveLocale(params.lang)),
		backHref: localiseHref(params.lang, '/result')
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const state = getJourneyState(cookies)
		const formData = await request.formData()
		const parsed = parsePublicCertificateDraftForm(formData, state)

		if (!parsed.ok || !parsed.draft) {
			return fail(400, { value: parsed.value, issues: parsed.issues })
		}

		updateCertificateDraft(cookies, { draft: parsed.draft })
		redirect(303, localiseHref(params.lang, '/certificate/check'))
	}
}

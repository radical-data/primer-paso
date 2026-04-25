import { fail, redirect } from '@sveltejs/kit'
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

const vulnerabilityReasonOptions = [
	{
		value: 'social_isolation_or_lack_of_support_network',
		label: 'Social isolation or lack of support network'
	},
	{
		value: 'homelessness_or_precarious_housing',
		label: 'Homelessness or precarious housing'
	},
	{
		value: 'discrimination_or_social_exclusion',
		label: 'Discrimination or social exclusion'
	},
	{ value: 'insufficient_income', label: 'Insufficient income' },
	{
		value: 'poverty_or_economic_exclusion_risk',
		label: 'Poverty or risk of economic exclusion'
	},
	{
		value: 'difficulty_accessing_employment',
		label: 'Difficulty accessing employment'
	},
	{ value: 'dependants', label: 'Children or dependants in their care' },
	{
		value: 'vulnerable_family_unit',
		label: 'Family unit in a situation of vulnerability'
	},
	{
		value: 'single_parent_precarity',
		label: 'Single-parent family in precarious circumstances'
	},
	{ value: 'psychosocial_risks', label: 'Psychosocial risks' },
	{ value: 'exploitation_or_abuse', label: 'Exposure to exploitation or abuse' }
] satisfies Array<{ value: string; label: string }>

export const load: PageServerLoad = ({ cookies, params }) => {
	const state = getJourneyState(cookies)

	return {
		locale: params.lang,
		value: certificateDraftToFormValue(state),
		documentTypeOptions,
		vulnerabilityReasonOptions,
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

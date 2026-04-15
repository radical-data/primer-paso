import { redirect } from '@sveltejs/kit'
import { renderReference, t } from '$lib/content'
import { journeySteps } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import { getJourneyState } from '$lib/server/journey'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = ({ cookies }) => {
	const state = getJourneyState(cookies)
	if (!state.answers.province) {
		redirect(303, '/province')
	}

	const answers = journeySteps
		.filter(
			(step) => step.includeInCheckAnswers !== false && (!step.guard || step.guard(state.answers))
		)
		.map((step) => ({
			label: step.checkAnswersLabelKey ? t(step.checkAnswersLabelKey) : '',
			value: fieldAdapters[step.adapter]
				.format(state.answers, step)
				.map(renderReference)
				.join(', '),
			changeHref: `/${step.slug}?returnTo=/check-answers`
		}))

	return { answers }
}

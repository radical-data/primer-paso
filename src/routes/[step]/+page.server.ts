import { error, fail, redirect } from '@sveltejs/kit'
import { t } from '$lib/content'
import type { ChoiceStepDefinition } from '$lib/journey/config'
import { getJourneyStep, resolveStepTarget } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import type { LanguageValue } from '$lib/journey/types'
import { LANGUAGE_VALUES } from '$lib/journey/types'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const hasOptions = (step: ReturnType<typeof getJourneyStep>): step is ChoiceStepDefinition =>
	Boolean(step && 'options' in step)

const isLanguageValue = (value: string): value is LanguageValue =>
	LANGUAGE_VALUES.includes(value as LanguageValue)

const getBackHref = (returnTo: string, backHref: string) =>
	returnTo.includes('/check-answers') ? '/check-answers' : backHref

export const load: PageServerLoad = ({ cookies, params, url }) => {
	const step = getJourneyStep(params.step)

	if (!step) {
		error(404, 'Step not found')
	}

	if (step.slug === 'language') {
		const set = url.searchParams.get('set')

		if (
			set &&
			isLanguageValue(set) &&
			hasOptions(step) &&
			step.options.some((option) => option.value === set)
		) {
			updateJourneyAnswers(cookies, { language: set })
			redirect(303, '/start')
		}
	}

	const state = getJourneyState(cookies)

	if (step.guard && !step.guard(state.answers)) {
		redirect(303, resolveStepTarget(step.redirectIfGuardFails ?? step.next, state.answers))
	}

	const returnTo = getSafeReturnTo(url, resolveStepTarget(step.next, state.answers))
	const adapter = fieldAdapters[step.adapter]
	const options: Array<{ value: string; label: string }> =
		'options' in step
			? step.options.map((option) => ({ value: option.value, label: t(option.labelKey) }))
			: []

	return {
		step: {
			slug: step.slug,
			field: step.field,
			adapter: step.adapter,
			eyebrow: step.eyebrowKey ? t(step.eyebrowKey) : undefined,
			title: t(step.titleKey),
			body: step.bodyKey ? t(step.bodyKey) : undefined,
			hint: step.hintKey ? t(step.hintKey) : undefined,
			options
		},
		value: adapter.getFormValue(state.answers, step),
		returnTo,
		backHref: getBackHref(returnTo, resolveStepTarget(step.back, state.answers))
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const step = getJourneyStep(params.step)

		if (!step) {
			error(404, 'Step not found')
		}

		const formData = await request.formData()
		const adapter = fieldAdapters[step.adapter]
		const parsed = adapter.parse(formData, step)

		if (!parsed.ok) {
			return fail(400, {
				error: t(parsed.errorKey),
				value: parsed.formValue
			})
		}

		const nextState = updateJourneyAnswers(cookies, parsed.answersPatch)
		redirect(
			303,
			resolveReturnTo(formData.get('returnTo'), resolveStepTarget(step.next, nextState.answers))
		)
	}
}

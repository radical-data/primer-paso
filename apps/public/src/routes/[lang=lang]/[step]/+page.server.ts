import { error, fail, redirect } from '@sveltejs/kit'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
import { localiseHref, replaceLocaleInHref } from '$lib/i18n/routing'
import type { ChoiceStepDefinition } from '$lib/journey/config'
import { getJourneyStep, resolveStepTarget } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import type { LanguageValue } from '$lib/journey/types'
import {
	getJourneyState,
	getSafeReturnTo,
	resolveReturnTo,
	updateJourneyAnswers
} from '$lib/server/journey'
import type { Actions, PageServerLoad } from './$types'

const hasOptions = (step: ReturnType<typeof getJourneyStep>): step is ChoiceStepDefinition =>
	Boolean(step && 'options' in step)

const getBackHref = (returnTo: string, backHref: string, locale: Locale) =>
	returnTo.includes('/check-answers') ? localiseHref(locale, '/check-answers') : backHref

export const load: PageServerLoad = ({ cookies, params, url }) => {
	const step = getJourneyStep(params.step)

	if (!step) {
		error(404, 'Step not found')
	}

	const locale = params.lang as Locale

	if (step.slug === 'language') {
		const set = url.searchParams.get('set')

		if (set && hasOptions(step) && step.options.some((option) => option.value === set)) {
			updateJourneyAnswers(cookies, { language: set as LanguageValue })
			const fallback = localiseHref(set as Locale, '/screener')
			const returnTo = getSafeReturnTo(url, localiseHref(locale, '/screener'))
			redirect(303, replaceLocaleInHref(returnTo, set as Locale) || fallback)
		}
	}

	const state = getJourneyState(cookies)
	const tt = getTranslator(locale)

	if (step.guard && !step.guard(state.answers)) {
		redirect(
			303,
			localiseHref(locale, resolveStepTarget(step.redirectIfGuardFails ?? step.next, state.answers))
		)
	}

	const returnTo = getSafeReturnTo(
		url,
		localiseHref(locale, resolveStepTarget(step.next, state.answers))
	)
	const adapter = fieldAdapters[step.adapter]
	const options: Array<{ value: string; label: string }> =
		'options' in step
			? step.options.map((option) => ({
					value: option.value,
					label: option.labelKey ? tt(option.labelKey) : option.label
				}))
			: []

	return {
		locale,
		step: {
			slug: step.slug,
			field: step.field,
			adapter: step.adapter,
			eyebrow: step.eyebrowKey ? tt(step.eyebrowKey) : undefined,
			title: tt(step.titleKey),
			body: step.bodyKey ? tt(step.bodyKey) : undefined,
			hint: step.hintKey ? tt(step.hintKey) : undefined,
			options
		},
		value: adapter.getFormValue(state.answers, step),
		returnTo,
		backHref: getBackHref(
			returnTo,
			localiseHref(locale, resolveStepTarget(step.back, state.answers)),
			locale
		)
	}
}

export const actions: Actions = {
	default: async ({ request, cookies, params }) => {
		const step = getJourneyStep(params.step)

		if (!step) {
			error(404, 'Step not found')
		}

		const formData = await request.formData()
		const locale = params.lang as Locale
		const tt = getTranslator(locale)
		const adapter = fieldAdapters[step.adapter]
		const parsed = adapter.parse(formData, step)

		if (!parsed.ok) {
			return fail(400, {
				error: tt(parsed.errorKey),
				value: parsed.formValue
			})
		}

		const nextState = updateJourneyAnswers(cookies, parsed.answersPatch)
		redirect(
			303,
			resolveReturnTo(
				formData.get('returnTo'),
				localiseHref(locale, resolveStepTarget(step.next, nextState.answers))
			)
		)
	}
}

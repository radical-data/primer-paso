import { getTranslator, type Locale, type MessageKey, renderReference } from '$lib/content'
import { journeySteps } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import type { JourneyState } from '$lib/journey/types'
import { runTriage } from '$lib/triage/engine'
import type { RecommendedRoute, ResultState } from '$lib/triage/types'

export const OFFICIAL_PORTAL_URL = 'https://inclusion.gob.es/regularizacion'
export const COLLABORATORS_PDF_URL =
	'https://www.inclusion.gob.es/documents/d/guest/pdf-entidades-colaboradoras-16042026.pdf?download=false'

export interface HandoverPacket {
	version: 1
	sessionId: string
	generatedAt: string
	locale: Locale
	resultState: ResultState
	resultTitle: string
	eligibility: string
	recommendedRoute: RecommendedRoute
	routeBody: string
	officialPortalUrl: string
	collaboratorsPdfUrl: string
	flags: string[]
	checklist: {
		alreadyHave: string[]
		stillNeed: string[]
		discussWithSupport: string[]
		unresolved: string[]
	}
	answers: Array<{ label: string; value: string }>
}

const getRouteBodyKey = (recommendedRoute: RecommendedRoute): MessageKey =>
	recommendedRoute === 'official_portal'
		? 'pages.result.route.official_portal_body'
		: 'pages.result.route.collaborating_organisation_body'

export const buildHandoverPacket = (state: JourneyState, locale: Locale): HandoverPacket => {
	const tt = getTranslator(locale)
	const result = runTriage(state.answers)
	const notAnswered = tt('common.not_answered')

	const answers = journeySteps
		.filter((step) => step.slug !== 'language' && (!step.guard || step.guard(state.answers)))
		.map((step) => ({
			label: step.checkAnswersLabelKey ? tt(step.checkAnswersLabelKey) : tt(step.titleKey),
			value: fieldAdapters[step.adapter]
				.format(state.answers, step)
				.map((reference) => renderReference(reference, locale))
				.join(', ')
		}))
		.filter((entry) => entry.value && entry.value !== notAnswered)

	return {
		version: 1,
		sessionId: state.sessionId,
		generatedAt: new Date().toISOString(),
		locale,
		resultState: result.resultState,
		resultTitle: tt(`result.title.${result.resultState}` as MessageKey),
		eligibility: tt(result.explanationKey),
		recommendedRoute: result.recommendedRoute,
		routeBody: tt(getRouteBodyKey(result.recommendedRoute)),
		officialPortalUrl: OFFICIAL_PORTAL_URL,
		collaboratorsPdfUrl: COLLABORATORS_PDF_URL,
		flags: result.flags.map((flag) => tt(flag)),
		checklist: {
			alreadyHave: result.checklist.alreadyHave.map((key) => tt(key)),
			stillNeed: result.checklist.stillNeed.map((key) => tt(key)),
			discussWithSupport: result.checklist.discussWithSupport.map((key) => tt(key)),
			unresolved: result.checklist.unresolved.map((key) => tt(key))
		},
		answers
	}
}

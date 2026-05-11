import { getTranslator, type Locale, type MessageKey, renderReference } from '$lib/content'
import { journeySteps } from '$lib/journey/config'
import { fieldAdapters } from '$lib/journey/field-adapters'
import type { JourneyState } from '$lib/journey/types'
import { runTriage } from '$lib/triage/engine'
import type {
	EligibilityRoute,
	PositiveEligibilityRoute,
	ResultState,
	SubmissionPath
} from '$lib/triage/types'

type TranslatedChecklist = {
	alreadyHave: string[]
	stillNeed: string[]
	discussWithSupport: string[]
	unresolved: string[]
}

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
	recommendedEligibilityRoute: EligibilityRoute
	possibleEligibilityRoutes: PositiveEligibilityRoute[]
	recommendedSubmissionPath: SubmissionPath
	routeBody: string
	checklist: TranslatedChecklist
	officialPortalUrl: string
	collaboratorsPdfUrl: string
	answers: Array<{ label: string; value: string }>
}

const getRouteBodyKey = (submissionPath: SubmissionPath): MessageKey =>
	`result.submission_path.${submissionPath}` as MessageKey

export const buildHandoverPacket = (state: JourneyState, locale: Locale): HandoverPacket => {
	const tt = getTranslator(locale)
	const result = runTriage(state.answers)
	const notAnswered = tt('common.not_answered')

	const answers = journeySteps
		.filter((step) => !step.guard || step.guard(state.answers))
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
		recommendedEligibilityRoute: result.recommendedEligibilityRoute,
		possibleEligibilityRoutes: result.possibleEligibilityRoutes,
		recommendedSubmissionPath: result.recommendedSubmissionPath,
		routeBody: tt(getRouteBodyKey(result.recommendedSubmissionPath)),
		checklist: {
			alreadyHave: result.checklist.alreadyHave.map((key) => tt(key)),
			stillNeed: result.checklist.stillNeed.map((key) => tt(key)),
			discussWithSupport: result.checklist.discussWithSupport.map((key) => tt(key)),
			unresolved: result.checklist.unresolved.map((key) => tt(key))
		},
		officialPortalUrl: OFFICIAL_PORTAL_URL,
		collaboratorsPdfUrl: COLLABORATORS_PDF_URL,
		answers
	}
}

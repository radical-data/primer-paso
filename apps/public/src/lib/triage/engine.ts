import type { MessageKey } from '$lib/content'
import type { JourneyAnswers } from '$lib/journey/types'
import type {
	EligibilityRoute,
	PositiveEligibilityRoute,
	PreparationChecklist,
	SubmissionPath,
	TriageResult
} from './types'

const hasPositiveChoice = (values: string[] | undefined) =>
	(values ?? []).some((value) => !['none', 'none_yet', 'not_sure'].includes(value))

const buildChecklist = (
	answers: JourneyAnswers,
	resultState: TriageResult['resultState']
): PreparationChecklist => {
	if (resultState === 'not_this_process') {
		return { alreadyHave: [], stillNeed: [], discussWithSupport: [], unresolved: [] }
	}

	const identityDocuments = answers.identityDocuments ?? []
	const evidenceBeforeCutoff = answers.evidenceBeforeCutoff ?? []
	const evidenceRecentMonths = answers.evidenceRecentMonths ?? []
	const supportNeeds = answers.supportNeeds ?? []
	const specialistFlags = answers.specialistFlags ?? []
	const timelineUncertain =
		answers.presentBeforeCutoff === 'not_sure' ||
		answers.presentBeforeCutoff === undefined ||
		answers.asylumHistory === 'not_sure' ||
		(answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'not_sure') ||
		answers.fiveMonthStay === 'not_sure'

	const hasIdentityDocument = identityDocuments.some((value) =>
		[
			'current_passport',
			'expired_passport',
			'national_identity_card',
			'asylum_document',
			'travel_document'
		].includes(value)
	)
	const hasBeforeCutoffEvidence = hasPositiveChoice(evidenceBeforeCutoff)
	const hasRecentEvidence = hasPositiveChoice(evidenceRecentMonths)

	const alreadyHave = new Set<MessageKey>()
	const stillNeed = new Set<MessageKey>()
	const discussWithSupport = new Set<MessageKey>()
	const unresolved = new Set<MessageKey>()

	if (hasIdentityDocument) alreadyHave.add('result.checklist.item.identity_document_available')
	if (answers.asylumCaseDocuments === 'yes')
		alreadyHave.add('result.checklist.item.asylum_case_documents_available')
	if (hasBeforeCutoffEvidence)
		alreadyHave.add('result.checklist.item.before_cutoff_evidence_available')
	if (hasRecentEvidence) alreadyHave.add('result.checklist.item.recent_evidence_available')
	if (answers.fiveMonthStay === 'yes')
		alreadyHave.add('result.checklist.item.continuity_answer_positive')

	if (!hasIdentityDocument || identityDocuments.includes('no_identity_documents_now'))
		stillNeed.add('result.checklist.item.identity_document_needed')
	if (!hasBeforeCutoffEvidence) stillNeed.add('result.checklist.item.before_cutoff_evidence_needed')
	if (!hasRecentEvidence) stillNeed.add('result.checklist.item.recent_evidence_needed')
	if (answers.asylumBeforeCutoff === 'yes' && answers.asylumCaseDocuments !== 'yes')
		stillNeed.add('result.checklist.item.asylum_case_documents_needed')
	stillNeed.add('result.checklist.item.official_document_requirements')

	if (supportNeeds.length > 0)
		discussWithSupport.add('result.checklist.item.practical_support_helpful')
	if (resultState === 'needs_specialist_review')
		discussWithSupport.add('result.checklist.item.complex_case_review')

	if (timelineUncertain) unresolved.add('result.checklist.item.confirm_timeline')
	if (answers.fiveMonthStay === 'left_spain')
		unresolved.add('result.checklist.item.continuity_concern')
	if (specialistFlags.includes('identity_missing_or_mismatch'))
		unresolved.add('result.checklist.item.identity_issue_to_explain')
	if (specialistFlags.includes('asylum_case_not_clear'))
		unresolved.add('result.checklist.item.asylum_history_to_explain')

	return {
		alreadyHave: [...alreadyHave],
		stillNeed: [...stillNeed],
		discussWithSupport: [...discussWithSupport],
		unresolved: [...unresolved]
	}
}

const hasSpecialistFlag = (answers: JourneyAnswers) =>
	(answers.specialistFlags ?? []).some((flag) => flag !== 'none')

const isAsylumRoute = (answers: JourneyAnswers) =>
	answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'yes'

const isFamilyRoute = (answers: JourneyAnswers) => hasPositiveChoice(answers.familySituation)

const isWorkRoute = (answers: JourneyAnswers) => hasPositiveChoice(answers.workSituation)

const isVulnerabilityRoute = (answers: JourneyAnswers) =>
	hasPositiveChoice(answers.vulnerabilitySituation)

export const getPossibleEligibilityRoutes = (
	answers: JourneyAnswers
): PositiveEligibilityRoute[] => {
	if (isAsylumRoute(answers)) {
		return ['international_protection']
	}

	const routes: PositiveEligibilityRoute[] = []

	if (isFamilyRoute(answers)) routes.push('family_unit')
	if (isWorkRoute(answers)) routes.push('work_or_intention')
	if (isVulnerabilityRoute(answers)) routes.push('vulnerability')

	return routes
}

export const getRecommendedEligibilityRoute = (answers: JourneyAnswers): EligibilityRoute => {
	if (answers.presentBeforeCutoff === 'no') {
		return 'not_this_process'
	}

	if (isAsylumRoute(answers)) {
		return 'international_protection'
	}

	if (answers.fiveMonthStay === 'left_spain') {
		return 'needs_specialist_review'
	}

	if (
		answers.presentBeforeCutoff === 'not_sure' ||
		answers.asylumHistory === 'not_sure' ||
		(answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'not_sure') ||
		answers.fiveMonthStay === 'not_sure'
	) {
		return 'needs_specialist_review'
	}

	const possibleRoutes = getPossibleEligibilityRoutes(answers)

	if (possibleRoutes.includes('family_unit')) return 'family_unit'
	if (possibleRoutes.includes('work_or_intention')) return 'work_or_intention'
	if (possibleRoutes.includes('vulnerability')) return 'vulnerability'

	return 'needs_specialist_review'
}

const getRecommendedSubmissionPath = (
	answers: JourneyAnswers,
	recommendedEligibilityRoute: EligibilityRoute
): SubmissionPath => {
	if (
		recommendedEligibilityRoute === 'not_this_process' ||
		recommendedEligibilityRoute === 'needs_specialist_review' ||
		hasSpecialistFlag(answers)
	) {
		return 'specialist_review_first'
	}

	return 'registered_entity_online'
}

const getResultState = (
	recommendedEligibilityRoute: EligibilityRoute
): TriageResult['resultState'] => {
	if (recommendedEligibilityRoute === 'not_this_process') return 'not_this_process'
	if (recommendedEligibilityRoute === 'needs_specialist_review') return 'needs_specialist_review'
	return 'eligible'
}

const getExplanationKey = (route: EligibilityRoute): MessageKey =>
	`result.explanation.${route}` as MessageKey

const getReasonKey = (answers: JourneyAnswers, route: EligibilityRoute): MessageKey | undefined => {
	if (answers.presentBeforeCutoff === 'no') {
		return 'result.reason.not_present_before_cutoff' as MessageKey
	}

	if (answers.fiveMonthStay === 'left_spain') {
		return 'result.reason.five_month_stay_not_met' as MessageKey
	}

	if (route === 'needs_specialist_review') {
		if (hasSpecialistFlag(answers)) {
			return 'result.reason.specialist_flags' as MessageKey
		}

		return 'result.reason.no_clear_route' as MessageKey
	}

	return undefined
}

export const runTriage = (answers: JourneyAnswers): TriageResult => {
	const possibleEligibilityRoutes = getPossibleEligibilityRoutes(answers)
	const recommendedEligibilityRoute = getRecommendedEligibilityRoute(answers)
	const recommendedSubmissionPath = getRecommendedSubmissionPath(
		answers,
		recommendedEligibilityRoute
	)
	const resultState = getResultState(recommendedEligibilityRoute)

	return {
		resultState,
		recommendedEligibilityRoute,
		possibleEligibilityRoutes,
		recommendedSubmissionPath,
		reasonKey: getReasonKey(answers, recommendedEligibilityRoute),
		explanationKey: getExplanationKey(recommendedEligibilityRoute),
		checklist: buildChecklist(answers, resultState)
	}
}

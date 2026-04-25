import type { MessageKey } from '$lib/content'
import type {
	EvidenceBeforeCutoffValue,
	EvidenceRecentValue,
	JourneyAnswers
} from '$lib/journey/types'

import type { PreparationChecklist, TriageResult } from './types'

const hasAnyStrongBeforeCutoffEvidence = (values: EvidenceBeforeCutoffValue[] = []) =>
	values.some((value) =>
		[
			'padron_or_registration',
			'housing_papers',
			'health_or_pharmacy',
			'school_or_childcare',
			'work_papers'
		].includes(value)
	)

const hasAnyStrongRecentEvidence = (values: EvidenceRecentValue[] = []) =>
	values.some((value) =>
		[
			'housing_papers',
			'health_or_pharmacy',
			'school_or_childcare',
			'work_papers',
			'bank_or_money_transfer'
		].includes(value)
	)

const buildChecklist = (
	answers: JourneyAnswers,
	resultState: TriageResult['resultState']
): PreparationChecklist => {
	const alreadyHave = new Set<MessageKey>()
	const stillNeed = new Set<MessageKey>()
	const discussWithSupport = new Set<MessageKey>()
	const unresolved = new Set<MessageKey>()

	if (resultState === 'another_route_may_fit_better') {
		return {
			alreadyHave: [],
			stillNeed: [],
			discussWithSupport: [],
			unresolved: []
		}
	}

	const identityDocuments = answers.identityDocuments ?? []
	const evidenceBeforeCutoff = answers.evidenceBeforeCutoff ?? []
	const evidenceRecentMonths = answers.evidenceRecentMonths ?? []
	const supportNeeds = answers.supportNeeds ?? []
	const specialistFlags = answers.specialistFlags ?? []
	const hasIdentityDocument = identityDocuments.some((value) =>
		[
			'current_passport',
			'expired_passport',
			'national_identity_card',
			'asylum_document',
			'travel_document'
		].includes(value)
	)
	const timelineUncertain =
		answers.presentBeforeCutoff === 'not_sure' ||
		answers.presentBeforeCutoff === undefined ||
		answers.asylumHistory === 'not_sure' ||
		(answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'not_sure') ||
		answers.fiveMonthStay === 'not_sure'

	if (hasIdentityDocument) alreadyHave.add('result.checklist.item.identity_document_available')
	if (answers.asylumCaseDocuments === 'yes')
		alreadyHave.add('result.checklist.item.asylum_case_documents_available')
	if (hasAnyStrongBeforeCutoffEvidence(evidenceBeforeCutoff))
		alreadyHave.add('result.checklist.item.before_cutoff_evidence_available')
	if (hasAnyStrongRecentEvidence(evidenceRecentMonths))
		alreadyHave.add('result.checklist.item.recent_evidence_available')
	if (answers.fiveMonthStay === 'yes') {
		alreadyHave.add('result.checklist.item.continuity_answer_positive')
	}

	if (!hasIdentityDocument || identityDocuments.includes('no_identity_documents_now')) {
		stillNeed.add('result.checklist.item.identity_document_needed')
	}
	if (
		!hasAnyStrongBeforeCutoffEvidence(evidenceBeforeCutoff) ||
		evidenceBeforeCutoff.includes('none_yet')
	) {
		stillNeed.add('result.checklist.item.before_cutoff_evidence_needed')
	}
	if (
		!hasAnyStrongRecentEvidence(evidenceRecentMonths) ||
		evidenceRecentMonths.includes('none_yet')
	) {
		stillNeed.add('result.checklist.item.recent_evidence_needed')
	}
	if (answers.asylumBeforeCutoff === 'yes' && answers.asylumCaseDocuments !== 'yes') {
		stillNeed.add('result.checklist.item.asylum_case_documents_needed')
	}
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

const getChecklist = (
	answers: JourneyAnswers,
	resultState: TriageResult['resultState'],
	_recommendedRoute: TriageResult['recommendedRoute']
) => buildChecklist(answers, resultState)

const getReasonKey = (answers: JourneyAnswers, fallback: MessageKey): MessageKey => {
	const specialistFlags = answers.specialistFlags ?? []
	if (specialistFlags.includes('criminal_record_worry')) {
		return 'result.reason.specialist_review_criminal_record'
	}
	if (specialistFlags.includes('identity_missing_or_mismatch')) {
		return 'result.reason.specialist_review_identity'
	}
	return fallback
}

export const runTriage = (answers: JourneyAnswers): TriageResult => {
	const flags = new Set<MessageKey>()
	const presentBeforeCutoff = answers.presentBeforeCutoff
	const asylumHistory = answers.asylumHistory
	const asylumBeforeCutoff = answers.asylumBeforeCutoff
	const fiveMonthStay = answers.fiveMonthStay
	const asylumCaseDocuments = answers.asylumCaseDocuments
	const identityDocuments = answers.identityDocuments ?? []
	const evidenceBeforeCutoff = answers.evidenceBeforeCutoff ?? []
	const evidenceRecentMonths = answers.evidenceRecentMonths ?? []
	const specialistFlags = answers.specialistFlags ?? []
	const supportNeeds = answers.supportNeeds ?? []

	const hasStrongEvidence =
		hasAnyStrongBeforeCutoffEvidence(evidenceBeforeCutoff) &&
		hasAnyStrongRecentEvidence(evidenceRecentMonths)

	const evidenceStrength =
		evidenceBeforeCutoff.length === 0 || evidenceRecentMonths.length === 0
			? 'unknown'
			: hasStrongEvidence
				? 'strong'
				: 'thin'

	if (
		presentBeforeCutoff === undefined ||
		presentBeforeCutoff === 'not_sure' ||
		asylumHistory === 'not_sure' ||
		(asylumHistory === 'yes' && asylumBeforeCutoff === 'not_sure') ||
		fiveMonthStay === 'not_sure'
	) {
		flags.add('result.flag.uncertain_timeline')
	}

	if (fiveMonthStay === 'left_spain') {
		flags.add('result.flag.five_month_requirement_risk')
	}

	if (presentBeforeCutoff === 'no') {
		const resultState = 'another_route_may_fit_better'
		const recommendedRoute = 'collaborating_organisation'
		return {
			resultState,
			recommendedRoute,
			flags: ['result.flag.hard_gate_after_cutoff'],
			reasonKey: 'result.reason.after_cutoff',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.after_cutoff',
			humanReviewRecommended: false
		}
	}

	if (
		specialistFlags.includes('criminal_record_worry') ||
		specialistFlags.includes('identity_missing_or_mismatch') ||
		specialistFlags.includes('previous_refusal_needs_help') ||
		specialistFlags.includes('asylum_case_not_clear') ||
		specialistFlags.includes('unsafe_sharing_digitally') ||
		specialistFlags.includes('urgent_human_support') ||
		specialistFlags.includes('want_specialist') ||
		identityDocuments.includes('no_identity_documents_now') ||
		fiveMonthStay === 'left_spain' ||
		(asylumBeforeCutoff === 'yes' && asylumCaseDocuments !== 'yes')
	) {
		const resultState = 'needs_specialist_review'
		const recommendedRoute = 'collaborating_organisation'
		return {
			resultState,
			recommendedRoute,
			flags: [
				...flags,
				...(specialistFlags.includes('criminal_record_worry')
					? (['result.flag.criminal_record_concern'] as MessageKey[])
					: []),
				...(specialistFlags.includes('identity_missing_or_mismatch')
					? (['result.flag.identity_issue'] as MessageKey[])
					: []),
				...(supportNeeds.includes('child_or_dependant_support')
					? (['result.flag.family_support_needs'] as MessageKey[])
					: []),
				...(specialistFlags.includes('asylum_case_not_clear')
					? (['result.flag.asylum_complexity'] as MessageKey[])
					: []),
				...(identityDocuments.includes('no_identity_documents_now')
					? (['result.flag.missing_identity_documents'] as MessageKey[])
					: []),
				...(fiveMonthStay === 'left_spain'
					? (['result.flag.continuity_concern'] as MessageKey[])
					: [])
			],
			reasonKey: getReasonKey(answers, 'result.reason.specialist_review'),
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.specialist_review',
			humanReviewRecommended: true
		}
	}

	if (flags.has('result.flag.uncertain_timeline')) {
		const resultState = 'not_enough_information_yet'
		const recommendedRoute = 'collaborating_organisation'
		return {
			resultState,
			recommendedRoute,
			flags: [
				...flags,
				...(supportNeeds.includes('child_or_dependant_support')
					? (['result.flag.family_support_needs'] as MessageKey[])
					: [])
			],
			reasonKey: 'result.reason.not_enough_information',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.not_enough_information',
			humanReviewRecommended: false
		}
	}

	if (
		evidenceStrength === 'thin' ||
		evidenceBeforeCutoff.includes('none_yet') ||
		evidenceRecentMonths.includes('none_yet')
	) {
		const resultState = 'possible_but_needs_more_evidence'
		const recommendedRoute = 'official_portal'
		return {
			resultState,
			recommendedRoute,
			flags: supportNeeds.includes('child_or_dependant_support')
				? ['result.flag.family_support_needs']
				: [],
			reasonKey: 'result.reason.more_evidence',
			evidenceStrength,
			showHowToApply: true,
			showSupportCta: true,
			showDocumentCta: true,
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.more_evidence',
			humanReviewRecommended: false
		}
	}

	const resultState = 'likely_in_scope'
	const recommendedRoute = 'official_portal'
	return {
		resultState,
		recommendedRoute,
		flags: supportNeeds.includes('child_or_dependant_support')
			? ['result.flag.family_support_needs']
			: [],
		reasonKey: 'result.reason.likely_in_scope',
		evidenceStrength,
		showHowToApply: true,
		showSupportCta: true,
		showDocumentCta: false,
		checklist: getChecklist(answers, resultState, recommendedRoute),
		explanationKey: 'result.explanation.likely_in_scope',
		humanReviewRecommended: false
	}
}

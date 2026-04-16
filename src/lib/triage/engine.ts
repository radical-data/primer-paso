import type { MessageKey } from '$lib/content'
import type {
	EvidenceBeforeCutoffValue,
	EvidenceRecentValue,
	JourneyAnswers,
	MonthValue
} from '$lib/journey/types'

import type { PreparationChecklist, ResultSummary, TriageResult } from './types'

const MONTH_NUMBERS: Record<MonthValue, number> = {
	january: 1,
	february: 2,
	march: 3,
	april: 4,
	may: 5,
	june: 6,
	july: 7,
	august: 8,
	september: 9,
	october: 10,
	november: 11,
	december: 12
}

const parseResidenceStart = (answers: JourneyAnswers) => {
	if (!answers.residenceStart) {
		return null
	}

	const { yearBucket, month, monthUnknown } = answers.residenceStart

	switch (yearBucket) {
		case '2024_or_earlier':
			return { yearBucket, month: undefined, monthUnknown: false }
		case '2026':
			return { yearBucket, month: undefined, monthUnknown: false }
		case 'not_sure':
			return { yearBucket, month: undefined, monthUnknown: true }
		case '2025':
			return {
				yearBucket,
				month: month ? MONTH_NUMBERS[month] : undefined,
				monthUnknown: monthUnknown ?? false
			}
		default:
			return null
	}
}

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
		answers.inSpainNow === 'not_sure' ||
		!answers.residenceStart ||
		answers.residenceStart.yearBucket === 'not_sure' ||
		(answers.residenceStart.yearBucket === '2025' && answers.residenceStart.monthUnknown) ||
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
	if (answers.fiveMonthStay === 'yes' || answers.fiveMonthStay === 'mostly_yes') {
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
	if (resultState === 'another_route_may_fit_better')
		discussWithSupport.add('result.checklist.item.another_route_advice')

	if (timelineUncertain) unresolved.add('result.checklist.item.confirm_timeline')
	if (answers.fiveMonthStay === 'no') unresolved.add('result.checklist.item.continuity_concern')
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

const getResultSummary = (
	resultState: TriageResult['resultState'],
	recommendedRoute: TriageResult['recommendedRoute']
): ResultSummary => {
	const eligibilityKey =
		resultState === 'likely_in_scope'
			? 'pages.result.eligibility.likely_in_scope'
			: resultState === 'possible_but_needs_more_evidence'
				? 'pages.result.eligibility.possible_but_needs_more_evidence'
				: resultState === 'needs_specialist_review'
					? 'pages.result.eligibility.needs_specialist_review'
					: resultState === 'not_enough_information_yet'
						? 'pages.result.eligibility.not_enough_information_yet'
						: 'pages.result.eligibility.another_route_may_fit_better'

	const nextStepKey =
		recommendedRoute === 'official_portal'
			? 'pages.result.next_step.official_portal'
			: 'pages.result.next_step.collaborating_organisation'

	return { eligibilityKey, nextStepKey }
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
	const residenceStart = parseResidenceStart(answers)
	const inSpainNow = answers.inSpainNow
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

	if (inSpainNow === 'no') {
		const resultState = 'another_route_may_fit_better'
		const recommendedRoute = 'collaborating_organisation'
		return {
			resultState,
			recommendedRoute,
			flags: ['result.flag.not_in_spain_now'],
			reasonKey: 'result.reason.not_in_spain_now',
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			summary: getResultSummary(resultState, recommendedRoute),
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.not_in_spain_now',
			nextStepKeys: ['result.next_step.other_route_advice', 'result.next_step.try_again_later'],
			humanReviewRecommended: false
		}
	}

	if (
		inSpainNow === 'not_sure' ||
		!residenceStart ||
		residenceStart.yearBucket === 'not_sure' ||
		(residenceStart.yearBucket === '2025' && residenceStart.monthUnknown) ||
		asylumHistory === 'not_sure' ||
		(asylumHistory === 'yes' && asylumBeforeCutoff === 'not_sure') ||
		fiveMonthStay === 'not_sure'
	) {
		flags.add('result.flag.uncertain_timeline')
	}

	if (fiveMonthStay === 'no') {
		flags.add('result.flag.five_month_requirement_risk')
	}

	if (residenceStart?.yearBucket === '2026') {
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
			summary: getResultSummary(resultState, recommendedRoute),
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.after_cutoff',
			nextStepKeys: [
				'result.next_step.other_route_advice',
				'result.next_step.keep_residence_documents'
			],
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
		fiveMonthStay === 'no' ||
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
				...(fiveMonthStay === 'no' ? (['result.flag.continuity_concern'] as MessageKey[]) : [])
			],
			reasonKey: getReasonKey(answers, 'result.reason.specialist_review'),
			evidenceStrength,
			showHowToApply: false,
			showSupportCta: true,
			showDocumentCta: false,
			summary: getResultSummary(resultState, recommendedRoute),
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.specialist_review',
			nextStepKeys: [
				'result.next_step.speak_to_specialist',
				'result.next_step.keep_papers_together'
			],
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
			summary: getResultSummary(resultState, recommendedRoute),
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.not_enough_information',
			nextStepKeys: [
				'result.next_step.confirm_timeline',
				'result.next_step.ask_for_help_if_unsure'
			],
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
			summary: getResultSummary(resultState, recommendedRoute),
			checklist: getChecklist(answers, resultState, recommendedRoute),
			explanationKey: 'result.explanation.more_evidence',
			nextStepKeys: ['result.next_step.gather_before_cutoff', 'result.next_step.gather_recent'],
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
		summary: getResultSummary(resultState, recommendedRoute),
		checklist: getChecklist(answers, resultState, recommendedRoute),
		explanationKey: 'result.explanation.likely_in_scope',
		nextStepKeys: [
			'result.next_step.keep_papers_together',
			'result.next_step.use_official_channel'
		],
		humanReviewRecommended: false
	}
}

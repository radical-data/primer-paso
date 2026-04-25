import type { MessageKey } from '$lib/content'

export type ResultState =
	| 'likely_in_scope'
	| 'possible_but_needs_more_evidence'
	| 'needs_specialist_review'
	| 'another_route_may_fit_better'
	| 'not_enough_information_yet'

export type RecommendedRoute = 'official_portal' | 'collaborating_organisation'

export interface PreparationChecklist {
	alreadyHave: MessageKey[]
	stillNeed: MessageKey[]
	discussWithSupport: MessageKey[]
	unresolved: MessageKey[]
}

export interface TriageResult {
	resultState: ResultState
	recommendedRoute: RecommendedRoute
	flags: MessageKey[]
	reasonKey?: MessageKey
	evidenceStrength: 'strong' | 'thin' | 'unknown'
	showHowToApply: boolean
	showSupportCta: boolean
	showDocumentCta: boolean
	checklist: PreparationChecklist
	explanationKey: MessageKey
	humanReviewRecommended: boolean
}

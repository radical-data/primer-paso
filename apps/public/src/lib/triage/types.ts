import type { MessageKey } from '$lib/content'

export type ResultState = 'eligible' | 'needs_specialist_review' | 'not_this_process'

export type PositiveEligibilityRoute =
	| 'international_protection'
	| 'family_unit'
	| 'work_or_intention'
	| 'vulnerability'

export type EligibilityRoute =
	| PositiveEligibilityRoute
	| 'needs_specialist_review'
	| 'not_this_process'

export type SubmissionPath = 'registered_entity_online' | 'specialist_review_first'

export interface PreparationChecklist {
	alreadyHave: MessageKey[]
	stillNeed: MessageKey[]
	discussWithSupport: MessageKey[]
	unresolved: MessageKey[]
}

export interface TriageResult {
	resultState: ResultState
	recommendedEligibilityRoute: EligibilityRoute
	possibleEligibilityRoutes: PositiveEligibilityRoute[]
	recommendedSubmissionPath: SubmissionPath
	reasonKey?: MessageKey
	explanationKey: MessageKey
	checklist: PreparationChecklist
}

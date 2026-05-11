import type { MessageKey } from '$lib/content'
import type { CriminalRecordCountryAssessment } from '$lib/triage/criminal-records'

export type ResultState = 'eligible' | 'needs_specialist_review' | 'not_this_process'

export type RouteBlocker =
	| 'criminal_record_certificate_not_requested'
	| 'criminal_record_certificate_requested_waiting'
	| 'criminal_record_certificate_status_unclear'

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
	criminalRecordAssessments: CriminalRecordCountryAssessment[]
	reasonKey?: MessageKey
	explanationKey: MessageKey
	checklist: PreparationChecklist
}

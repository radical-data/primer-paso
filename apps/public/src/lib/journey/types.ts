import type { ProvinceValue } from '$lib/generated/provinces'

export const LANGUAGE_VALUES = ['es', 'en', 'ar', 'fr'] as const
export type LanguageValue = (typeof LANGUAGE_VALUES)[number]

export const COMPLETION_MODE_VALUES = ['self', 'someone_else', 'support_worker'] as const
export type CompletionModeValue = (typeof COMPLETION_MODE_VALUES)[number]

export const YES_NO_NOT_SURE_VALUES = ['yes', 'no', 'not_sure'] as const
export type YesNoNotSureValue = (typeof YES_NO_NOT_SURE_VALUES)[number]

export const FIVE_MONTH_STAY_VALUES = ['yes', 'left_spain', 'not_sure'] as const
export type FiveMonthStayValue = (typeof FIVE_MONTH_STAY_VALUES)[number]

export const WORK_SITUATION_VALUES = [
	'worked_in_spain',
	'job_offer',
	'want_to_work_for_myself',
	'none',
	'not_sure'
] as const
export type WorkSituationValue = (typeof WORK_SITUATION_VALUES)[number]
export const FAMILY_SITUATION_VALUES = [
	'child_under_18',
	'adult_child_support_needs',
	'mother_or_father',
	'none',
	'not_sure'
] as const
export type FamilySituationValue = (typeof FAMILY_SITUATION_VALUES)[number]

export const IDENTITY_DOCUMENT_VALUES = [
	'current_passport',
	'expired_passport',
	'national_identity_card',
	'asylum_document',
	'travel_document',
	'no_identity_documents_now',
	'prefer_not_to_say',
	'not_sure'
] as const
export type IdentityDocumentValue = (typeof IDENTITY_DOCUMENT_VALUES)[number]

export const EVIDENCE_BEFORE_CUTOFF_VALUES = [
	'padron_or_registration',
	'housing_papers',
	'health_or_pharmacy',
	'school_or_childcare',
	'work_papers',
	'organisation_or_church_letter',
	'travel_or_transport',
	'something_else_dated_named',
	'none_yet',
	'not_sure'
] as const
export type EvidenceBeforeCutoffValue = (typeof EVIDENCE_BEFORE_CUTOFF_VALUES)[number]

export const EVIDENCE_RECENT_VALUES = [
	'housing_papers',
	'health_or_pharmacy',
	'school_or_childcare',
	'work_papers',
	'organisation_or_church_letter',
	'bank_or_money_transfer',
	'travel_or_dated_receipts',
	'something_else_dated_named',
	'none_yet',
	'not_sure'
] as const
export type EvidenceRecentValue = (typeof EVIDENCE_RECENT_VALUES)[number]

export const SPECIALIST_FLAG_VALUES = [
	'criminal_record_worry',
	'identity_missing_or_mismatch',
	'previous_refusal_needs_help',
	'asylum_case_not_clear',
	'unsafe_sharing_digitally',
	'urgent_human_support',
	'want_specialist',
	'none'
] as const
export type SpecialistFlagValue = (typeof SPECIALIST_FLAG_VALUES)[number]

export const SUPPORT_NEED_VALUES = [
	'another_language',
	'in_person_help',
	'phone_support',
	'help_using_phone_or_computer',
	'help_scanning_or_printing',
	'help_gathering_papers',
	'child_or_dependant_support',
	'specialist_advice',
	'not_sure'
] as const
export type SupportNeedValue = (typeof SUPPORT_NEED_VALUES)[number]

export interface JourneyAnswers {
	language?: LanguageValue
	completionMode?: CompletionModeValue
	presentBeforeCutoff?: YesNoNotSureValue
	asylumHistory?: YesNoNotSureValue
	asylumBeforeCutoff?: YesNoNotSureValue
	fiveMonthStay?: FiveMonthStayValue
	asylumCaseDocuments?: YesNoNotSureValue
	workSituation?: WorkSituationValue[]
	familySituation?: FamilySituationValue[]
	identityDocuments?: IdentityDocumentValue[]
	evidenceBeforeCutoff?: EvidenceBeforeCutoffValue[]
	evidenceRecentMonths?: EvidenceRecentValue[]
	specialistFlags?: SpecialistFlagValue[]
	province?: ProvinceValue
	supportNeeds?: SupportNeedValue[]
}

export interface JourneyState {
	sessionId: string
	answers: JourneyAnswers
	updatedAt: string
}

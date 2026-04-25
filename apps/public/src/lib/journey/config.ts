import type { MessageKey } from '$lib/content'
import { provinces } from '$lib/generated/provinces'
import type { JourneyAnswers } from '$lib/journey/types'
import { runTriage } from '$lib/triage/engine'

export type FieldAdapterName = 'single-choice' | 'multi-choice' | 'select'

export type JourneyOption =
	| {
			value: string
			labelKey: MessageKey
			label?: never
	  }
	| {
			value: string
			label: string
			labelKey?: never
	  }

export type StepResolver = string | ((answers: JourneyAnswers) => string)

export interface BaseStepDefinition {
	id: string
	slug: string
	field: keyof JourneyAnswers
	adapter: FieldAdapterName
	eyebrowKey?: MessageKey
	titleKey: MessageKey
	bodyKey?: MessageKey
	hintKey?: MessageKey
	errorKey: MessageKey
	checkAnswersLabelKey?: MessageKey
	includeInCheckAnswers?: boolean
	back: StepResolver
	next: StepResolver
	guard?: (answers: JourneyAnswers) => boolean
	redirectIfGuardFails?: StepResolver
}

export interface ChoiceStepDefinition extends BaseStepDefinition {
	adapter: 'single-choice' | 'multi-choice' | 'select'
	options: JourneyOption[]
}

export type JourneyStepDefinition = ChoiceStepDefinition

const shouldAskProvince = (answers: JourneyAnswers) =>
	runTriage(answers).recommendedRoute === 'collaborating_organisation'

const provinceOptions: JourneyOption[] = provinces.map((province) => ({
	value: province.code,
	label: province.name
}))

const steps: JourneyStepDefinition[] = [
	{
		id: 'language',
		slug: 'language',
		field: 'language',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.session_setup',
		titleKey: 'steps.language.title',
		hintKey: 'steps.language.hint',
		errorKey: 'steps.language.error',
		checkAnswersLabelKey: 'steps.language.check_answers_label',
		includeInCheckAnswers: false,
		back: '/screener',
		next: 'completion-mode',
		options: [
			{ value: 'es', labelKey: 'steps.language.options.es' },
			{ value: 'en', labelKey: 'steps.language.options.en' },
			{ value: 'ar', labelKey: 'steps.language.options.ar' },
			{ value: 'fr', labelKey: 'steps.language.options.fr' }
		]
	},
	{
		id: 'completion-mode',
		slug: 'completion-mode',
		field: 'completionMode',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.session_setup',
		titleKey: 'steps.completion_mode.title',
		hintKey: 'steps.completion_mode.hint',
		errorKey: 'steps.completion_mode.error',
		checkAnswersLabelKey: 'steps.completion_mode.check_answers_label',
		includeInCheckAnswers: true,
		back: 'language',
		next: 'presence-before-cutoff',
		options: [
			{ value: 'self', labelKey: 'steps.completion_mode.options.self' },
			{ value: 'someone_else', labelKey: 'steps.completion_mode.options.someone_else' },
			{ value: 'support_worker', labelKey: 'steps.completion_mode.options.support_worker' }
		]
	},
	{
		id: 'presence-before-cutoff',
		slug: 'presence-before-cutoff',
		field: 'presentBeforeCutoff',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.presence_before_cutoff.title',
		hintKey: 'steps.presence_before_cutoff.hint',
		errorKey: 'steps.presence_before_cutoff.error',
		checkAnswersLabelKey: 'steps.presence_before_cutoff.check_answers_label',
		includeInCheckAnswers: true,
		back: 'completion-mode',
		next: 'five-month-stay',
		options: [
			{ value: 'yes', labelKey: 'steps.common.options.yes' },
			{ value: 'no', labelKey: 'steps.common.options.no' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'five-month-stay',
		slug: 'five-month-stay',
		field: 'fiveMonthStay',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.five_month_stay.title',
		bodyKey: 'steps.five_month_stay.body',
		errorKey: 'steps.five_month_stay.error',
		checkAnswersLabelKey: 'steps.five_month_stay.check_answers_label',
		includeInCheckAnswers: true,
		back: 'presence-before-cutoff',
		next: 'asylum-history',
		options: [
			{ value: 'yes', labelKey: 'steps.common.options.yes' },
			{ value: 'left_spain', labelKey: 'steps.five_month_stay.options.left_spain' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'asylum-history',
		slug: 'asylum-history',
		field: 'asylumHistory',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.asylum_history.title',
		errorKey: 'steps.asylum_history.error',
		checkAnswersLabelKey: 'steps.asylum_history.check_answers_label',
		includeInCheckAnswers: true,
		back: 'five-month-stay',
		next: (answers) =>
			answers.asylumHistory === 'yes' ? 'asylum-before-cutoff' : 'work-situation',
		options: [
			{ value: 'yes', labelKey: 'steps.common.options.yes' },
			{ value: 'no', labelKey: 'steps.common.options.no' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'asylum-before-cutoff',
		slug: 'asylum-before-cutoff',
		field: 'asylumBeforeCutoff',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.asylum_before_cutoff.title',
		errorKey: 'steps.asylum_before_cutoff.error',
		checkAnswersLabelKey: 'steps.asylum_before_cutoff.check_answers_label',
		includeInCheckAnswers: true,
		back: 'asylum-history',
		next: (answers) =>
			answers.asylumBeforeCutoff === 'yes' ? 'identity-documents' : 'work-situation',
		guard: (answers) => answers.asylumHistory === 'yes',
		redirectIfGuardFails: 'work-situation',
		options: [
			{ value: 'yes', labelKey: 'steps.common.options.yes' },
			{ value: 'no', labelKey: 'steps.common.options.no' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'work-situation',
		slug: 'work-situation',
		field: 'workSituation',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.work_situation.title',
		errorKey: 'steps.work_situation.error',
		checkAnswersLabelKey: 'steps.work_situation.check_answers_label',
		includeInCheckAnswers: true,
		back: (answers) =>
			answers.asylumHistory === 'yes' ? 'asylum-before-cutoff' : 'asylum-history',
		next: 'family-situation',
		guard: (answers) => answers.asylumHistory !== 'yes' || answers.asylumBeforeCutoff !== 'yes',
		redirectIfGuardFails: 'identity-documents',
		options: [
			{
				value: 'worked_in_spain',
				labelKey: 'steps.work_situation.options.worked_in_spain'
			},
			{
				value: 'job_offer',
				labelKey: 'steps.work_situation.options.job_offer'
			},
			{
				value: 'want_to_work_for_myself',
				labelKey: 'steps.work_situation.options.want_to_work_for_myself'
			},
			{ value: 'none', labelKey: 'steps.work_situation.options.none' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'family-situation',
		slug: 'family-situation',
		field: 'familySituation',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.eligibility',
		titleKey: 'steps.family_situation.title',
		errorKey: 'steps.family_situation.error',
		checkAnswersLabelKey: 'steps.family_situation.check_answers_label',
		includeInCheckAnswers: true,
		back: 'work-situation',
		next: 'identity-documents',
		guard: (answers) => answers.asylumHistory !== 'yes' || answers.asylumBeforeCutoff !== 'yes',
		redirectIfGuardFails: 'identity-documents',
		options: [
			{
				value: 'child_under_18',
				labelKey: 'steps.family_situation.options.child_under_18'
			},
			{
				value: 'adult_child_support_needs',
				labelKey: 'steps.family_situation.options.adult_child_support_needs'
			},
			{
				value: 'mother_or_father',
				labelKey: 'steps.family_situation.options.mother_or_father'
			},
			{ value: 'none', labelKey: 'steps.family_situation.options.none' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'identity-documents',
		slug: 'identity-documents',
		field: 'identityDocuments',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.documents',
		titleKey: 'steps.identity_documents.title',
		errorKey: 'steps.identity_documents.error',
		checkAnswersLabelKey: 'steps.identity_documents.check_answers_label',
		includeInCheckAnswers: true,
		back: (answers) =>
			answers.asylumBeforeCutoff === 'yes' ? 'asylum-before-cutoff' : 'family-situation',
		next: 'evidence-before-cutoff',
		options: [
			{
				value: 'current_passport',
				labelKey: 'steps.identity_documents.options.current_passport'
			},
			{
				value: 'expired_passport',
				labelKey: 'steps.identity_documents.options.expired_passport'
			},
			{
				value: 'national_identity_card',
				labelKey: 'steps.identity_documents.options.national_identity_card'
			},
			{
				value: 'asylum_document',
				labelKey: 'steps.identity_documents.options.asylum_document'
			},
			{
				value: 'travel_document',
				labelKey: 'steps.identity_documents.options.travel_document'
			},
			{
				value: 'no_identity_documents_now',
				labelKey: 'steps.identity_documents.options.no_identity_documents_now'
			},
			{
				value: 'prefer_not_to_say',
				labelKey: 'steps.identity_documents.options.prefer_not_to_say'
			},
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'evidence-before-cutoff',
		slug: 'evidence-before-cutoff',
		field: 'evidenceBeforeCutoff',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.documents',
		titleKey: 'steps.evidence_before_cutoff.title',
		errorKey: 'steps.evidence_before_cutoff.error',
		checkAnswersLabelKey: 'steps.evidence_before_cutoff.check_answers_label',
		includeInCheckAnswers: true,
		back: 'identity-documents',
		next: 'evidence-recent-months',
		options: [
			{
				value: 'padron_or_registration',
				labelKey: 'steps.evidence_before_cutoff.options.padron_or_registration'
			},
			{
				value: 'housing_papers',
				labelKey: 'steps.evidence_before_cutoff.options.housing_papers'
			},
			{
				value: 'health_or_pharmacy',
				labelKey: 'steps.evidence_before_cutoff.options.health_or_pharmacy'
			},
			{
				value: 'school_or_childcare',
				labelKey: 'steps.evidence_before_cutoff.options.school_or_childcare'
			},
			{ value: 'work_papers', labelKey: 'steps.evidence_before_cutoff.options.work_papers' },
			{
				value: 'organisation_or_church_letter',
				labelKey: 'steps.evidence_before_cutoff.options.organisation_or_church_letter'
			},
			{
				value: 'travel_or_transport',
				labelKey: 'steps.evidence_before_cutoff.options.travel_or_transport'
			},
			{
				value: 'something_else_dated_named',
				labelKey: 'steps.evidence_before_cutoff.options.something_else_dated_named'
			},
			{ value: 'none_yet', labelKey: 'steps.evidence_before_cutoff.options.none_yet' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'evidence-recent-months',
		slug: 'evidence-recent-months',
		field: 'evidenceRecentMonths',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.documents',
		titleKey: 'steps.evidence_recent_months.title',
		errorKey: 'steps.evidence_recent_months.error',
		checkAnswersLabelKey: 'steps.evidence_recent_months.check_answers_label',
		includeInCheckAnswers: true,
		back: 'evidence-before-cutoff',
		next: (answers) =>
			answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'yes'
				? 'asylum-documents'
				: 'support-needs',
		options: [
			{
				value: 'housing_papers',
				labelKey: 'steps.evidence_recent_months.options.housing_papers'
			},
			{
				value: 'health_or_pharmacy',
				labelKey: 'steps.evidence_recent_months.options.health_or_pharmacy'
			},
			{
				value: 'school_or_childcare',
				labelKey: 'steps.evidence_recent_months.options.school_or_childcare'
			},
			{
				value: 'work_papers',
				labelKey: 'steps.evidence_recent_months.options.work_papers'
			},
			{
				value: 'organisation_or_church_letter',
				labelKey: 'steps.evidence_recent_months.options.organisation_or_church_letter'
			},
			{
				value: 'bank_or_money_transfer',
				labelKey: 'steps.evidence_recent_months.options.bank_or_money_transfer'
			},
			{
				value: 'travel_or_dated_receipts',
				labelKey: 'steps.evidence_recent_months.options.travel_or_dated_receipts'
			},
			{
				value: 'something_else_dated_named',
				labelKey: 'steps.evidence_recent_months.options.something_else_dated_named'
			},
			{ value: 'none_yet', labelKey: 'steps.evidence_recent_months.options.none_yet' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'asylum-documents',
		slug: 'asylum-documents',
		field: 'asylumCaseDocuments',
		adapter: 'single-choice',
		eyebrowKey: 'eyebrows.documents',
		titleKey: 'steps.asylum_documents.title',
		hintKey: 'steps.asylum_documents.hint',
		errorKey: 'steps.asylum_documents.error',
		checkAnswersLabelKey: 'steps.asylum_documents.check_answers_label',
		includeInCheckAnswers: true,
		back: 'evidence-recent-months',
		next: 'support-needs',
		guard: (answers) => answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'yes',
		redirectIfGuardFails: 'support-needs',
		options: [
			{ value: 'yes', labelKey: 'steps.common.options.yes' },
			{ value: 'no', labelKey: 'steps.common.options.no' },
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'support-needs',
		slug: 'support-needs',
		field: 'supportNeeds',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.support',
		titleKey: 'steps.support_needs.title',
		errorKey: 'steps.support_needs.error',
		checkAnswersLabelKey: 'steps.support_needs.check_answers_label',
		includeInCheckAnswers: true,
		back: (answers) =>
			answers.asylumHistory === 'yes' && answers.asylumBeforeCutoff === 'yes'
				? 'asylum-documents'
				: 'evidence-recent-months',
		next: 'specialist-flags',
		options: [
			{
				value: 'another_language',
				labelKey: 'steps.support_needs.options.another_language'
			},
			{
				value: 'in_person_help',
				labelKey: 'steps.support_needs.options.in_person_help'
			},
			{
				value: 'phone_support',
				labelKey: 'steps.support_needs.options.phone_support'
			},
			{
				value: 'help_using_phone_or_computer',
				labelKey: 'steps.support_needs.options.help_using_phone_or_computer'
			},
			{
				value: 'help_scanning_or_printing',
				labelKey: 'steps.support_needs.options.help_scanning_or_printing'
			},
			{
				value: 'help_gathering_papers',
				labelKey: 'steps.support_needs.options.help_gathering_papers'
			},
			{
				value: 'child_or_dependant_support',
				labelKey: 'steps.support_needs.options.child_or_dependant_support'
			},
			{
				value: 'specialist_advice',
				labelKey: 'steps.support_needs.options.specialist_advice'
			},
			{ value: 'not_sure', labelKey: 'steps.common.options.not_sure' }
		]
	},
	{
		id: 'specialist-flags',
		slug: 'specialist-flags',
		field: 'specialistFlags',
		adapter: 'multi-choice',
		eyebrowKey: 'eyebrows.support',
		titleKey: 'steps.specialist_flags.title',
		errorKey: 'steps.specialist_flags.error',
		checkAnswersLabelKey: 'steps.specialist_flags.check_answers_label',
		includeInCheckAnswers: true,
		back: 'support-needs',
		next: (answers) => (shouldAskProvince(answers) ? 'province' : '/check-answers'),
		options: [
			{
				value: 'criminal_record_worry',
				labelKey: 'steps.specialist_flags.options.criminal_record_worry'
			},
			{
				value: 'identity_missing_or_mismatch',
				labelKey: 'steps.specialist_flags.options.identity_missing_or_mismatch'
			},
			{
				value: 'previous_refusal_needs_help',
				labelKey: 'steps.specialist_flags.options.previous_refusal_needs_help'
			},
			{
				value: 'asylum_case_not_clear',
				labelKey: 'steps.specialist_flags.options.asylum_case_not_clear'
			},
			{
				value: 'unsafe_sharing_digitally',
				labelKey: 'steps.specialist_flags.options.unsafe_sharing_digitally'
			},
			{
				value: 'urgent_human_support',
				labelKey: 'steps.specialist_flags.options.urgent_human_support'
			},
			{
				value: 'want_specialist',
				labelKey: 'steps.specialist_flags.options.want_specialist'
			},
			{ value: 'none', labelKey: 'steps.specialist_flags.options.none' }
		]
	},
	{
		id: 'province',
		slug: 'province',
		field: 'province',
		adapter: 'select',
		eyebrowKey: 'eyebrows.support',
		titleKey: 'steps.province.title',
		hintKey: 'steps.province.hint',
		errorKey: 'steps.province.error',
		checkAnswersLabelKey: 'steps.province.check_answers_label',
		includeInCheckAnswers: true,
		back: 'specialist-flags',
		guard: shouldAskProvince,
		redirectIfGuardFails: '/check-answers',
		next: '/check-answers',
		options: provinceOptions
	}
]

export const journeySteps = steps

export const getJourneyStep = (slug: string) => steps.find((step) => step.slug === slug)

export const resolveStepTarget = (target: StepResolver, answers: JourneyAnswers) => {
	const resolved = typeof target === 'function' ? target(answers) : target
	return resolved.startsWith('/') ? resolved : `/${resolved}`
}

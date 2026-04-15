import type { FormattedReference, MessageKey, MessageReference, RawReference } from '$lib/content'
import type { JourneyAnswers, MonthValue, ResidenceStartYearBucket } from '$lib/journey/types'
import { MONTH_VALUES, RESIDENCE_START_YEAR_BUCKETS } from '$lib/journey/types'
import type { JourneyStepDefinition } from './config'

interface ParseSuccess {
	ok: true
	answersPatch: Partial<JourneyAnswers>
	formValue: unknown
}

interface ParseFailure {
	ok: false
	errorKey: MessageKey
	formValue: unknown
}

type ParseResult = ParseSuccess | ParseFailure

export interface FieldAdapter {
	getFormValue: (answers: JourneyAnswers, step: JourneyStepDefinition) => unknown
	parse: (formData: FormData, step: JourneyStepDefinition) => ParseResult
	format: (answers: JourneyAnswers, step: JourneyStepDefinition) => FormattedReference[]
}

const message = (key: MessageKey, values?: MessageReference['values']): MessageReference => ({
	type: 'message',
	key,
	values
})

const raw = (value: string): RawReference => ({ type: 'raw', value })

const notAnswered = (): FormattedReference[] => [message('common.not_answered')]

const isValidMonth = (value: string): value is MonthValue =>
	MONTH_VALUES.includes(value as MonthValue)

const isValidYearBucket = (value: string): value is ResidenceStartYearBucket =>
	RESIDENCE_START_YEAR_BUCKETS.includes(value as ResidenceStartYearBucket)

const singleChoiceAdapter: FieldAdapter = {
	getFormValue: (answers, step) => String(answers[step.field] ?? ''),
	parse: (formData, step) => {
		const value = String(formData.get(step.field) ?? '')
		const valid = 'options' in step && step.options.some((option) => option.value === value)

		if (!valid) {
			return { ok: false, errorKey: step.errorKey, formValue: value }
		}

		return {
			ok: true,
			answersPatch: { [step.field]: value } as Partial<JourneyAnswers>,
			formValue: value
		}
	},
	format: (answers, step) => {
		const value = answers[step.field]
		if (!value || !('options' in step)) return notAnswered()
		const option = step.options.find((entry) => entry.value === value)
		return option ? [message(option.labelKey)] : notAnswered()
	}
}

const multiChoiceAdapter: FieldAdapter = {
	getFormValue: (answers, step) => {
		const value = answers[step.field]
		return Array.isArray(value) ? value : []
	},
	parse: (formData, step) => {
		const selected = formData.getAll(step.field).map(String)
		const validValues =
			'options' in step ? new Set(step.options.map((option) => option.value)) : new Set()
		const values = selected.filter((value) => validValues.has(value))

		if (values.length === 0) {
			return { ok: false, errorKey: step.errorKey, formValue: selected }
		}

		return {
			ok: true,
			answersPatch: { [step.field]: values } as Partial<JourneyAnswers>,
			formValue: values
		}
	},
	format: (answers, step) => {
		const values = answers[step.field]
		if (!Array.isArray(values) || !('options' in step) || values.length === 0) return notAnswered()
		const labels = values
			.map((value) => step.options.find((option) => option.value === value)?.labelKey)
			.filter((value): value is MessageKey => Boolean(value))
		return labels.length > 0 ? labels.map((key) => message(key)) : notAnswered()
	}
}

const selectAdapter: FieldAdapter = {
	getFormValue: singleChoiceAdapter.getFormValue,
	parse: (formData, step) => {
		const value = String(formData.get(step.field) ?? '')
		const valid = 'options' in step && step.options.some((option) => option.value === value)

		if (!valid) {
			return { ok: false, errorKey: step.errorKey, formValue: value }
		}

		return {
			ok: true,
			answersPatch: { [step.field]: value } as Partial<JourneyAnswers>,
			formValue: value
		}
	},
	format: singleChoiceAdapter.format
}

const residenceStartAdapter: FieldAdapter = {
	getFormValue: (answers) => ({
		yearBucket: answers.residenceStart?.yearBucket ?? '',
		month: answers.residenceStart?.month ?? '',
		monthUnknown: answers.residenceStart?.monthUnknown ?? false
	}),
	parse: (formData, step) => {
		const yearBucket = String(formData.get('yearBucket') ?? '').trim()
		const month = String(formData.get('month') ?? '').trim()
		const monthUnknown = formData.get('monthUnknown') === 'on'
		const formValue = { yearBucket, month, monthUnknown }

		if (!isValidYearBucket(yearBucket)) {
			return { ok: false, errorKey: step.errorKey, formValue }
		}

		if (yearBucket === '2025' && !monthUnknown && !isValidMonth(month)) {
			return {
				ok: false,
				errorKey: 'steps.residence_start.month_error',
				formValue
			}
		}

		return {
			ok: true,
			answersPatch: {
				[step.field]: {
					yearBucket,
					...(yearBucket === '2025' && isValidMonth(month) ? { month } : {}),
					...(yearBucket === '2025' ? { monthUnknown } : {})
				}
			} as Partial<JourneyAnswers>,
			formValue
		}
	},
	format: (answers) => {
		const value = answers.residenceStart
		if (!value) return notAnswered()

		switch (value.yearBucket) {
			case '2024_or_earlier':
				return [message('answers.residence_start.2024_or_earlier')]
			case '2026':
				return [message('answers.residence_start.2026')]
			case 'not_sure':
				return [message('answers.residence_start.not_sure')]
			case '2025':
				if (value.monthUnknown) {
					return [message('answers.residence_start.2025_month_unknown')]
				}
				return value.month
					? [
							message('answers.residence_start.2025_month', {
								month: message(`months.${value.month}` as MessageKey)
							})
						]
					: [message('answers.residence_start.2025')]
			default:
				return notAnswered()
		}
	}
}

const contactPreferenceAdapter: FieldAdapter = {
	getFormValue: (answers) => ({
		contactMethod: answers.contactMethod ?? '',
		contactValue: answers.contactValue ?? ''
	}),
	parse: (formData, step) => {
		const contactMethod = String(formData.get('contactMethod') ?? '')
		const contactValue = String(formData.get('contactValue') ?? '').trim()
		const valid = 'options' in step && step.options.some((option) => option.value === contactMethod)

		if (!valid) {
			return { ok: false, errorKey: step.errorKey, formValue: { contactMethod, contactValue } }
		}

		if (contactMethod !== 'through_organisation' && !contactValue) {
			return {
				ok: false,
				errorKey: 'steps.contact.detail_required_error',
				formValue: { contactMethod, contactValue }
			}
		}

		return {
			ok: true,
			answersPatch: { contactMethod, contactValue } as Partial<JourneyAnswers>,
			formValue: { contactMethod, contactValue }
		}
	},
	format: (answers, step) => {
		if (!answers.contactMethod || !('options' in step)) return notAnswered()

		const method = step.options.find((option) => option.value === answers.contactMethod)
		if (!method) return notAnswered()

		if (answers.contactMethod === 'through_organisation' || !answers.contactValue) {
			return [message(method.labelKey)]
		}

		return [
			message('answers.contact.with_value', {
				method: message(method.labelKey),
				value: raw(answers.contactValue)
			})
		]
	}
}

export const fieldAdapters = {
	'single-choice': singleChoiceAdapter,
	'multi-choice': multiChoiceAdapter,
	select: selectAdapter,
	'residence-start': residenceStartAdapter,
	'contact-preference': contactPreferenceAdapter
} satisfies Record<string, FieldAdapter>

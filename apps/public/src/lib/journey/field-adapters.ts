import type { FormattedReference, MessageKey, MessageReference } from '$lib/content'
import { getCountryName } from '$lib/generated/countries'
import {
	ensureSpain,
	parsePreviousResidenceCountries,
	validateCriminalRecordCertificates,
	validatePreviousResidenceCountries
} from '$lib/journey/previous-residence-countries'
import type { JourneyAnswers, PreviousResidenceCountry } from '$lib/journey/types'
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
const raw = (value: string): FormattedReference => ({ type: 'raw', value })

const notAnswered = (): FormattedReference[] => [message('common.not_answered')]

const applyExclusiveOptions = (values: string[], step: JourneyStepDefinition) => {
	const selectedExclusive = values.find((value) => step.exclusiveOptions?.includes(value))

	if (!selectedExclusive) return values

	return [selectedExclusive]
}

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
		if (!option) return notAnswered()
		return option.labelKey ? [message(option.labelKey)] : [raw(option.label)]
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
		const values = applyExclusiveOptions(
			selected.filter((value) => validValues.has(value)),
			step
		)

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
		const labels = values.flatMap((value) => {
			const option = step.options.find((entry) => entry.value === value)
			if (!option) return []
			return option.labelKey ? [message(option.labelKey)] : [raw(option.label)]
		})
		return labels.length > 0 ? labels : notAnswered()
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

const getPreviousResidenceCountries = (answers: JourneyAnswers) =>
	answers.previousResidenceCountries ?? []

const formatPreviousResidenceCountryNames = (countries: PreviousResidenceCountry[]) =>
	countries.map((country) => raw(getCountryName(country.countryCode)))

const formatCriminalRecordCertificateCountry = (
	country: PreviousResidenceCountry
): FormattedReference[] => {
	if (!country.certificateStatus) return []

	const countryName = getCountryName(country.countryCode)
	const status = message(
		`steps.criminal_record_certificates.options.${country.certificateStatus}` as MessageKey
	)

	return [
		message('steps.criminal_record_certificates.check_answers.entry', {
			country: raw(countryName),
			status
		})
	]
}

const countryListAdapter: FieldAdapter = {
	getFormValue: (answers) => getPreviousResidenceCountries(answers),
	parse: (formData, step) => {
		const value = ensureSpain(parsePreviousResidenceCountries(formData.get(step.field)))
		const errorKey = validatePreviousResidenceCountries(value)

		if (errorKey) {
			return { ok: false, errorKey: errorKey as MessageKey, formValue: value }
		}

		return {
			ok: true,
			answersPatch: { previousResidenceCountries: value },
			formValue: value
		}
	},
	format: (answers) => {
		const countries = getPreviousResidenceCountries(answers)
		return countries.length > 0 ? formatPreviousResidenceCountryNames(countries) : notAnswered()
	}
}

const countryCertificateStatusAdapter: FieldAdapter = {
	getFormValue: (answers) => getPreviousResidenceCountries(answers),
	parse: (formData, step) => {
		const value = ensureSpain(parsePreviousResidenceCountries(formData.get(step.field)))
		const errorKey = validateCriminalRecordCertificates(value)

		if (errorKey) {
			return { ok: false, errorKey: errorKey as MessageKey, formValue: value }
		}

		return {
			ok: true,
			answersPatch: { previousResidenceCountries: value },
			formValue: value
		}
	},
	format: (answers) => {
		const countries = getPreviousResidenceCountries(answers)
		const foreignCountries = countries.filter((country) => country.countryCode !== 'ES')
		if (foreignCountries.length === 0) return notAnswered()

		return foreignCountries.flatMap((country) => formatCriminalRecordCertificateCountry(country))
	}
}

export const fieldAdapters = {
	'single-choice': singleChoiceAdapter,
	'multi-choice': multiChoiceAdapter,
	select: selectAdapter,
	'country-list': countryListAdapter,
	'country-certificate-status': countryCertificateStatusAdapter
} satisfies Record<string, FieldAdapter>

import { isValidPreviousResidenceCountryCode } from '$lib/generated/countries'
import type { CriminalRecordCertificateStatus, PreviousResidenceCountry } from '$lib/journey/types'

const VALID_CERTIFICATE_STATUSES = new Set<CriminalRecordCertificateStatus>([
	'already_have',
	'requested_waiting',
	'not_requested_yet',
	'not_sure'
])
export const SPAIN_COUNTRY_CODE = 'ES'

export const parsePreviousResidenceCountries = (
	rawValue: FormDataEntryValue | null
): PreviousResidenceCountry[] => {
	if (typeof rawValue !== 'string' || rawValue.trim() === '') return []

	try {
		const parsed = JSON.parse(rawValue)
		if (!Array.isArray(parsed)) return []

		return parsed
			.map((item): PreviousResidenceCountry | null => {
				if (!item || typeof item !== 'object') return null

				const countryCode =
					typeof item.countryCode === 'string' ? item.countryCode.trim().toUpperCase() : ''
				if (!isValidPreviousResidenceCountryCode(countryCode)) return null

				const certificateStatus =
					typeof item.certificateStatus === 'string' &&
					VALID_CERTIFICATE_STATUSES.has(item.certificateStatus as CriminalRecordCertificateStatus)
						? (item.certificateStatus as CriminalRecordCertificateStatus)
						: undefined
				if (countryCode === SPAIN_COUNTRY_CODE) {
					return {
						countryCode: SPAIN_COUNTRY_CODE,
						certificateStatus: undefined
					}
				}

				return {
					countryCode,
					certificateStatus
				}
			})
			.filter((item): item is PreviousResidenceCountry => item !== null)
	} catch {
		return []
	}
}

export const ensureSpain = (countries: PreviousResidenceCountry[]): PreviousResidenceCountry[] => {
	const cleaned = countries.filter((country) => country.countryCode !== SPAIN_COUNTRY_CODE)
	return [{ countryCode: SPAIN_COUNTRY_CODE }, ...cleaned]
}

export const validatePreviousResidenceCountries = (
	value: PreviousResidenceCountry[]
): string | null => {
	if (!value.some((country) => country.countryCode === SPAIN_COUNTRY_CODE)) {
		return 'steps.previous_residence_countries.error'
	}

	const seen = new Set<string>()
	for (const country of value) {
		if (seen.has(country.countryCode)) return 'steps.previous_residence_countries.error'
		seen.add(country.countryCode)
	}

	return null
}

export const validateCriminalRecordCertificates = (
	value: PreviousResidenceCountry[]
): string | null => {
	const foreignCountries = value.filter((country) => country.countryCode !== SPAIN_COUNTRY_CODE)
	if (foreignCountries.length === 0) return null

	for (const country of foreignCountries) {
		if (!country.certificateStatus) return 'steps.criminal_record_certificates.error'
	}

	return null
}

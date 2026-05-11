import type { CriminalRecordCertificateStatus, PreviousResidenceCountry } from '$lib/journey/types'
import type { RouteBlocker } from '$lib/triage/types'

export type CriminalRecordUrgency = 'ok' | 'watch' | 'urgent' | 'specialist_review'
export type CriminalRecordNextAction =
	| 'request_criminal_record_certificate_today'
	| 'save_certificate_request_proof'
	| 'wait_until_one_month_then_prepare_fallback'
	| 'ask_specialist_about_criminal_record_certificate'

export interface CriminalRecordCountryAssessment {
	countryCode: string
	status: CriminalRecordCertificateStatus | 'unknown'
	blockers: RouteBlocker[]
	urgency: CriminalRecordUrgency
	nextActions: CriminalRecordNextAction[]
}

export const assessCriminalRecordCountry = (
	country: PreviousResidenceCountry
): CriminalRecordCountryAssessment => {
	const blockers: RouteBlocker[] = []
	const nextActions: CriminalRecordNextAction[] = []

	if (country.certificateStatus === 'already_have') {
		return {
			countryCode: country.countryCode,
			status: 'already_have',
			blockers,
			urgency: 'ok',
			nextActions: []
		}
	}

	if (country.certificateStatus === 'not_requested_yet') {
		blockers.push('criminal_record_certificate_not_requested')
		nextActions.push('request_criminal_record_certificate_today')
		nextActions.push('save_certificate_request_proof')
		return {
			countryCode: country.countryCode,
			status: 'not_requested_yet',
			blockers,
			urgency: 'urgent',
			nextActions
		}
	}

	if (country.certificateStatus === 'not_sure' || !country.certificateStatus) {
		blockers.push('criminal_record_certificate_status_unclear')
		nextActions.push('ask_specialist_about_criminal_record_certificate')
		return {
			countryCode: country.countryCode,
			status: country.certificateStatus ?? 'unknown',
			blockers,
			urgency: 'specialist_review',
			nextActions
		}
	}

	blockers.push('criminal_record_certificate_requested_waiting')
	nextActions.push('wait_until_one_month_then_prepare_fallback')
	return {
		countryCode: country.countryCode,
		status: 'requested_waiting',
		blockers,
		urgency: 'watch',
		nextActions
	}
}

export const assessCriminalRecordCertificates = (
	countries: PreviousResidenceCountry[] | undefined
): CriminalRecordCountryAssessment[] => {
	const foreignCountries = (countries ?? []).filter((country) => country.countryCode !== 'ES')

	if (foreignCountries.length === 0) return []

	return foreignCountries.map((country) => assessCriminalRecordCountry(country))
}

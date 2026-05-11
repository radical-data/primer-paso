import { describe, expect, it } from 'vitest'

import { assessCriminalRecordCertificates } from '$lib/triage/criminal-records'

describe('assessCriminalRecordCertificates', () => {
	it('returns no blockers when only Spain is provided', () => {
		const result = assessCriminalRecordCertificates([{ countryCode: 'ES' }])
		expect(result).toEqual([])
	})

	it('has no blockers when the certificate is already held', () => {
		const result = assessCriminalRecordCertificates([
			{ countryCode: 'ES' },
			{
				countryCode: 'CO',
				certificateStatus: 'already_have'
			}
		])
		expect(result[0].blockers).toEqual([])
		expect(result[0].urgency).toBe('ok')
	})

	it('marks not-requested certificates as urgent', () => {
		const result = assessCriminalRecordCertificates([
			{
				countryCode: 'MA',
				certificateStatus: 'not_requested_yet'
			}
		])
		expect(result[0].blockers).toContain('criminal_record_certificate_not_requested')
		expect(result[0].urgency).toBe('urgent')
		expect(result[0].nextActions).toContain('request_criminal_record_certificate_today')
	})

	it('marks requested certificates as waiting', () => {
		const result = assessCriminalRecordCertificates([
			{
				countryCode: 'PE',
				certificateStatus: 'requested_waiting'
			}
		])
		expect(result[0].blockers).toContain('criminal_record_certificate_requested_waiting')
		expect(result[0].urgency).toBe('watch')
	})
})

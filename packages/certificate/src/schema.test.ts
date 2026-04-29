import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/vulnerability-certificate.issue-request.fixture.json'
import {
	certificateDraftSchema,
	certificateIssueRequestSchema,
	parseCertificateIssueRequest,
	validateCertificateDraft,
	validateCertificateIssueRequest
} from './schema'
import { VULNERABILITY_REASON_VALUES } from './types'

describe('certificate schema', () => {
	it('exports draft and issue request schema metadata', () => {
		expect(certificateDraftSchema.version).toBeDefined()
		expect(certificateDraftSchema.userData).toBeDefined()
		expect(certificateIssueRequestSchema.organisation).toBeDefined()
		expect(certificateIssueRequestSchema.signer).toBeDefined()
	})

	it('accepts the fixture issue request', () => {
		const result = validateCertificateIssueRequest(fixture)

		expect(result.ok).toBe(true)
		if (result.ok) {
			expect(result.value.draft.version).toBe(1)
			expect(result.value.organisation.name).toBe('Entidad Colaboradora de Ejemplo')
			expect(result.value.organisation.nifCif).toBe('G00000000')
		}
	})

	it('parses the fixture issue request', () => {
		const parsed = parseCertificateIssueRequest(fixture)

		expect(parsed.draft.userData.identity.documentNumber).toBe('P1234567')
		expect(parsed.verification.passportOrIdentityDocumentChecked).toBe(true)
	})

	it('rejects a draft with missing required identity fields', () => {
		const result = validateCertificateDraft({
			version: 1,
			draftId: 'broken',
			userData: {},
			metadata: {}
		})

		expect(result.ok).toBe(false)
		expect(result.ok ? [] : result.issues.map((issue) => issue.path)).toContain('userData.identity')
	})

	it('accepts every supported PDF-aligned vulnerability reason', () => {
		const result = validateCertificateDraft({
			...fixture.draft,
			userData: {
				...fixture.draft.userData,
				vulnerability: {
					reasons: [...VULNERABILITY_REASON_VALUES]
				}
			}
		})

		expect(result.ok).toBe(true)
	})

	it.each([
		'family_responsibilities',
		'health_or_disability',
		'gender_based_violence',
		'homelessness_or_housing_insecurity',
		'labour_exploitation_or_abuse',
		'trafficking_or_exploitation_risk',
		'minor_or_dependant_support'
	])('rejects legacy vulnerability reason %s', (reason) => {
		const result = validateCertificateDraft({
			...fixture.draft,
			userData: {
				...fixture.draft.userData,
				vulnerability: {
					reasons: [reason]
				}
			}
		})

		expect(result.ok).toBe(false)
		expect(result.ok ? [] : result.issues.map((issue) => issue.path)).toContain(
			'userData.vulnerability.reasons.0'
		)
	})

	it('rejects a draft with a generic other vulnerability reason', () => {
		const result = validateCertificateDraft({
			...fixture.draft,
			userData: {
				...fixture.draft.userData,
				vulnerability: {
					reasons: ['other']
				}
			}
		})

		expect(result.ok).toBe(false)
		expect(result.ok ? [] : result.issues.map((issue) => issue.path)).toContain(
			'userData.vulnerability.reasons.0'
		)
	})

	it('does not require location evidence in certificate drafts', () => {
		const result = validateCertificateDraft(fixture.draft)

		expect(result.ok).toBe(true)
	})
})

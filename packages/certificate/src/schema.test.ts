import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/vulnerability-certificate.issue-request.fixture.json'
import {
	certificateDraftSchema,
	certificateIssueRequestSchema,
	parseCertificateIssueRequest,
	validateCertificateDraft,
	validateCertificateIssueRequest
} from './schema'

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
})

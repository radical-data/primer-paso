import { describe, expect, it } from 'vitest'
import type { CertificateDraft } from '@primer-paso/certificate'
import {
	createCertificateHandoffToken,
	createInMemoryCertificateHandoffRepository,
	hashCertificateHandoffToken
} from './certificate-handoffs'

const draft: CertificateDraft = {
	version: 1,
	draftId: 'draft_test_001',
	userData: {
		identity: {
			givenNames: 'Amina',
			familyNames: 'Benali',
			documentType: 'passport',
			documentNumber: 'P1234567'
		},
		contact: { email: 'amina@example.invalid' },
		location: {
			addressLine1: 'Calle Ejemplo 1',
			municipality: 'Madrid',
			province: 'Madrid'
		},
		vulnerability: { reasons: ['psychosocial_risks'] }
	},
	metadata: {
		source: 'primer-paso-public',
		locale: 'es',
		createdAt: '2026-04-25T10:00:00.000Z',
		expiresAt: '2026-05-25T10:00:00.000Z'
	}
}

const consent = {
	informationAccurate: true,
	understandsNotIssued: true,
	consentsToShareWithOrganisation: true,
	createdAt: '2026-04-25T10:05:00.000Z'
}

describe('certificate handoff tokens', () => {
	it('creates high-entropy URL-safe tokens', () => {
		const token = createCertificateHandoffToken()

		expect(token.length).toBeGreaterThanOrEqual(43)
		expect(token).toMatch(/^[A-Za-z0-9_-]+$/)
	})

	it('hashes tokens deterministically without storing the raw token', () => {
		const token = createCertificateHandoffToken()

		expect(hashCertificateHandoffToken(token)).toBe(hashCertificateHandoffToken(token))
		expect(hashCertificateHandoffToken(token)).not.toBe(token)
	})

	it('stores and resolves a handoff through the repository contract', async () => {
		const repository = createInMemoryCertificateHandoffRepository()
		const created = await repository.create({
			draft,
			consent,
			createdFromSessionId: 'session_test_001',
			now: new Date('2026-04-25T10:10:00.000Z')
		})

		const resolved = await repository.findActiveByToken(created.token, {
			now: new Date('2026-04-25T10:11:00.000Z')
		})

		expect(resolved?.referenceCode).toBe(created.record.referenceCode)
		expect(resolved?.draft).toEqual(draft)
		expect(JSON.stringify(resolved)).not.toContain(created.token)
	})

	it('does not return expired handoffs', async () => {
		const repository = createInMemoryCertificateHandoffRepository()
		const created = await repository.create({
			draft,
			consent,
			createdFromSessionId: 'session_test_001',
			now: new Date('2026-04-25T10:10:00.000Z'),
			ttlDays: 1
		})

		const resolved = await repository.findActiveByToken(created.token, {
			now: new Date('2026-04-27T10:10:00.000Z')
		})

		expect(resolved).toBeNull()
	})
})

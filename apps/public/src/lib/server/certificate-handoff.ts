import {
	createPostgresCertificateHandoffRepository,
	type CertificateHandoffRepository
} from '@primer-paso/db'
import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import type { PublicCertificateDraftState } from './certificate'

let repository: CertificateHandoffRepository | null = null
let repositoryDatabaseUrl: string | null = null

export const getOrgPortalUrl = () =>
	(publicEnv.PUBLIC_ORG_PORTAL_URL ?? 'https://org.primerpaso.org').replace(/\/+$/, '')

export const getCertificateHandoffRepository = () => {
	const databaseUrl = privateEnv.PRIVATE_DATABASE_URL?.trim()

	if (!databaseUrl) {
		return null
	}

	if (!repository || repositoryDatabaseUrl !== databaseUrl) {
		repository = createPostgresCertificateHandoffRepository({
			databaseUrl
		})
		repositoryDatabaseUrl = databaseUrl
	}

	return repository
}

export const createCertificateHandoff = async (
	certificateDraft: PublicCertificateDraftState,
	sessionId: string
) => {
	const repository = getCertificateHandoffRepository()

	if (!repository) {
		throw new Error('Certificate handoff storage is not configured.')
	}

	if (!certificateDraft.consent) {
		throw new Error('Certificate handoff consent is required.')
	}

	const created = await repository.create({
		draft: certificateDraft.draft,
		consent: certificateDraft.consent,
		createdFromSessionId: sessionId
	})

	const handoffUrl = new URL('/handoff', getOrgPortalUrl())
	handoffUrl.searchParams.set('token', created.token)

	return {
		token: created.token,
		referenceCode: created.record.referenceCode,
		expiresAt: created.record.expiresAt,
		handoffUrl: handoffUrl.toString()
	}
}

export const getCertificateHandoffByToken = async (token: string) => {
	const repository = getCertificateHandoffRepository()

	if (!repository) {
		throw new Error('Certificate handoff storage is not configured.')
	}

	return repository.findActiveByToken(token)
}

export const markCertificateHandoffOpened = async (token: string) => {
	const repository = getCertificateHandoffRepository()

	if (!repository) {
		throw new Error('Certificate handoff storage is not configured.')
	}

	return repository.markOpened(token)
}

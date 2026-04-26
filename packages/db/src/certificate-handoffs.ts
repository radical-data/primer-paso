import { createHash, randomBytes, randomUUID } from 'node:crypto'
import type { CertificateDraft } from '@primer-paso/certificate'
import postgres, { type JSONValue, type Sql } from 'postgres'

export type CertificateHandoffStatus = 'active' | 'opened' | 'issued' | 'revoked' | 'expired'

export interface CertificateHandoffConsent {
	informationAccurate: boolean
	understandsNotIssued: boolean
	consentsToShareWithOrganisation: boolean
	createdAt: string
}

export interface CertificateHandoffRecord {
	id: string
	referenceCode: string
	tokenHash: string
	draft: CertificateDraft
	consent: CertificateHandoffConsent
	status: CertificateHandoffStatus
	createdAt: string
	expiresAt: string
	openedAt?: string
	revokedAt?: string
	createdFromSessionId?: string
	issuedCertificateId?: string
}

export interface CreateCertificateHandoffInput {
	draft: CertificateDraft
	consent: CertificateHandoffConsent
	now?: Date
	expiresAt?: Date
	ttlDays?: number
	createdFromSessionId?: string
}

export interface CreatedCertificateHandoff {
	token: string
	record: CertificateHandoffRecord
}

export interface FindCertificateHandoffOptions {
	now?: Date
}

export interface CertificateHandoffRepository {
	create: (input: CreateCertificateHandoffInput) => Promise<CreatedCertificateHandoff>
	findActiveByToken: (
		token: string,
		options?: FindCertificateHandoffOptions
	) => Promise<CertificateHandoffRecord | null>
	markOpened: (token: string, now?: Date) => Promise<CertificateHandoffRecord | null>
	updateStatus: (id: string, status: CertificateHandoffStatus, now?: Date) => Promise<void>
}

export interface PostgresCertificateHandoffRepositoryOptions {
	databaseUrl: string
}

const DEFAULT_EXPIRY_DAYS = 30

const toBase64Url = (bytes: Uint8Array) =>
	Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

export const createCertificateHandoffToken = () => toBase64Url(randomBytes(32))

const createReferenceCode = () =>
	randomBytes(5)
		.toString('hex')
		.toUpperCase()
		.replace(/(.{4})(?=.)/g, '$1-')

export const hashCertificateHandoffToken = (token: string) =>
	createHash('sha256').update(token).digest('hex')

const addDays = (date: Date, days: number) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000)

const toJsonValue = (value: unknown): JSONValue => value as JSONValue

const isExpired = (record: CertificateHandoffRecord, now = new Date()) =>
	new Date(record.expiresAt).getTime() <= now.getTime()

const normaliseStatus = (
	record: CertificateHandoffRecord,
	now = new Date()
): CertificateHandoffStatus =>
	record.status === 'active' && isExpired(record, now) ? 'expired' : record.status

const rowToRecord = (row: Record<string, unknown>): CertificateHandoffRecord => ({
	id: String(row.id),
	referenceCode: String(row.reference_code),
	tokenHash: String(row.token_hash),
	draft: row.draft as CertificateDraft,
	consent: row.consent as CertificateHandoffConsent,
	status: String(row.status) as CertificateHandoffStatus,
	createdAt: new Date(String(row.created_at)).toISOString(),
	expiresAt: new Date(String(row.expires_at)).toISOString(),
	createdFromSessionId: row.created_from_session_id
		? String(row.created_from_session_id)
		: undefined,
	openedAt: row.opened_at ? new Date(String(row.opened_at)).toISOString() : undefined,
	revokedAt: row.revoked_at ? new Date(String(row.revoked_at)).toISOString() : undefined,
	issuedCertificateId: row.issued_certificate_id ? String(row.issued_certificate_id) : undefined
})

const buildCertificateHandoffRecord = (
	input: CreateCertificateHandoffInput
): CreatedCertificateHandoff => {
	const now = input.now ?? new Date()
	const expiresAt = input.expiresAt ?? addDays(now, input.ttlDays ?? DEFAULT_EXPIRY_DAYS)
	const token = createCertificateHandoffToken()
	const tokenHash = hashCertificateHandoffToken(token)

	return {
		token,
		record: {
			id: randomUUID(),
			referenceCode: createReferenceCode(),
			tokenHash,
			draft: input.draft,
			consent: input.consent,
			status: 'active',
			createdAt: now.toISOString(),
			expiresAt: expiresAt.toISOString(),
			createdFromSessionId: input.createdFromSessionId
		}
	}
}

const insertPostgresHandoff = async (sql: Sql, record: CertificateHandoffRecord) => {
	await sql`
		insert into certificate_handoffs (
			id,
			reference_code,
			token_hash,
			draft,
			consent,
			status,
			created_at,
			expires_at,
			created_from_session_id,
			opened_at,
			revoked_at,
			issued_certificate_id
		)
		values (
			${record.id},
			${record.referenceCode},
			${record.tokenHash},
			${sql.json(toJsonValue(record.draft))},
			${sql.json(toJsonValue(record.consent))},
			${record.status},
			${record.createdAt},
			${record.expiresAt},
			${record.createdFromSessionId ?? null},
			${record.openedAt ?? null},
			${record.revokedAt ?? null},
			${record.issuedCertificateId ?? null}
		)
	`
}

const selectPostgresHandoffByTokenHash = async (sql: Sql, tokenHash: string) => {
	const rows = await sql`
		select *
		from certificate_handoffs
		where token_hash = ${tokenHash}
		limit 1
	`

	return rows[0] ? rowToRecord(rows[0]) : null
}

const updatePostgresStatus = async (
	sql: Sql,
	id: string,
	status: CertificateHandoffStatus,
	timestampField: 'opened_at' | 'revoked_at' | null = null,
	now: Date
) => {
	if (timestampField === 'opened_at') {
		await sql`
			update certificate_handoffs
			set status = ${status}, opened_at = ${now.toISOString()}
			where id = ${id}
		`
		return
	}

	if (timestampField === 'revoked_at') {
		await sql`
			update certificate_handoffs
			set status = ${status}, revoked_at = ${now.toISOString()}
			where id = ${id}
		`
		return
	}

	await sql`
		update certificate_handoffs
		set status = ${status}
		where id = ${id}
	`
}

const createRepositoryFromStore = (
	store: Map<string, CertificateHandoffRecord>
): CertificateHandoffRepository => {
	const findActiveByToken: CertificateHandoffRepository['findActiveByToken'] = async (
		token,
		options = {}
	) => {
		const tokenHash = hashCertificateHandoffToken(token)
		const record = store.get(tokenHash) ?? null

		if (!record) return null

		const status = normaliseStatus(record, options.now)
		if (status !== record.status) {
			store.set(tokenHash, { ...record, status })
		}

		if (status !== 'active' && status !== 'opened') {
			return null
		}

		return { ...record, status }
	}

	const updateStatus: CertificateHandoffRepository['updateStatus'] = async (
		id,
		status,
		now = new Date()
	) => {
		for (const [tokenHash, record] of store) {
			if (record.id !== id) continue

			store.set(tokenHash, {
				...record,
				status,
				openedAt: status === 'opened' ? now.toISOString() : record.openedAt,
				revokedAt: status === 'revoked' ? now.toISOString() : record.revokedAt
			})
			return
		}
	}

	return {
		create: async (input) => {
			const created = buildCertificateHandoffRecord(input)
			store.set(created.record.tokenHash, created.record)
			return created
		},
		findActiveByToken,
		markOpened: async (token, now = new Date()) => {
			const record = await findActiveByToken(token, { now })
			if (!record || record.status !== 'active') return record

			const opened: CertificateHandoffRecord = {
				...record,
				status: 'opened',
				openedAt: now.toISOString()
			}

			store.set(record.tokenHash, opened)
			return opened
		},
		updateStatus
	}
}

export const createInMemoryCertificateHandoffRepository = (): CertificateHandoffRepository =>
	createRepositoryFromStore(new Map())

export const createPostgresCertificateHandoffRepository = ({
	databaseUrl
}: PostgresCertificateHandoffRepositoryOptions): CertificateHandoffRepository => {
	const trimmedDatabaseUrl = databaseUrl.trim()

	if (!trimmedDatabaseUrl) {
		throw new Error('A database URL is required to create a certificate handoff repository.')
	}

	const sql = postgres(trimmedDatabaseUrl, {
		prepare: false,
		max: 1
	})

	const updateStatus: CertificateHandoffRepository['updateStatus'] = async (
		id,
		status,
		now = new Date()
	) => {
		await updatePostgresStatus(
			sql,
			id,
			status,
			status === 'opened' ? 'opened_at' : status === 'revoked' ? 'revoked_at' : null,
			now
		)
	}

	const findActiveByToken: CertificateHandoffRepository['findActiveByToken'] = async (
		token,
		options = {}
	) => {
		const tokenHash = hashCertificateHandoffToken(token)
		const record = await selectPostgresHandoffByTokenHash(sql, tokenHash)

		if (!record) return null

		const status = normaliseStatus(record, options.now)
		if (status !== record.status) {
			await updateStatus(record.id, status, options.now)
		}

		if (status !== 'active' && status !== 'opened') {
			return null
		}

		return { ...record, status }
	}

	return {
		create: async (input) => {
			const created = buildCertificateHandoffRecord(input)
			await insertPostgresHandoff(sql, created.record)
			return created
		},
		findActiveByToken,
		markOpened: async (token, now = new Date()) => {
			const record = await findActiveByToken(token, { now })
			if (!record || record.status !== 'active') return record

			await updateStatus(record.id, 'opened', now)

			return {
				...record,
				status: 'opened',
				openedAt: now.toISOString()
			}
		},
		updateStatus
	}
}

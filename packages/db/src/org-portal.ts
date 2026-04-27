import { createHash, randomBytes, randomUUID } from 'node:crypto'
import { isOrgRole, type OrgRole } from '@primer-paso/auth'
import type {
	CertificateDraft,
	CertificateIssueRequest,
	GeneratedCertificatePdf
} from '@primer-paso/certificate'
import postgres, { type JSONValue, type Sql, type TransactionSql } from 'postgres'
import {
	type CertificateHandoffConsent,
	type CertificateHandoffRecord,
	type CertificateHandoffStatus,
	hashCertificateHandoffToken
} from './certificate-handoffs'

export type OrganisationMemberStatus = 'invited' | 'active' | 'disabled'
export type CertificateHandoffReviewStatus = 'in_review' | 'ready_to_issue' | 'issued' | 'cancelled'

export interface OrganisationRecord {
	id: string
	name: string
	registrationNumber?: string
	nifCif?: string
	address?: string
	email?: string
	phone?: string
	entityType: 'public_administration' | 'third_sector_or_union'
	createdAt: string
	updatedAt: string
}

export interface OrganisationMemberRecord {
	id: string
	organisationId: string
	email: string
	name: string
	role: OrgRole
	status: OrganisationMemberStatus
	createdAt: string
	updatedAt: string
	disabledAt?: string
	disabledByMemberId?: string
}

export interface OrganisationAuditEventRecord {
	id: string
	organisationId?: string
	memberId?: string
	memberEmail?: string
	handoffId?: string
	reviewId?: string
	eventType: string
	eventData: Record<string, unknown>
	ipAddress?: string
	userAgent?: string
	createdAt: string
}

export interface OrganisationSessionRecord {
	id: string
	memberId: string
	sessionHash: string
	createdAt: string
	expiresAt: string
	lastSeenAt?: string
	revokedAt?: string
}

export interface ResolvedOrganisationSession {
	session: OrganisationSessionRecord
	member: OrganisationMemberRecord
	organisation: OrganisationRecord
}

export interface VerificationReview {
	passportOrIdentityDocumentChecked: boolean
	userInformationConfirmed: boolean
	vulnerabilityInformationReviewed: boolean
}

export interface CertificateHandoffReviewRecord {
	id: string
	handoffId: string
	organisationId: string
	reviewerMemberId: string
	status: CertificateHandoffReviewStatus
	draftSnapshot: CertificateDraft
	reviewedData: CertificateDraft
	verification?: VerificationReview
	createdAt: string
	updatedAt: string
	readyToIssueAt?: string
	issuedAt?: string
}

export interface IssuedCertificateRecord {
	id: string
	reviewId: string
	handoffId: string
	organisationId: string
	signerMemberId: string
	issueRequest: CertificateIssueRequest
	pdfBytes: Uint8Array
	filename: string
	contentType: 'application/pdf'
	createdAt: string
}

export interface CreateOrganisationSessionInput {
	memberId: string
	now?: Date
	ttlHours?: number
}

export interface CreatedOrganisationSession {
	token: string
	session: OrganisationSessionRecord
	member: OrganisationMemberRecord
}

export interface CreateAuditEventInput {
	organisationId?: string
	memberId?: string
	handoffId?: string
	reviewId?: string
	eventType: string
	eventData?: Record<string, unknown>
	ipAddress?: string
	userAgent?: string
	now?: Date
}

export interface CreateIssuedCertificateInput {
	reviewId: string
	handoffId: string
	organisationId: string
	signerMemberId: string
	issueRequest: CertificateIssueRequest
	pdf: GeneratedCertificatePdf
	now?: Date
}

export interface CreateOrganisationMemberInput {
	organisationId: string
	email: string
	name: string
	role: OrgRole
	now?: Date
}

export interface UpdateOrganisationMemberRoleInput {
	organisationId: string
	memberId: string
	role: OrgRole
	now?: Date
}

export interface DisableOrganisationMemberInput {
	organisationId: string
	memberId: string
	disabledByMemberId: string
	now?: Date
}

export class OrgPortalRepositoryError extends Error {
	constructor(
		message: string,
		public readonly code: 'not_found' | 'invalid_role' | 'last_admin' | 'duplicate_member'
	) {
		super(message)
	}
}

export interface CreateOrFindCertificateHandoffReviewInput {
	handoffId: string
	organisationId: string
	reviewerMemberId: string
	draftSnapshot: CertificateDraft
	reviewedData: CertificateDraft
	now?: Date
}

export interface UpdateCertificateHandoffReviewVerificationInput {
	reviewId: string
	verification: VerificationReview
	status: CertificateHandoffReviewStatus
	now?: Date
}

export interface OrgPortalRepository {
	findOrganisationById: (id: string) => Promise<OrganisationRecord | null>
	findOrganisationMemberById: (id: string) => Promise<OrganisationMemberRecord | null>
	findActiveOrganisationMemberByEmail: (email: string) => Promise<OrganisationMemberRecord | null>
	listOrganisationMembers: (organisationId: string) => Promise<OrganisationMemberRecord[]>
	createOrganisationMember: (
		input: CreateOrganisationMemberInput
	) => Promise<OrganisationMemberRecord>
	updateOrganisationMemberRole: (
		input: UpdateOrganisationMemberRoleInput
	) => Promise<OrganisationMemberRecord>
	disableOrganisationMember: (
		input: DisableOrganisationMemberInput
	) => Promise<OrganisationMemberRecord>
	createOrganisationSession: (
		input: CreateOrganisationSessionInput
	) => Promise<CreatedOrganisationSession | null>
	revokeOrganisationSessionsForMember: (memberId: string, now?: Date) => Promise<void>
	findActiveOrganisationSessionByToken: (
		token: string,
		now?: Date
	) => Promise<ResolvedOrganisationSession | null>
	revokeOrganisationSessionByToken: (token: string, now?: Date) => Promise<void>
	findActiveHandoffByToken: (token: string, now?: Date) => Promise<CertificateHandoffRecord | null>
	markHandoffOpened: (token: string, now?: Date) => Promise<CertificateHandoffRecord | null>
	createOrFindCertificateHandoffReview: (
		input: CreateOrFindCertificateHandoffReviewInput
	) => Promise<CertificateHandoffReviewRecord>
	findCertificateHandoffReviewById: (id: string) => Promise<CertificateHandoffReviewRecord | null>
	updateCertificateHandoffReviewVerification: (
		input: UpdateCertificateHandoffReviewVerificationInput
	) => Promise<CertificateHandoffReviewRecord | null>
	createIssuedCertificate: (input: CreateIssuedCertificateInput) => Promise<IssuedCertificateRecord>
	findIssuedCertificateByReviewId: (reviewId: string) => Promise<IssuedCertificateRecord | null>
	createAuditEvent: (input: CreateAuditEventInput) => Promise<void>
	listOrganisationAuditEvents: (
		organisationId: string,
		limit?: number
	) => Promise<OrganisationAuditEventRecord[]>
}

export interface PostgresOrgPortalRepositoryOptions {
	databaseUrl: string
}

const toBase64Url = (bytes: Uint8Array) =>
	Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')

const createSessionToken = () => toBase64Url(randomBytes(32))

const hashSessionToken = (token: string) => createHash('sha256').update(token).digest('hex')

const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000)

const toJsonValue = (value: unknown): JSONValue => value as JSONValue

const date = (value: unknown) => new Date(String(value)).toISOString()

const optionalDate = (value: unknown) => (value ? date(value) : undefined)

const optionalString = (value: unknown) => (value ? String(value) : undefined)

const isActiveHandoffStatus = (status: CertificateHandoffStatus) =>
	status === 'active' || status === 'opened'

const normaliseHandoffStatus = (
	record: CertificateHandoffRecord,
	now = new Date()
): CertificateHandoffStatus => {
	if (record.status === 'active' && new Date(record.expiresAt).getTime() <= now.getTime()) {
		return 'expired'
	}

	return record.status
}

const memberFromRow = (row: Record<string, unknown>): OrganisationMemberRecord => ({
	id: String(row.id),
	organisationId: String(row.organisation_id),
	email: String(row.email),
	name: String(row.name),
	role: String(row.role) as OrgRole,
	status: String(row.status) as OrganisationMemberStatus,
	createdAt: date(row.created_at),
	updatedAt: date(row.updated_at ?? row.created_at),
	disabledAt: optionalDate(row.disabled_at),
	disabledByMemberId: optionalString(row.disabled_by_member_id)
})

const organisationFromRow = (row: Record<string, unknown>): OrganisationRecord => ({
	id: String(row.id),
	name: String(row.name),
	registrationNumber: optionalString(row.registration_number),
	nifCif: optionalString(row.nif_cif),
	address: optionalString(row.address),
	email: optionalString(row.email),
	phone: optionalString(row.phone),
	entityType: String(row.entity_type) as OrganisationRecord['entityType'],
	createdAt: date(row.created_at),
	updatedAt: date(row.updated_at)
})

const handoffFromRow = (row: Record<string, unknown>): CertificateHandoffRecord => ({
	id: String(row.id),
	referenceCode: String(row.reference_code),
	tokenHash: String(row.token_hash),
	draft: row.draft as CertificateDraft,
	consent: row.consent as CertificateHandoffConsent,
	status: String(row.status) as CertificateHandoffStatus,
	createdAt: date(row.created_at),
	expiresAt: date(row.expires_at),
	createdFromSessionId: optionalString(row.created_from_session_id),
	openedAt: optionalDate(row.opened_at),
	revokedAt: optionalDate(row.revoked_at),
	issuedCertificateId: optionalString(row.issued_certificate_id)
})

const reviewFromRow = (row: Record<string, unknown>): CertificateHandoffReviewRecord => ({
	id: String(row.id),
	handoffId: String(row.handoff_id),
	organisationId: String(row.organisation_id),
	reviewerMemberId: String(row.reviewer_member_id),
	status: String(row.status) as CertificateHandoffReviewStatus,
	draftSnapshot: row.draft_snapshot as CertificateDraft,
	reviewedData: row.reviewed_data as CertificateDraft,
	verification: row.verification as VerificationReview | undefined,
	createdAt: date(row.created_at),
	updatedAt: date(row.updated_at),
	readyToIssueAt: optionalDate(row.ready_to_issue_at),
	issuedAt: optionalDate(row.issued_at)
})

const issuedCertificateFromRow = (row: Record<string, unknown>): IssuedCertificateRecord => ({
	id: String(row.id),
	reviewId: String(row.review_id),
	handoffId: String(row.handoff_id),
	organisationId: String(row.organisation_id),
	signerMemberId: String(row.signer_member_id),
	issueRequest: row.issue_request as CertificateIssueRequest,
	pdfBytes: new Uint8Array(row.pdf_bytes as Buffer),
	filename: String(row.filename),
	contentType: 'application/pdf',
	createdAt: date(row.created_at)
})

const auditEventFromRow = (row: Record<string, unknown>): OrganisationAuditEventRecord => ({
	id: String(row.id),
	organisationId: optionalString(row.organisation_id),
	memberId: optionalString(row.member_id),
	memberEmail: optionalString(row.member_email),
	handoffId: optionalString(row.handoff_id),
	reviewId: optionalString(row.review_id),
	eventType: String(row.event_type),
	eventData:
		row.event_data && typeof row.event_data === 'object'
			? (row.event_data as Record<string, unknown>)
			: {},
	ipAddress: optionalString(row.ip_address),
	userAgent: optionalString(row.user_agent),
	createdAt: date(row.created_at)
})

const findMemberById = async (sql: Sql, id: string) => {
	const rows = await sql`
		select *
		from organisation_members
		where id = ${id}
		limit 1
	`

	return rows[0] ? memberFromRow(rows[0]) : null
}

const findOrganisationById = async (sql: Sql, id: string) => {
	const rows = await sql`
		select *
		from organisations
		where id = ${id}
		limit 1
	`

	return rows[0] ? organisationFromRow(rows[0]) : null
}

const countActiveAdmins = async (sql: Sql | TransactionSql, organisationId: string) => {
	const rows = await sql`
		select count(*)::int as count
		from organisation_members
		where organisation_id = ${organisationId}
		and role = 'admin'
		and status = 'active'
	`
	return Number(rows[0]?.count ?? 0)
}

const findMemberForUpdate = async (
	sql: Sql | TransactionSql,
	organisationId: string,
	memberId: string
) => {
	const rows = await sql`
		select *
		from organisation_members
		where organisation_id = ${organisationId}
		and id = ${memberId}
		for update
	`
	return rows[0] ? memberFromRow(rows[0]) : null
}

const normaliseMemberEmail = (email: string) => email.trim().toLowerCase()
const normaliseMemberName = (name: string) => name.replace(/\s+/g, ' ').trim()

const findIssuedCertificateByReviewId = async (sql: Sql | TransactionSql, reviewId: string) => {
	const rows = await sql`
		select *
		from issued_certificates
		where review_id = ${reviewId}
		limit 1
	`

	return rows[0] ? issuedCertificateFromRow(rows[0]) : null
}

export const createPostgresOrgPortalRepository = ({
	databaseUrl
}: PostgresOrgPortalRepositoryOptions): OrgPortalRepository => {
	const trimmedDatabaseUrl = databaseUrl.trim()

	if (!trimmedDatabaseUrl) {
		throw new Error('A database URL is required to create an org portal repository.')
	}

	const sql = postgres(trimmedDatabaseUrl, {
		prepare: false,
		max: 1
	})

	const findActiveHandoffByToken: OrgPortalRepository['findActiveHandoffByToken'] = async (
		token,
		now = new Date()
	) => {
		const tokenHash = hashCertificateHandoffToken(token)
		const rows = await sql`
			select *
			from certificate_handoffs
			where token_hash = ${tokenHash}
			limit 1
		`

		if (!rows[0]) return null

		const record = handoffFromRow(rows[0])
		const status = normaliseHandoffStatus(record, now)

		if (status !== record.status) {
			await sql`
				update certificate_handoffs
				set status = ${status}
				where id = ${record.id}
			`
		}

		if (!isActiveHandoffStatus(status)) {
			return null
		}

		return { ...record, status }
	}

	return {
		findOrganisationById: (id) => findOrganisationById(sql, id),
		findOrganisationMemberById: (id) => findMemberById(sql, id),
		listOrganisationMembers: async (organisationId) => {
			const rows = await sql`
				select *
				from organisation_members
				where organisation_id = ${organisationId}
				order by
					case when status = 'active' then 0 when status = 'invited' then 1 else 2 end,
					lower(email) asc
			`
			return rows.map(memberFromRow)
		},
		createOrganisationMember: async ({ organisationId, email, name, role, now = new Date() }) => {
			if (!isOrgRole(role)) {
				throw new OrgPortalRepositoryError('Choose a valid organisation role.', 'invalid_role')
			}
			const normalisedEmail = normaliseMemberEmail(email)
			const normalisedName = normaliseMemberName(name)
			if (!normalisedEmail || !normalisedName) {
				throw new OrgPortalRepositoryError('Member name and email are required.', 'not_found')
			}
			try {
				const rows = await sql`
					insert into organisation_members (
						id,
						organisation_id,
						email,
						name,
						role,
						status,
						created_at,
						updated_at,
						disabled_at,
						disabled_by_member_id
					)
					values (
						${randomUUID()},
						${organisationId},
						${normalisedEmail},
						${normalisedName},
						${role},
						'active',
						${now.toISOString()},
						${now.toISOString()},
						null,
						null
					)
					on conflict (organisation_id, email) do update set
						name = excluded.name,
						role = excluded.role,
						status = 'active',
						updated_at = excluded.updated_at,
						disabled_at = null,
						disabled_by_member_id = null
					returning *
				`
				return memberFromRow(rows[0])
			} catch (error) {
				if (
					error &&
					typeof error === 'object' &&
					'code' in error &&
					(error as { code?: string }).code === '23505'
				) {
					throw new OrgPortalRepositoryError(
						'An active member with this email already exists.',
						'duplicate_member'
					)
				}
				throw error
			}
		},
		updateOrganisationMemberRole: async ({ organisationId, memberId, role, now = new Date() }) => {
			if (!isOrgRole(role)) {
				throw new OrgPortalRepositoryError('Choose a valid organisation role.', 'invalid_role')
			}
			return sql.begin(async (tx) => {
				const member = await findMemberForUpdate(tx, organisationId, memberId)
				if (!member) {
					throw new OrgPortalRepositoryError('Member not found.', 'not_found')
				}
				if (member.status === 'active' && member.role === 'admin' && role !== 'admin') {
					const activeAdmins = await countActiveAdmins(tx, organisationId)
					if (activeAdmins <= 1) {
						throw new OrgPortalRepositoryError(
							'An organisation must keep at least one active admin.',
							'last_admin'
						)
					}
				}
				const rows = await tx`
					update organisation_members
					set
						role = ${role},
						updated_at = ${now.toISOString()}
					where organisation_id = ${organisationId}
					and id = ${memberId}
					returning *
				`
				return memberFromRow(rows[0])
			})
		},
		disableOrganisationMember: async ({
			organisationId,
			memberId,
			disabledByMemberId,
			now = new Date()
		}) =>
			sql.begin(async (tx) => {
				const member = await findMemberForUpdate(tx, organisationId, memberId)
				if (!member) {
					throw new OrgPortalRepositoryError('Member not found.', 'not_found')
				}
				if (member.status === 'active' && member.role === 'admin') {
					const activeAdmins = await countActiveAdmins(tx, organisationId)
					if (activeAdmins <= 1) {
						throw new OrgPortalRepositoryError(
							'An organisation must keep at least one active admin.',
							'last_admin'
						)
					}
				}
				const rows = await tx`
					update organisation_members
					set
						status = 'disabled',
						updated_at = ${now.toISOString()},
						disabled_at = coalesce(disabled_at, ${now.toISOString()}),
						disabled_by_member_id = coalesce(disabled_by_member_id, ${disabledByMemberId})
					where organisation_id = ${organisationId}
					and id = ${memberId}
					returning *
				`
				await tx`
					update organisation_sessions
					set revoked_at = coalesce(revoked_at, ${now.toISOString()})
					where member_id = ${memberId}
				`
				return memberFromRow(rows[0])
			}),
		findActiveOrganisationMemberByEmail: async (email) => {
			const rows = await sql`
				select *
				from organisation_members
				where lower(email) = lower(${email})
				and status = 'active'
				limit 1
			`

			return rows[0] ? memberFromRow(rows[0]) : null
		},

		createOrganisationSession: async ({ memberId, now = new Date(), ttlHours = 8 }) => {
			const member = await findMemberById(sql, memberId)
			if (!member || member.status !== 'active') return null

			const token = createSessionToken()
			const sessionHash = hashSessionToken(token)
			const session: OrganisationSessionRecord = {
				id: randomUUID(),
				memberId,
				sessionHash,
				createdAt: now.toISOString(),
				expiresAt: addHours(now, ttlHours).toISOString()
			}

			await sql`
				insert into organisation_sessions (
					id,
					member_id,
					session_hash,
					created_at,
					expires_at
				)
				values (
					${session.id},
					${session.memberId},
					${session.sessionHash},
					${session.createdAt},
					${session.expiresAt}
				)
			`

			return { token, session, member }
		},
		revokeOrganisationSessionsForMember: async (memberId, now = new Date()) => {
			await sql`
				update organisation_sessions
				set revoked_at = coalesce(revoked_at, ${now.toISOString()})
				where member_id = ${memberId}
			`
		},

		findActiveOrganisationSessionByToken: async (token, now = new Date()) => {
			const sessionHash = hashSessionToken(token)
			const rows = await sql`
				select
					s.id as session_id,
					s.member_id,
					s.session_hash,
					s.created_at as session_created_at,
					s.expires_at,
					s.last_seen_at,
					s.revoked_at,
					m.id as member_id,
					m.organisation_id,
					m.email,
					m.name as member_name,
					m.role,
					m.status,
					m.created_at as member_created_at,
					o.id as organisation_id,
					o.name as organisation_name,
					o.registration_number,
					o.nif_cif,
					o.address,
					o.email as organisation_email,
					o.phone,
					o.entity_type,
					o.created_at as organisation_created_at,
					o.updated_at
				from organisation_sessions s
				join organisation_members m on m.id = s.member_id
				join organisations o on o.id = m.organisation_id
				where s.session_hash = ${sessionHash}
				and s.revoked_at is null
				and s.expires_at > ${now.toISOString()}
				and m.status = 'active'
				limit 1
			`

			const row = rows[0]
			if (!row) return null

			await sql`
				update organisation_sessions
				set last_seen_at = ${now.toISOString()}
				where session_hash = ${sessionHash}
			`

			return {
				session: {
					id: String(row.session_id),
					memberId: String(row.member_id),
					sessionHash: String(row.session_hash),
					createdAt: date(row.session_created_at),
					expiresAt: date(row.expires_at),
					lastSeenAt: optionalDate(row.last_seen_at),
					revokedAt: optionalDate(row.revoked_at)
				},
				member: {
					id: String(row.member_id),
					organisationId: String(row.organisation_id),
					email: String(row.email),
					name: String(row.member_name),
					role: String(row.role) as OrgRole,
					status: String(row.status) as OrganisationMemberStatus,
					createdAt: date(row.member_created_at),
					updatedAt: date(row.member_created_at),
					disabledAt: undefined,
					disabledByMemberId: undefined
				},
				organisation: {
					id: String(row.organisation_id),
					name: String(row.organisation_name),
					registrationNumber: optionalString(row.registration_number),
					nifCif: optionalString(row.nif_cif),
					address: optionalString(row.address),
					email: optionalString(row.organisation_email),
					phone: optionalString(row.phone),
					entityType: String(row.entity_type) as OrganisationRecord['entityType'],
					createdAt: date(row.organisation_created_at),
					updatedAt: date(row.updated_at)
				}
			}
		},

		revokeOrganisationSessionByToken: async (token, now = new Date()) => {
			await sql`
				update organisation_sessions
				set revoked_at = ${now.toISOString()}
				where session_hash = ${hashSessionToken(token)}
			`
		},

		findActiveHandoffByToken,

		markHandoffOpened: async (token, now = new Date()) => {
			const record = await findActiveHandoffByToken(token, now)
			if (!record) return null

			if (record.status === 'opened') {
				return record
			}

			await sql`
				update certificate_handoffs
				set status = 'opened', opened_at = ${now.toISOString()}
				where id = ${record.id}
			`

			return {
				...record,
				status: 'opened',
				openedAt: now.toISOString()
			}
		},

		createOrFindCertificateHandoffReview: async ({
			handoffId,
			organisationId,
			reviewerMemberId,
			draftSnapshot,
			reviewedData,
			now = new Date()
		}) => {
			const existing = await sql`
				select *
				from certificate_handoff_reviews
				where handoff_id = ${handoffId}
				and organisation_id = ${organisationId}
				limit 1
			`

			if (existing[0]) return reviewFromRow(existing[0])

			const id = randomUUID()
			const rows = await sql`
				insert into certificate_handoff_reviews (
					id,
					handoff_id,
					organisation_id,
					reviewer_member_id,
					status,
					draft_snapshot,
					reviewed_data,
					created_at,
					updated_at
				)
				values (
					${id},
					${handoffId},
					${organisationId},
					${reviewerMemberId},
					'in_review',
					${sql.json(toJsonValue(draftSnapshot))},
					${sql.json(toJsonValue(reviewedData))},
					${now.toISOString()},
					${now.toISOString()}
				)
				returning *
			`

			return reviewFromRow(rows[0])
		},

		findCertificateHandoffReviewById: async (id) => {
			const rows = await sql`
				select *
				from certificate_handoff_reviews
				where id = ${id}
				limit 1
			`

			return rows[0] ? reviewFromRow(rows[0]) : null
		},

		updateCertificateHandoffReviewVerification: async ({
			reviewId,
			verification,
			status,
			now = new Date()
		}) => {
			const readyToIssueAt = status === 'ready_to_issue' ? now.toISOString() : null
			const rows = await sql`
				update certificate_handoff_reviews
				set
					verification = ${sql.json(toJsonValue(verification))},
					status = ${status},
					updated_at = ${now.toISOString()},
					ready_to_issue_at = coalesce(ready_to_issue_at, ${readyToIssueAt})
				where id = ${reviewId}
				returning *
			`

			return rows[0] ? reviewFromRow(rows[0]) : null
		},

		createIssuedCertificate: async ({
			reviewId,
			handoffId,
			organisationId,
			signerMemberId,
			issueRequest,
			pdf,
			now = new Date()
		}) => {
			return sql.begin(async (tx) => {
				const existing = await findIssuedCertificateByReviewId(tx, reviewId)
				if (existing) return existing

				const id = randomUUID()
				const rows = await tx`
					insert into issued_certificates (
						id,
						review_id,
						handoff_id,
						organisation_id,
						signer_member_id,
						issue_request,
						pdf_bytes,
						filename,
						content_type,
						created_at
					)
					values (
						${id},
						${reviewId},
						${handoffId},
						${organisationId},
						${signerMemberId},
						${tx.json(toJsonValue(issueRequest))},
						${Buffer.from(pdf.bytes)},
						${pdf.filename},
						${pdf.contentType},
						${now.toISOString()}
					)
					returning *
				`

				await tx`
					update certificate_handoff_reviews
					set
						status = 'issued',
						updated_at = ${now.toISOString()},
						issued_at = coalesce(issued_at, ${now.toISOString()})
					where id = ${reviewId}
				`

				await tx`
					update certificate_handoffs
					set
						status = 'issued',
						issued_certificate_id = ${id}
					where id = ${handoffId}
				`

				return issuedCertificateFromRow(rows[0])
			})
		},

		findIssuedCertificateByReviewId: (reviewId) => findIssuedCertificateByReviewId(sql, reviewId),

		createAuditEvent: async ({
			organisationId,
			memberId,
			handoffId,
			reviewId,
			eventType,
			eventData = {},
			ipAddress,
			userAgent,
			now = new Date()
		}) => {
			await sql`
				insert into audit_events (
					id,
					organisation_id,
					member_id,
					handoff_id,
					review_id,
					event_type,
					event_data,
					ip_address,
					user_agent,
					created_at
				)
				values (
					${randomUUID()},
					${organisationId ?? null},
					${memberId ?? null},
					${handoffId ?? null},
					${reviewId ?? null},
					${eventType},
					${sql.json(toJsonValue(eventData))},
					${ipAddress ?? null},
					${userAgent ?? null},
					${now.toISOString()}
				)
			`
		},
		listOrganisationAuditEvents: async (organisationId, limit = 150) => {
			const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 500)
			const rows = await sql`
				select
					a.id,
					a.organisation_id,
					a.member_id,
					m.email as member_email,
					a.handoff_id,
					a.review_id,
					a.event_type,
					a.event_data,
					a.ip_address,
					a.user_agent,
					a.created_at
				from audit_events a
				left join organisation_members m on m.id = a.member_id
				where a.organisation_id = ${organisationId}
				order by a.created_at desc
				limit ${safeLimit}
			`
			return rows.map(auditEventFromRow)
		}
	}
}

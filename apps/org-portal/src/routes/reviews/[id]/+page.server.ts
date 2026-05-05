import {
	CERTIFICATE_DRAFT_REVIEW_FIELDS,
	type CertificateDraft,
	generateVulnerabilityCertificatePdf,
	getCertificateDraftReviewFieldValue,
	parseCertificateDraft,
	parseCertificateIssueRequest,
	VULNERABILITY_REASON_VALUES,
	validateCertificateDraft,
	withCertificateDraftReviewDataFromForm
} from '@primer-paso/certificate'
import type { CertificateCorrectionType, VerificationReview } from '@primer-paso/db'
import { signPdfWithOrganisationCertificate } from '@primer-paso/signing-client'
import { error, fail, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { vulnerabilityReasonLabel } from '$lib/labels'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import { decryptSigningSecret, decryptSigningText } from '$lib/server/signing-secret-crypto'
import type { Actions, PageServerLoad } from './$types'

const CORRECTION_TYPES = [
	'typo',
	'confirmed_with_applicant',
	'document_verified',
	'standardised_format',
	'other'
] as const satisfies readonly CertificateCorrectionType[]

const parseVerification = (formData: FormData) => ({
	passportOrIdentityDocumentChecked: formData.get('passportOrIdentityDocumentChecked') === 'yes',
	userInformationConfirmed: formData.get('userInformationConfirmed') === 'yes',
	vulnerabilityInformationReviewed: formData.get('vulnerabilityInformationReviewed') === 'yes'
})

const verificationComplete = (verification: ReturnType<typeof parseVerification>) =>
	verification.passportOrIdentityDocumentChecked &&
	verification.userInformationConfirmed &&
	verification.vulnerabilityInformationReviewed

const storedVerificationComplete = (verification: VerificationReview | undefined) =>
	Boolean(
		verification?.passportOrIdentityDocumentChecked &&
			verification?.userInformationConfirmed &&
			verification?.vulnerabilityInformationReviewed
	)

const getString = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim()

const getOptionalString = (formData: FormData, name: string) => {
	const value = getString(formData, name)
	return value.length > 0 ? value : undefined
}

const getCorrectionType = (formData: FormData): CertificateCorrectionType => {
	const value = String(formData.get('correctionType') ?? 'confirmed_with_applicant')
	return CORRECTION_TYPES.includes(value as CertificateCorrectionType)
		? (value as CertificateCorrectionType)
		: 'confirmed_with_applicant'
}

const valueChanged = (from: unknown, to: unknown) =>
	JSON.stringify(from ?? null) !== JSON.stringify(to ?? null)

const buildCorrections = (
	before: CertificateDraft,
	after: CertificateDraft,
	type: CertificateCorrectionType,
	note?: string
) =>
	CERTIFICATE_DRAFT_REVIEW_FIELDS.map((field) => ({
		fieldPath: field.path,
		from: getCertificateDraftReviewFieldValue(before, field.path) ?? null,
		to: getCertificateDraftReviewFieldValue(after, field.path) ?? null,
		type,
		note
	})).filter((correction) => valueChanged(correction.from, correction.to))

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = requirePermission(locals, 'handoff:review')
	const repository = getOrgPortalRepository()

	if (!repository) {
		error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
	}

	const review = await repository.findCertificateHandoffReviewById(params.id)

	if (!review || review.organisationId !== session.organisationId) {
		error(404, 'Revisión no encontrada.')
	}
	const issuedCertificate = await repository.findIssuedCertificateByReviewId(review.id)

	const draft = parseCertificateDraft(review.reviewedData)

	return {
		review: {
			id: review.id,
			status: review.status,
			createdAt: review.createdAt,
			updatedAt: review.updatedAt,
			verification: review.verification,
			draftSnapshot: parseCertificateDraft(review.draftSnapshot)
		},
		draft,
		vulnerabilityReasonOptions: VULNERABILITY_REASON_VALUES.map((value) => ({
			value,
			label: vulnerabilityReasonLabel(value)
		})),
		canMarkReadyToIssue: session.permissions.includes('certificate:prepare'),
		canIssueCertificate:
			session.permissions.includes('certificate:issue') &&
			review.status === 'ready_to_issue' &&
			!issuedCertificate,
		certificateHref: issuedCertificate ? `/reviews/${review.id}/certificate.pdf` : null
	}
}

export const actions: Actions = {
	updateReviewedData: async ({ request, params, locals }) => {
		const session = requirePermission(locals, 'handoff:review')
		const repository = getOrgPortalRepository()

		if (!repository) {
			error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)

		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Revisión no encontrada.')
		}

		if (review.status !== 'in_review') {
			return fail(400, {
				error: 'Solo se pueden corregir datos mientras la revisión está en curso.'
			})
		}

		const formData = await request.formData()
		const reviewedData = withCertificateDraftReviewDataFromForm(review.reviewedData, formData)
		const validation = validateCertificateDraft(reviewedData)

		if (!validation.ok) {
			return fail(400, {
				error: 'Revisa los datos corregidos del certificado.',
				issues: validation.issues
			})
		}

		const corrections = buildCorrections(
			review.reviewedData,
			validation.value,
			getCorrectionType(formData),
			getOptionalString(formData, 'correctionNote')
		)

		if (corrections.length === 0) {
			return fail(400, { error: 'No se ha modificado ningún dato.' })
		}

		if (formData.get('correctionsConfirmed') !== 'yes') {
			return fail(400, {
				error:
					'Confirma que la organización ha comprobado y asume responsabilidad por las modificaciones.'
			})
		}

		const updated = await repository.updateCertificateHandoffReviewReviewedData({
			reviewId: review.id,
			memberId: session.memberId,
			reviewedData: validation.value,
			corrections
		})

		if (!updated) {
			error(409, 'No se pudo actualizar la revisión.')
		}

		await writeAuditEvent({
			organisationId: review.organisationId,
			memberId: session.memberId,
			handoffId: review.handoffId,
			reviewId: review.id,
			eventType: 'certificate.review.corrected',
			eventData: {
				correctionType: getCorrectionType(formData),
				correctionNote: getOptionalString(formData, 'correctionNote'),
				verificationReset: true,
				changes: corrections.map(({ fieldPath, from, to, type }) => ({
					fieldPath,
					from,
					to,
					type
				}))
			},
			request
		})

		redirect(303, `/reviews/${review.id}`)
	},

	save: async ({ locals, params, request }) => {
		const session = requirePermission(locals, 'handoff:review')
		const repository = getOrgPortalRepository()

		if (!repository) {
			error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)
		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Revisión no encontrada.')
		}

		const verification = parseVerification(await request.formData())

		await repository.updateCertificateHandoffReviewVerification({
			reviewId: review.id,
			verification,
			status: 'in_review'
		})

		await writeAuditEvent({
			eventType: 'review.updated',
			organisationId: session.organisationId,
			memberId: session.memberId,
			handoffId: review.handoffId,
			reviewId: review.id,
			request
		})

		redirect(303, `/reviews/${review.id}`)
	},
	ready: async ({ locals, params, request }) => {
		const session = requirePermission(locals, 'certificate:prepare')
		const repository = getOrgPortalRepository()

		if (!repository) {
			error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)
		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Revisión no encontrada.')
		}

		const verification = parseVerification(await request.formData())
		if (!verificationComplete(verification)) {
			return fail(400, {
				error:
					'Completa todas las confirmaciones de verificación antes de marcar esta revisión como lista para emitir.',
				verification
			})
		}

		await repository.updateCertificateHandoffReviewVerification({
			reviewId: review.id,
			verification,
			status: 'ready_to_issue'
		})

		await writeAuditEvent({
			eventType: 'review.ready_to_issue',
			organisationId: session.organisationId,
			memberId: session.memberId,
			handoffId: review.handoffId,
			reviewId: review.id,
			request
		})

		redirect(303, `/reviews/${review.id}`)
	},
	issue: async ({ locals, params, request }) => {
		const session = requirePermission(locals, 'certificate:issue')
		const repository = getOrgPortalRepository()
		if (!repository) {
			error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)
		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Revisión no encontrada.')
		}

		if (review.status === 'issued') {
			redirect(303, `/reviews/${review.id}`)
		}

		if (review.status !== 'ready_to_issue') {
			return fail(400, {
				error: 'Esta revisión debe marcarse como lista para emitir antes de emitir el certificado.'
			})
		}

		if (!storedVerificationComplete(review.verification)) {
			return fail(400, {
				error: 'Completa todas las confirmaciones de verificación antes de emitir el certificado.'
			})
		}

		const organisation = await repository.findOrganisationById(session.organisationId)
		const signer = await repository.findOrganisationMemberById(session.memberId)
		if (!organisation || !signer || signer.organisationId !== organisation.id) {
			await writeAuditEvent({
				eventType: 'certificate.issue_failed',
				eventData: { reason: 'organisation_or_signer_not_found' },
				organisationId: session.organisationId,
				memberId: session.memberId,
				handoffId: review.handoffId,
				reviewId: review.id,
				request
			})
			error(409, 'No se pudieron resolver los datos de la organización o del firmante.')
		}

		const issuedAt = new Date().toISOString()
		const issueRequest = parseCertificateIssueRequest({
			draft: review.reviewedData,
			organisation: {
				id: organisation.id,
				name: organisation.name,
				registrationNumber: organisation.registrationNumber,
				nifCif: organisation.nifCif,
				address: organisation.address,
				email: organisation.email,
				phone: organisation.phone
			},
			signer: {
				id: signer.id,
				name: signer.name,
				role: signer.role,
				email: signer.email
			},
			verification: review.verification,
			issuedAt
		})

		const unsignedPdf = await generateVulnerabilityCertificatePdf(issueRequest)
		const signingCertificate = await repository.findActiveOrganisationSigningCertificate(
			session.organisationId
		)
		if (!signingCertificate) {
			await writeAuditEvent({
				eventType: 'certificate.issue_failed',
				eventData: { reason: 'organisation_signing_certificate_not_configured' },
				organisationId: session.organisationId,
				memberId: session.memberId,
				handoffId: review.handoffId,
				reviewId: review.id,
				request
			})
			return fail(400, {
				error: 'This organisation does not have a signing certificate configured.'
			})
		}
		let signedPdfBytes: Uint8Array
		let signedPdfSha256: string
		const signerUrl = env.PRIVATE_PDF_SIGNER_URL
		const signerToken = env.PRIVATE_PDF_SIGNER_TOKEN
		const signingCertEncryptionKey = env.PRIVATE_SIGNING_CERT_ENCRYPTION_KEY

		if (!signerUrl || !signerToken || !signingCertEncryptionKey) {
			await writeAuditEvent({
				eventType: 'certificate.issue_failed',
				eventData: { reason: 'pdf_signing_environment_not_configured' },
				organisationId: session.organisationId,
				memberId: session.memberId,
				handoffId: review.handoffId,
				reviewId: review.id,
				request
			})
			return fail(500, {
				error: 'PDF signing is not configured for this environment.'
			})
		}

		try {
			const pkcs12 = decryptSigningSecret(
				signingCertificate.encryptedPkcs12,
				signingCertEncryptionKey
			)
			const pkcs12Passphrase = decryptSigningText(
				signingCertificate.encryptedPassphrase,
				signingCertEncryptionKey
			)
			const signed = await signPdfWithOrganisationCertificate({
				serviceUrl: signerUrl,
				serviceToken: signerToken,
				unsignedPdf: unsignedPdf.bytes,
				pkcs12,
				pkcs12Passphrase,
				reason: 'Vulnerability certificate issuance',
				location: organisation.name
			})
			if (signed.certificateFingerprintSha256 !== signingCertificate.fingerprintSha256) {
				throw new Error('Signed PDF certificate fingerprint did not match configured certificate')
			}
			signedPdfBytes = signed.signedPdf
			signedPdfSha256 = signed.signedPdfSha256
		} catch (caught) {
			await writeAuditEvent({
				eventType: 'certificate.issue_failed',
				eventData: {
					reason: 'pdf_signing_failed',
					message: caught instanceof Error ? caught.message : 'Unknown signing error',
					signingCertificateId: signingCertificate.id,
					signingCertificateFingerprintSha256: signingCertificate.fingerprintSha256
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				handoffId: review.handoffId,
				reviewId: review.id,
				request
			})
			return fail(500, {
				error: 'The certificate PDF could not be signed.'
			})
		}
		const issuedCertificate = await repository.createIssuedCertificate({
			reviewId: review.id,
			handoffId: review.handoffId,
			organisationId: session.organisationId,
			signerMemberId: session.memberId,
			issueRequest,
			pdf: {
				...unsignedPdf,
				bytes: signedPdfBytes
			}
		})

		await writeAuditEvent({
			eventType: 'certificate.issued',
			eventData: {
				issuedCertificateId: issuedCertificate.id,
				filename: issuedCertificate.filename,
				signedPdfSha256,
				signingCertificateId: signingCertificate.id,
				signingCertificateFingerprintSha256: signingCertificate.fingerprintSha256
			},
			organisationId: session.organisationId,
			memberId: session.memberId,
			handoffId: review.handoffId,
			reviewId: review.id,
			request
		})

		redirect(303, `/reviews/${review.id}`)
	}
}

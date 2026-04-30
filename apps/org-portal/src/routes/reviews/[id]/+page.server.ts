import {
	generateVulnerabilityCertificatePdf,
	parseCertificateDraft,
	parseCertificateIssueRequest
} from '@primer-paso/certificate'
import type { VerificationReview } from '@primer-paso/db'
import { error, fail, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { Actions, PageServerLoad } from './$types'

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
			verification.userInformationConfirmed &&
			verification.vulnerabilityInformationReviewed
	)

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
			verification: review.verification
		},
		draft,
		canMarkReadyToIssue: session.permissions.includes('certificate:prepare'),
		canIssueCertificate:
			session.permissions.includes('certificate:issue') &&
			review.status === 'ready_to_issue' &&
			!issuedCertificate,
		certificateHref: issuedCertificate ? `/reviews/${review.id}/certificate.pdf` : null
	}
}

export const actions: Actions = {
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

		const pdf = await generateVulnerabilityCertificatePdf(issueRequest)
		const issuedCertificate = await repository.createIssuedCertificate({
			reviewId: review.id,
			handoffId: review.handoffId,
			organisationId: session.organisationId,
			signerMemberId: session.memberId,
			issueRequest,
			pdf
		})

		await writeAuditEvent({
			eventType: 'certificate.issued',
			eventData: {
				issuedCertificateId: issuedCertificate.id,
				filename: issuedCertificate.filename
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

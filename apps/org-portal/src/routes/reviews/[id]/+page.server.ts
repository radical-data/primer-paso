import { error, fail, redirect } from '@sveltejs/kit'
import { parseCertificateDraft } from '@primer-paso/certificate'
import { requirePermission } from '$lib/server/auth'
import { writeAuditEvent } from '$lib/server/audit'
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

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = requirePermission(locals, 'handoff:review')
	const repository = getOrgPortalRepository()

	if (!repository) {
		error(503, 'Organisation portal storage is not configured.')
	}

	const review = await repository.findCertificateHandoffReviewById(params.id)

	if (!review || review.organisationId !== session.organisationId) {
		error(404, 'Review not found.')
	}

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
		canMarkReadyToIssue: session.permissions.includes('certificate:prepare')
	}
}

export const actions: Actions = {
	save: async ({ locals, params, request }) => {
		const session = requirePermission(locals, 'handoff:review')
		const repository = getOrgPortalRepository()

		if (!repository) {
			error(503, 'Organisation portal storage is not configured.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)
		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Review not found.')
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
			error(503, 'Organisation portal storage is not configured.')
		}

		const review = await repository.findCertificateHandoffReviewById(params.id)
		if (!review || review.organisationId !== session.organisationId) {
			error(404, 'Review not found.')
		}

		const verification = parseVerification(await request.formData())
		if (!verificationComplete(verification)) {
			return fail(400, {
				error:
					'Complete every verification confirmation before marking this review ready to issue.',
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
	}
}

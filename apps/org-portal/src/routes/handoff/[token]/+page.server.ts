import {
	type CertificateApplicantConfirmation,
	parseCertificateDraft
} from '@primer-paso/certificate'
import type { CertificateHandoffRecord } from '@primer-paso/db'
import { error, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { PageServerLoad } from './$types'

const applicantConfirmationFromHandoff = (
	handoff: CertificateHandoffRecord | null | undefined
): CertificateApplicantConfirmation | undefined => {
	if (!handoff?.consent) return undefined
	return {
		informationAccurate: handoff.consent.informationAccurate,
		understandsNotIssuedByPrimerPaso: handoff.consent.understandsNotIssued,
		understandsOrganisationWillReview: true,
		consentsToDataUseForCertificate: handoff.consent.consentsToShareWithOrganisation,
		consentsToStoreForAuditAndIssue: false,
		method: 'public_handoff',
		confirmedAt: handoff.consent.createdAt
	}
}

export const load: PageServerLoad = async ({ locals, params, request }) => {
	const session = requirePermission(locals, 'handoff:open')
	const repository = getOrgPortalRepository()

	if (!repository) {
		throw error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
	}

	const handoff = await repository.findActiveHandoffByToken(params.token)

	if (!handoff) {
		await writeAuditEvent({
			eventType: 'handoff.open_failed',
			eventData: { reason: 'not_found_or_expired' },
			organisationId: session.organisationId,
			memberId: session.memberId,
			request
		})

		throw error(
			404,
			'No se pudo abrir este borrador. Puede haber caducado, haberse utilizado ya o el enlace puede ser incorrecto.'
		)
	}

	try {
		parseCertificateDraft(handoff.draft)
	} catch {
		await writeAuditEvent({
			eventType: 'handoff.invalid_draft',
			organisationId: session.organisationId,
			memberId: session.memberId,
			handoffId: handoff.id,
			request
		})

		throw error(422, 'Este enlace contiene un borrador de certificado no válido.')
	}

	const opened = await repository.markHandoffOpened(params.token)
	const review = await repository.createOrFindCertificateHandoffReview({
		handoffId: handoff.id,
		organisationId: session.organisationId,
		reviewerMemberId: session.memberId,
		draftSnapshot: handoff.draft,
		reviewedData: handoff.draft,
		applicantConfirmation: applicantConfirmationFromHandoff(handoff)
	})

	await writeAuditEvent({
		eventType: opened?.openedAt ? 'handoff.opened' : 'handoff.reopened',
		eventData: {
			referenceCode: handoff.referenceCode
		},
		organisationId: session.organisationId,
		memberId: session.memberId,
		handoffId: handoff.id,
		reviewId: review.id,
		request
	})

	throw redirect(303, `/certificates/review/${review.id}`)
}

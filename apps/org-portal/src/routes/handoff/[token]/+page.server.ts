import { parseCertificateDraft } from '@primer-paso/certificate'
import { error, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params, request }) => {
	const session = requirePermission(locals, 'handoff:open')
	const repository = getOrgPortalRepository()

	if (!repository) {
		error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
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

		error(
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

		error(422, 'Este enlace contiene un borrador de certificado no válido.')
	}

	const opened = await repository.markHandoffOpened(params.token)
	const review = await repository.createOrFindCertificateHandoffReview({
		handoffId: handoff.id,
		organisationId: session.organisationId,
		reviewerMemberId: session.memberId,
		draftSnapshot: handoff.draft,
		reviewedData: handoff.draft
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

	redirect(303, `/reviews/${review.id}`)
}

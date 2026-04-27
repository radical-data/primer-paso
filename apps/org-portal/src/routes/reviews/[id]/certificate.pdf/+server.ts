import { error } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals, params, request }) => {
	const session = requirePermission(locals, 'handoff:review')
	const repository = getOrgPortalRepository()
	if (!repository) {
		error(503, 'Organisation portal storage is not configured.')
	}

	const review = await repository.findCertificateHandoffReviewById(params.id)
	if (!review || review.organisationId !== session.organisationId) {
		error(404, 'Certificate not found.')
	}

	const issuedCertificate = await repository.findIssuedCertificateByReviewId(review.id)
	if (!issuedCertificate) {
		error(404, 'Certificate has not been issued yet.')
	}

	await writeAuditEvent({
		eventType: 'certificate.downloaded',
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

	const pdfBytes = Buffer.from(issuedCertificate.pdfBytes)
	const body = new Blob([pdfBytes], {
		type: issuedCertificate.contentType
	})

	return new Response(body, {
		headers: {
			'content-type': issuedCertificate.contentType,
			'content-disposition': `attachment; filename="${issuedCertificate.filename}"`,
			'content-length': String(body.size),
			'cache-control': 'no-store',
			'x-robots-tag': 'noindex, nofollow, noarchive',
			'x-content-type-options': 'nosniff'
		}
	})
}

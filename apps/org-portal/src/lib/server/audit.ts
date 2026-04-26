import { getOrgPortalRepository } from './repository'

export const writeAuditEvent = async ({
	eventType,
	eventData = {},
	organisationId,
	memberId,
	handoffId,
	reviewId,
	request
}: {
	eventType: string
	eventData?: Record<string, unknown>
	organisationId?: string
	memberId?: string
	handoffId?: string
	reviewId?: string
	request: Request
}) => {
	const repository = getOrgPortalRepository()
	if (!repository) return

	await repository.createAuditEvent({
		eventType,
		eventData,
		organisationId,
		memberId,
		handoffId,
		reviewId,
		ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
		userAgent: request.headers.get('user-agent') ?? undefined
	})
}

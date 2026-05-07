import {
	CERTIFICATE_DRAFT_VERSION,
	DOCUMENT_TYPE_VALUES,
	parseCertificateDraft,
	VULNERABILITY_REASON_VALUES
} from '@primer-paso/certificate'
import { error, fail, redirect } from '@sveltejs/kit'
import { documentTypeLabel, vulnerabilityReasonLabel } from '$lib/labels'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { Actions, PageServerLoad } from './$types'

const getString = (formData: FormData, name: string) => {
	const value = formData.get(name)
	return typeof value === 'string' ? value.trim() : ''
}

const getStringList = (formData: FormData, name: string) =>
	formData.getAll(name).filter((value): value is string => typeof value === 'string')

const emptyCertificateDraftFormValue = () => ({
	givenNames: '',
	familyNames: '',
	documentType: 'passport',
	documentNumber: '',
	dateOfBirth: '',
	nationality: '',
	email: '',
	phone: '',
	addressLine1: '',
	addressLine2: '',
	municipality: '',
	province: '',
	postalCode: '',
	vulnerabilityReasons: []
})

const buildOrganisationPortalDraft = (formData: FormData, now = new Date()) =>
	parseCertificateDraft({
		version: CERTIFICATE_DRAFT_VERSION,
		draftId: crypto.randomUUID(),
		userData: {
			identity: {
				givenNames: getString(formData, 'givenNames'),
				familyNames: getString(formData, 'familyNames'),
				documentType: getString(formData, 'documentType'),
				documentNumber: getString(formData, 'documentNumber'),
				dateOfBirth: getString(formData, 'dateOfBirth') || undefined,
				nationality: getString(formData, 'nationality') || undefined
			},
			contact: {
				email: getString(formData, 'email'),
				phone: getString(formData, 'phone') || undefined
			},
			location: {
				addressLine1: getString(formData, 'addressLine1'),
				addressLine2: getString(formData, 'addressLine2') || undefined,
				municipality: getString(formData, 'municipality'),
				province: getString(formData, 'province'),
				postalCode: getString(formData, 'postalCode') || undefined
			},
			vulnerability: {
				reasons: getStringList(formData, 'vulnerabilityReasons')
			}
		},
		metadata: {
			source: 'organisation-portal',
			locale: 'es',
			createdAt: now.toISOString()
		}
	})

export const load: PageServerLoad = ({ locals }) => {
	requirePermission(locals, 'certificate:prepare')
	return {
		formValue: emptyCertificateDraftFormValue(),
		documentTypeOptions: DOCUMENT_TYPE_VALUES.map((value) => ({
			value,
			label: documentTypeLabel(value)
		})),
		vulnerabilityReasonOptions: VULNERABILITY_REASON_VALUES.map((value) => ({
			value,
			label: vulnerabilityReasonLabel(value)
		}))
	}
}

export const actions: Actions = {
	create: async ({ locals, request }) => {
		const session = requirePermission(locals, 'certificate:prepare')
		const repository = getOrgPortalRepository()
		if (!repository) {
			throw error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
		}
		const formData = await request.formData()
		const now = new Date()
		let draft: ReturnType<typeof buildOrganisationPortalDraft>
		try {
			draft = buildOrganisationPortalDraft(formData, now)
		} catch {
			return fail(400, {
				error: 'Revisa los datos de la persona solicitante antes de continuar.'
			})
		}
		const review = await repository.createOrganisationCertificateReview({
			organisationId: session.organisationId,
			reviewerMemberId: session.memberId,
			draftSnapshot: draft,
			reviewedData: draft,
			applicantConfirmation: undefined,
			now
		})
		await writeAuditEvent({
			eventType: 'certificate_review.created_from_portal',
			eventData: {
				origin: review.origin
			},
			organisationId: session.organisationId,
			memberId: session.memberId,
			reviewId: review.id,
			request
		})
		throw redirect(303, `/certificates/review/${review.id}`)
	}
}

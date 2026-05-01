import { OrgPortalRepositoryError } from '@primer-paso/db'
import { inspectSigningCertificate } from '@primer-paso/signing-client'
import { error, fail, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import { encryptSigningSecret, encryptSigningText } from '$lib/server/signing-secret-crypto'
import type { Actions, PageServerLoad } from './$types'

const MAX_PKCS12_BYTES = 1024 * 1024
const ENTITY_TYPES = ['public_administration', 'third_sector_or_union'] as const

type EntityType = (typeof ENTITY_TYPES)[number]

const isEntityType = (value: string): value is EntityType =>
	ENTITY_TYPES.includes(value as EntityType)

const readString = (formData: FormData, key: string) =>
	String(formData.get(key) ?? '')
		.replace(/\s+/g, ' ')
		.trim()

const normaliseOptionalString = (value: string) => (value ? value : undefined)

const getRepositoryOrError = () => {
	const repository = getOrgPortalRepository()
	if (!repository) {
		error(503, 'El almacenamiento del portal de organizaciones no está configurado.')
	}
	return repository
}

const certificateFailureMessage = (caught: unknown) => {
	if (caught instanceof Error && caught.message.includes('HTTP 400')) {
		return 'No se pudo abrir el certificado. Comprueba que el archivo y la contraseña sean correctos.'
	}
	if (caught instanceof Error && caught.message.includes('HTTP 401')) {
		return 'El servicio interno de firma rechazó la validación del certificado.'
	}
	if (caught instanceof Error && caught.message.includes('HTTP 503')) {
		return 'El servicio interno de firma no está configurado.'
	}
	return 'No se pudo validar el certificado. Comprueba que el archivo y la contraseña sean correctos.'
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = requirePermission(locals, 'organisation:manage_profile')
	const repository = getRepositoryOrError()

	const [organisation, signingCertificate] = await Promise.all([
		repository.findOrganisationById(session.organisationId),
		repository.findActiveOrganisationSigningCertificate(session.organisationId)
	])

	if (!organisation) {
		error(404, 'Organización no encontrada.')
	}

	return {
		organisation,
		signingCertificate: signingCertificate
			? {
					id: signingCertificate.id,
					subject: signingCertificate.subject,
					issuer: signingCertificate.issuer,
					serialNumber: signingCertificate.serialNumber,
					fingerprintSha256: signingCertificate.fingerprintSha256,
					notBefore: signingCertificate.notBefore,
					notAfter: signingCertificate.notAfter,
					createdAt: signingCertificate.createdAt
				}
			: null
	}
}

export const actions: Actions = {
	profile: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_profile')
		const repository = getRepositoryOrError()
		const formData = await request.formData()

		const name = readString(formData, 'name')
		const entityType = readString(formData, 'entityType')
		const registrationNumber = readString(formData, 'registrationNumber')
		const nifCif = readString(formData, 'nifCif')
		const address = readString(formData, 'address')
		const email = readString(formData, 'email')
		const phone = readString(formData, 'phone')

		const value = {
			name,
			entityType,
			registrationNumber,
			nifCif,
			address,
			email,
			phone
		}

		if (!name) {
			return fail(400, {
				intent: 'profile',
				error: 'Introduce el nombre de la organización.',
				value
			})
		}

		if (!isEntityType(entityType)) {
			return fail(400, {
				intent: 'profile',
				error: 'Elige un tipo de entidad válido.',
				value
			})
		}

		if (email && !email.includes('@')) {
			return fail(400, {
				intent: 'profile',
				error: 'Introduce una dirección de correo electrónico válida.',
				value
			})
		}

		try {
			const organisation = await repository.updateOrganisationProfile({
				organisationId: session.organisationId,
				name,
				entityType,
				registrationNumber: normaliseOptionalString(registrationNumber),
				nifCif: normaliseOptionalString(nifCif),
				address: normaliseOptionalString(address),
				email: normaliseOptionalString(email),
				phone: normaliseOptionalString(phone)
			})

			await writeAuditEvent({
				eventType: 'organisation.profile_updated',
				eventData: {
					organisationId: organisation.id
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})
		} catch (caught) {
			return fail(400, {
				intent: 'profile',
				error:
					caught instanceof OrgPortalRepositoryError
						? 'No se encontró la organización.'
						: 'No se pudieron guardar los datos de la organización.',
				value
			})
		}

		redirect(303, '/admin/organisation')
	},

	certificate: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_profile')
		const repository = getRepositoryOrError()

		const signerUrl = env.PRIVATE_PDF_SIGNER_URL?.trim()
		const signerToken = env.PRIVATE_PDF_SIGNER_TOKEN?.trim()
		const encryptionKey = env.PRIVATE_SIGNING_CERT_ENCRYPTION_KEY?.trim()

		if (!signerUrl || !signerToken || !encryptionKey) {
			return fail(500, {
				intent: 'certificate',
				error: 'La validación de certificados de firma no está configurada.'
			})
		}

		const formData = await request.formData()
		const uploaded = formData.get('pkcs12')
		const passphrase = String(formData.get('passphrase') ?? '')
		const confirmed = formData.get('confirmSigningUse') === 'yes'

		if (!(uploaded instanceof File) || uploaded.size === 0) {
			return fail(400, {
				intent: 'certificate',
				error: 'Sube un certificado de firma en formato .p12 o .pfx.'
			})
		}

		if (uploaded.size > MAX_PKCS12_BYTES) {
			return fail(400, {
				intent: 'certificate',
				error: 'El certificado es demasiado grande. El tamaño máximo permitido es 1 MB.'
			})
		}

		const filename = uploaded.name.toLowerCase()
		if (!filename.endsWith('.p12') && !filename.endsWith('.pfx')) {
			return fail(400, {
				intent: 'certificate',
				error: 'El archivo debe tener extensión .p12 o .pfx.'
			})
		}

		if (!passphrase) {
			return fail(400, {
				intent: 'certificate',
				error: 'Introduce la contraseña del certificado.'
			})
		}

		if (!confirmed) {
			return fail(400, {
				intent: 'certificate',
				error: 'Confirma que este certificado se usará para firmar certificados emitidos.'
			})
		}

		try {
			const pkcs12 = new Uint8Array(await uploaded.arrayBuffer())
			const metadata = await inspectSigningCertificate({
				serviceUrl: signerUrl,
				serviceToken: signerToken,
				pkcs12,
				pkcs12Passphrase: passphrase
			})

			const now = new Date()
			if (metadata.notBefore && metadata.notBefore.getTime() > now.getTime()) {
				return fail(400, {
					intent: 'certificate',
					error: 'El certificado subido todavía no es válido.'
				})
			}

			if (metadata.notAfter && metadata.notAfter.getTime() <= now.getTime()) {
				return fail(400, {
					intent: 'certificate',
					error: 'El certificado subido está caducado.'
				})
			}

			const signingCertificate = await repository.replaceOrganisationSigningCertificate({
				organisationId: session.organisationId,
				createdByMemberId: session.memberId,
				encryptedPkcs12: encryptSigningSecret(pkcs12, encryptionKey),
				encryptedPassphrase: encryptSigningText(passphrase, encryptionKey),
				subject: metadata.signerSubject,
				issuer: metadata.signerIssuer,
				serialNumber: metadata.certificateSerialNumber,
				fingerprintSha256: metadata.certificateFingerprintSha256,
				notBefore: metadata.notBefore?.toISOString(),
				notAfter: metadata.notAfter?.toISOString()
			})

			await writeAuditEvent({
				eventType: 'organisation.signing_certificate_replaced',
				eventData: {
					signingCertificateId: signingCertificate.id,
					fingerprintSha256: signingCertificate.fingerprintSha256,
					subject: signingCertificate.subject,
					issuer: signingCertificate.issuer,
					notAfter: signingCertificate.notAfter
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})
		} catch (caught) {
			await writeAuditEvent({
				eventType: 'organisation.signing_certificate_replace_failed',
				eventData: {
					reason: 'certificate_validation_failed',
					message: caught instanceof Error ? caught.message : 'Unknown certificate validation error'
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})

			return fail(400, {
				intent: 'certificate',
				error: certificateFailureMessage(caught)
			})
		}

		redirect(303, '/admin/organisation')
	},

	disableCertificate: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_profile')
		const repository = getRepositoryOrError()
		const formData = await request.formData()
		const certificateId = readString(formData, 'certificateId')

		if (!certificateId) {
			return fail(400, {
				intent: 'disableCertificate',
				error: 'No se encontró el certificado de firma activo.'
			})
		}

		await repository.disableOrganisationSigningCertificate({
			organisationId: session.organisationId,
			certificateId
		})

		await writeAuditEvent({
			eventType: 'organisation.signing_certificate_disabled',
			eventData: {
				signingCertificateId: certificateId
			},
			organisationId: session.organisationId,
			memberId: session.memberId,
			request
		})

		redirect(303, '/admin/organisation')
	}
}

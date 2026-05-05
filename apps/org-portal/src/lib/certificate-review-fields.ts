import {
	CERTIFICATE_DRAFT_REVIEW_FIELDS,
	type CertificateDraftReviewFieldPath
} from '@primer-paso/certificate'

export type CertificateReviewFieldSection = 'identity' | 'contact' | 'location' | 'vulnerability'

export interface CertificateReviewFieldUi {
	label: string
	section: CertificateReviewFieldSection
	widget: 'text' | 'email' | 'date' | 'select' | 'checkbox-group'
}

export const certificateReviewFieldUi = {
	'userData.identity.givenNames': {
		label: 'Nombres',
		section: 'identity',
		widget: 'text'
	},
	'userData.identity.familyNames': {
		label: 'Apellidos',
		section: 'identity',
		widget: 'text'
	},
	'userData.identity.documentType': {
		label: 'Tipo de documento',
		section: 'identity',
		widget: 'select'
	},
	'userData.identity.documentNumber': {
		label: 'Número de documento',
		section: 'identity',
		widget: 'text'
	},
	'userData.identity.dateOfBirth': {
		label: 'Fecha de nacimiento',
		section: 'identity',
		widget: 'date'
	},
	'userData.identity.nationality': {
		label: 'Nacionalidad',
		section: 'identity',
		widget: 'text'
	},
	'userData.contact.email': {
		label: 'Correo electrónico',
		section: 'contact',
		widget: 'email'
	},
	'userData.contact.phone': {
		label: 'Teléfono',
		section: 'contact',
		widget: 'text'
	},
	'userData.location.addressLine1': {
		label: 'Dirección',
		section: 'location',
		widget: 'text'
	},
	'userData.location.addressLine2': {
		label: 'Dirección, línea 2',
		section: 'location',
		widget: 'text'
	},
	'userData.location.municipality': {
		label: 'Municipio',
		section: 'location',
		widget: 'text'
	},
	'userData.location.province': {
		label: 'Provincia',
		section: 'location',
		widget: 'text'
	},
	'userData.location.postalCode': {
		label: 'Código postal',
		section: 'location',
		widget: 'text'
	},
	'userData.vulnerability.reasons': {
		label: 'Circunstancias de vulnerabilidad',
		section: 'vulnerability',
		widget: 'checkbox-group'
	}
} as const satisfies Record<CertificateDraftReviewFieldPath, CertificateReviewFieldUi>

export const certificateReviewFields = CERTIFICATE_DRAFT_REVIEW_FIELDS.map((field) => ({
	...field,
	...certificateReviewFieldUi[field.path]
}))

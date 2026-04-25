export const CERTIFICATE_DRAFT_VERSION = 1

export const DOCUMENT_TYPE_VALUES = ['passport', 'national_id', 'travel_document', 'other'] as const
export type DocumentType = (typeof DOCUMENT_TYPE_VALUES)[number]

export const GENDER_MARKER_VALUES = ['female', 'male', 'non_binary', 'not_specified'] as const
export type GenderMarker = (typeof GENDER_MARKER_VALUES)[number]

export const VULNERABILITY_REASON_VALUES = [
	'family_responsibilities',
	'health_or_disability',
	'gender_based_violence',
	'homelessness_or_housing_insecurity',
	'labour_exploitation_or_abuse',
	'trafficking_or_exploitation_risk',
	'minor_or_dependant_support',
	'other'
] as const
export type VulnerabilityReason = (typeof VULNERABILITY_REASON_VALUES)[number]

export const LOCATION_EVIDENCE_TYPE_VALUES = [
	'padron',
	'housing_document',
	'health_record',
	'school_or_childcare_record',
	'organisation_letter',
	'other'
] as const
export type LocationEvidenceType = (typeof LOCATION_EVIDENCE_TYPE_VALUES)[number]

export interface PersonIdentity {
	givenNames: string
	familyNames: string
	documentType: DocumentType
	documentNumber: string
	dateOfBirth?: string
	nationality?: string
	genderMarker?: GenderMarker
}

export interface PersonContact {
	email: string
	phone?: string
	preferredLanguage?: string
}

export interface PersonLocation {
	addressLine1: string
	addressLine2?: string
	municipality: string
	province: string
	postalCode?: string
}

export interface LocationEvidence {
	type: LocationEvidenceType
	description?: string
	checkedByUser: boolean
}

export interface VulnerabilityStatement {
	reasons: VulnerabilityReason[]
	freeText?: string
}

export interface CertificateDraftUserData {
	identity: PersonIdentity
	contact: PersonContact
	location: PersonLocation
	locationEvidence: LocationEvidence[]
	vulnerability: VulnerabilityStatement
}

export interface CertificateDraftMetadata {
	source: 'primer-paso-public'
	locale: string
	createdAt: string
	expiresAt?: string
}

export interface CertificateDraft {
	version: typeof CERTIFICATE_DRAFT_VERSION
	draftId: string
	userData: CertificateDraftUserData
	metadata: CertificateDraftMetadata
}

export interface OrganisationIdentity {
	id: string
	name: string
	registrationNumber?: string
	address?: string
	email?: string
	phone?: string
}

export interface OrganisationSigner {
	id: string
	name: string
	role: string
	email: string
}

export interface VerificationChecks {
	passportOrIdentityDocumentChecked: boolean
	locationEvidenceChecked: boolean
	userInformationConfirmed: boolean
	vulnerabilityInformationReviewed: boolean
}

export interface CertificateIssueRequest {
	draft: CertificateDraft
	organisation: OrganisationIdentity
	signer: OrganisationSigner
	verification: VerificationChecks
	issuedAt: string
}

export interface GeneratedCertificatePdf {
	bytes: Uint8Array
	filename: string
	contentType: 'application/pdf'
}

export interface ValidationIssue {
	path: string
	message: string
}

export type ValidationResult<T> =
	| {
			ok: true
			value: T
			issues?: never
	  }
	| {
			ok: false
			value?: never
			issues: ValidationIssue[]
	  }

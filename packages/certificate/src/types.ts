export const CERTIFICATE_DRAFT_VERSION = 1

export const DOCUMENT_TYPE_VALUES = ['passport', 'national_id', 'travel_document', 'other'] as const
export type DocumentType = (typeof DOCUMENT_TYPE_VALUES)[number]

export const GENDER_MARKER_VALUES = ['female', 'male', 'non_binary', 'not_specified'] as const
export type GenderMarker = (typeof GENDER_MARKER_VALUES)[number]

export const VULNERABILITY_REASON_VALUES = [
	'social_isolation_or_lack_of_support_network',
	'homelessness_or_precarious_housing',
	'discrimination_or_social_exclusion',
	'insufficient_income',
	'poverty_or_economic_exclusion_risk',
	'difficulty_accessing_employment',
	'dependants',
	'vulnerable_family_unit',
	'single_parent_precarity',
	'psychosocial_risks',
	'exploitation_or_abuse'
] as const
export type VulnerabilityReason = (typeof VULNERABILITY_REASON_VALUES)[number]

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

export interface VulnerabilityStatement {
	reasons: VulnerabilityReason[]
}

export interface CertificateDraftUserData {
	identity: PersonIdentity
	contact: PersonContact
	location: PersonLocation
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
	nifCif?: string
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

import {
	CERTIFICATE_DRAFT_VERSION,
	type CertificateDraft,
	DOCUMENT_TYPE_VALUES,
	type DocumentType,
	VULNERABILITY_REASON_VALUES,
	type VulnerabilityReason
} from '@primer-paso/certificate'
import { PUBLIC_CERTIFICATE_HANDOFF_ENABLED } from '$env/static/public'
import type { JourneyAnswers, JourneyState } from '$lib/journey/types'

export const isCertificateHandoffEnabled = () => {
	return PUBLIC_CERTIFICATE_HANDOFF_ENABLED === 'true'
}

export interface PublicCertificateDraftFormValue {
	givenNames: string
	familyNames: string
	documentType: DocumentType | ''
	documentNumber: string
	dateOfBirth: string
	nationality: string
	email: string
	phone: string
	addressLine1: string
	addressLine2: string
	municipality: string
	province: string
	postalCode: string
	vulnerabilityReasons: string[]
}

export interface PublicCertificateConsent {
	informationAccurate: boolean
	understandsNotIssued: boolean
	consentsToShareWithOrganisation: boolean
	createdAt: string
}

export interface PublicCertificateDraftState {
	draft: CertificateDraft
	consent?: PublicCertificateConsent
}

export type PublicCertificateField =
	| 'givenNames'
	| 'familyNames'
	| 'documentType'
	| 'documentNumber'
	| 'email'
	| 'addressLine1'
	| 'municipality'
	| 'province'
	| 'vulnerabilityReasons'

export interface PublicCertificateValidationIssue {
	field: PublicCertificateField
	message: string
}

export interface PublicCertificateParseResult {
	ok: boolean
	value: PublicCertificateDraftFormValue
	issues: PublicCertificateValidationIssue[]
	draft?: CertificateDraft
}

export const emptyCertificateDraftFormValue = (
	answers: JourneyAnswers
): PublicCertificateDraftFormValue => ({
	givenNames: '',
	familyNames: '',
	documentType: '',
	documentNumber: '',
	dateOfBirth: '',
	nationality: '',
	email: '',
	phone: '',
	addressLine1: '',
	addressLine2: '',
	municipality: '',
	province: answers.province ?? '',
	postalCode: '',
	vulnerabilityReasons: mapJourneySupportToVulnerabilityReasons(answers)
})

export const certificateDraftToFormValue = (
	state: JourneyState
): PublicCertificateDraftFormValue => {
	const draft = state.certificateDraft?.draft

	if (!draft) {
		return emptyCertificateDraftFormValue(state.answers)
	}

	const { identity, contact, location, vulnerability } = draft.userData

	return {
		givenNames: identity.givenNames,
		familyNames: identity.familyNames,
		documentType: identity.documentType,
		documentNumber: identity.documentNumber,
		dateOfBirth: identity.dateOfBirth ?? '',
		nationality: identity.nationality ?? '',
		email: contact.email,
		phone: contact.phone ?? '',
		addressLine1: location.addressLine1,
		addressLine2: location.addressLine2 ?? '',
		municipality: location.municipality,
		province: location.province,
		postalCode: location.postalCode ?? '',
		vulnerabilityReasons: vulnerability.reasons
	}
}

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0

const getString = (formData: FormData, name: string) =>
	String(formData.get(name) ?? '')
		.replace(/\s+/g, ' ')
		.trim()

const getStringList = (formData: FormData, name: string) =>
	formData
		.getAll(name)
		.map(String)
		.map((value) => value.trim())
		.filter(Boolean)

const isDocumentType = (value: string): value is DocumentType =>
	DOCUMENT_TYPE_VALUES.includes(value as DocumentType)

const isVulnerabilityReason = (value: string): value is VulnerabilityReason =>
	VULNERABILITY_REASON_VALUES.includes(value as VulnerabilityReason)

const mapJourneySupportToVulnerabilityReasons = (answers: JourneyAnswers) => {
	const values = new Set<VulnerabilityReason>()
	const supportNeeds = answers.supportNeeds ?? []
	const familySituation = answers.familySituation ?? []

	if (
		supportNeeds.includes('child_or_dependant_support') ||
		familySituation.includes('child_under_18') ||
		familySituation.includes('adult_child_support_needs') ||
		familySituation.includes('mother_or_father')
	) {
		values.add('dependants')
		values.add('vulnerable_family_unit')
	}

	return [...values]
}

export const parsePublicCertificateDraftForm = (
	formData: FormData,
	state: JourneyState
): PublicCertificateParseResult => {
	const value: PublicCertificateDraftFormValue = {
		givenNames: getString(formData, 'givenNames'),
		familyNames: getString(formData, 'familyNames'),
		documentType: getString(formData, 'documentType') as DocumentType | '',
		documentNumber: getString(formData, 'documentNumber'),
		dateOfBirth: getString(formData, 'dateOfBirth'),
		nationality: getString(formData, 'nationality'),
		email: getString(formData, 'email'),
		phone: getString(formData, 'phone'),
		addressLine1: getString(formData, 'addressLine1'),
		addressLine2: getString(formData, 'addressLine2'),
		municipality: getString(formData, 'municipality'),
		province: getString(formData, 'province'),
		postalCode: getString(formData, 'postalCode'),
		vulnerabilityReasons: getStringList(formData, 'vulnerabilityReasons').filter(
			isVulnerabilityReason
		)
	}

	const issues: PublicCertificateValidationIssue[] = []

	if (!isNonEmptyString(value.givenNames)) {
		issues.push({ field: 'givenNames', message: 'Enter the person’s given names.' })
	}
	if (!isNonEmptyString(value.familyNames)) {
		issues.push({ field: 'familyNames', message: 'Enter the person’s family names.' })
	}
	if (!isDocumentType(value.documentType)) {
		issues.push({ field: 'documentType', message: 'Choose the identity document type.' })
	}
	if (!isNonEmptyString(value.documentNumber)) {
		issues.push({ field: 'documentNumber', message: 'Enter the identity document number.' })
	}
	if (!isNonEmptyString(value.email)) {
		issues.push({ field: 'email', message: 'Enter an email address.' })
	}
	if (!isNonEmptyString(value.addressLine1)) {
		issues.push({ field: 'addressLine1', message: 'Enter the person’s address.' })
	}
	if (!isNonEmptyString(value.municipality)) {
		issues.push({ field: 'municipality', message: 'Enter the municipality.' })
	}
	if (!isNonEmptyString(value.province)) {
		issues.push({ field: 'province', message: 'Enter the province.' })
	}
	if (value.vulnerabilityReasons.length === 0) {
		issues.push({
			field: 'vulnerabilityReasons',
			message: 'Choose at least one vulnerability circumstance.'
		})
	}

	if (issues.length > 0 || !isDocumentType(value.documentType)) {
		return { ok: false, value, issues }
	}

	const documentType = value.documentType
	const vulnerabilityReasonsTyped = value.vulnerabilityReasons.filter(isVulnerabilityReason)

	const draft: CertificateDraft = {
		version: CERTIFICATE_DRAFT_VERSION,
		draftId: state.certificateDraft?.draft?.draftId ?? crypto.randomUUID(),
		userData: {
			identity: {
				givenNames: value.givenNames,
				familyNames: value.familyNames,
				documentType,
				documentNumber: value.documentNumber,
				dateOfBirth: value.dateOfBirth || undefined,
				nationality: value.nationality || undefined
			},
			contact: {
				email: value.email,
				phone: value.phone || undefined,
				preferredLanguage: state.answers.language
			},
			location: {
				addressLine1: value.addressLine1,
				addressLine2: value.addressLine2 || undefined,
				municipality: value.municipality,
				province: value.province,
				postalCode: value.postalCode || undefined
			},
			vulnerability: {
				reasons: vulnerabilityReasonsTyped
			}
		},
		metadata: {
			source: 'primer-paso-public',
			locale: state.answers.language ?? 'es',
			createdAt: state.certificateDraft?.draft?.metadata.createdAt ?? new Date().toISOString(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
		}
	}

	return { ok: true, value, issues: [], draft }
}

export const parsePublicCertificateConsentForm = (
	formData: FormData
): PublicCertificateConsent | null => {
	const consent: PublicCertificateConsent = {
		informationAccurate: formData.get('informationAccurate') === 'yes',
		understandsNotIssued: formData.get('understandsNotIssued') === 'yes',
		consentsToShareWithOrganisation: formData.get('consentsToShareWithOrganisation') === 'yes',
		createdAt: new Date().toISOString()
	}

	return consent.informationAccurate &&
		consent.understandsNotIssued &&
		consent.consentsToShareWithOrganisation
		? consent
		: null
}

import {
	CERTIFICATE_DRAFT_VERSION,
	type CertificateDraft,
	type CertificateIssueRequest,
	DOCUMENT_TYPE_VALUES,
	GENDER_MARKER_VALUES,
	type ValidationIssue,
	type ValidationResult,
	VULNERABILITY_REASON_VALUES
} from './types'

type UnknownRecord = Record<string, unknown>

export interface FieldSchema {
	type: 'string' | 'boolean' | 'array' | 'object' | 'enum' | 'literal'
	required?: boolean
	values?: readonly string[] | readonly number[]
	description?: string
}

export interface ObjectSchema {
	[key: string]: FieldSchema | ObjectSchema
}

export const certificateDraftSchema = {
	version: {
		type: 'literal',
		required: true,
		values: [CERTIFICATE_DRAFT_VERSION],
		description: 'Certificate draft schema version.'
	},
	draftId: {
		type: 'string',
		required: true,
		description: 'Internal draft identifier. This is not the QR handoff token.'
	},
	userData: {
		identity: {
			givenNames: {
				type: 'string',
				required: true,
				description: 'Given names as shown on the identity document.'
			},
			familyNames: {
				type: 'string',
				required: true,
				description: 'Family names as shown on the identity document.'
			},
			documentType: {
				type: 'enum',
				required: true,
				values: DOCUMENT_TYPE_VALUES,
				description: 'Type of identity document checked by the organisation.'
			},
			documentNumber: {
				type: 'string',
				required: true,
				description: 'Identity document number.'
			},
			dateOfBirth: {
				type: 'string',
				description: 'Date of birth in YYYY-MM-DD format where known.'
			},
			nationality: {
				type: 'string',
				description: 'Nationality where relevant to the official template.'
			},
			genderMarker: {
				type: 'enum',
				values: GENDER_MARKER_VALUES,
				description: 'Optional gender marker, only where needed by the template.'
			}
		},
		contact: {
			email: {
				type: 'string',
				required: true,
				description: 'Email address where the issued PDF can be sent.'
			},
			phone: {
				type: 'string',
				description: 'Optional phone number.'
			},
			preferredLanguage: {
				type: 'string',
				description: 'Preferred language for support.'
			}
		},
		location: {
			addressLine1: {
				type: 'string',
				required: true,
				description: 'Primary address line.'
			},
			addressLine2: {
				type: 'string',
				description: 'Secondary address line.'
			},
			municipality: {
				type: 'string',
				required: true,
				description: 'Municipality.'
			},
			province: {
				type: 'string',
				required: true,
				description: 'Province.'
			},
			postalCode: {
				type: 'string',
				description: 'Postal code.'
			}
		},
		vulnerability: {
			reasons: {
				type: 'array',
				required: true,
				values: VULNERABILITY_REASON_VALUES,
				description: 'Broad vulnerability categories selected by the user.'
			}
		}
	},
	metadata: {
		source: {
			type: 'literal',
			required: true,
			values: ['primer-paso-public'],
			description: 'Source application that created the draft.'
		},
		locale: {
			type: 'string',
			required: true,
			description: 'Locale active when the draft was created.'
		},
		createdAt: {
			type: 'string',
			required: true,
			description: 'ISO timestamp when the draft was created.'
		},
		expiresAt: {
			type: 'string',
			description: 'Optional ISO timestamp after which the draft should not be used.'
		}
	}
} satisfies ObjectSchema

export const certificateIssueRequestSchema = {
	draft: certificateDraftSchema,
	organisation: {
		id: {
			type: 'string',
			required: true,
			description: 'Internal organisation identifier.'
		},
		name: {
			type: 'string',
			required: true,
			description: 'Organisation name to show on the issued certificate.'
		},
		registrationNumber: {
			type: 'string',
			description: 'Official or internal registration number where applicable.'
		},
		address: {
			type: 'string',
			description: 'Organisation address.'
		},
		email: {
			type: 'string',
			description: 'Organisation email address.'
		},
		phone: {
			type: 'string',
			description: 'Organisation phone number.'
		}
	},
	signer: {
		id: {
			type: 'string',
			required: true,
			description: 'Internal signer identifier.'
		},
		name: {
			type: 'string',
			required: true,
			description: 'Name of the person issuing or signing the certificate.'
		},
		role: {
			type: 'string',
			required: true,
			description: 'Role or position of the signer.'
		},
		email: {
			type: 'string',
			required: true,
			description: 'Signer email address.'
		}
	},
	verification: {
		passportOrIdentityDocumentChecked: {
			type: 'boolean',
			required: true,
			description: 'The identity document was checked against the draft data.'
		},
		userInformationConfirmed: {
			type: 'boolean',
			required: true,
			description: 'The user confirmed the information before issue.'
		},
		vulnerabilityInformationReviewed: {
			type: 'boolean',
			required: true,
			description: 'The vulnerability information was reviewed before issue.'
		}
	},
	issuedAt: {
		type: 'string',
		required: true,
		description: 'ISO timestamp when the organisation issued the certificate.'
	}
} satisfies ObjectSchema

const isRecord = (value: unknown): value is UnknownRecord =>
	Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === 'string' && value.trim().length > 0

const isIsoLikeDate = (value: string) => !Number.isNaN(Date.parse(value))

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((entry) => typeof entry === 'string')

const addRequiredStringIssue = (
	issues: ValidationIssue[],
	value: unknown,
	path: string,
	label: string
) => {
	if (!isNonEmptyString(value)) {
		issues.push({ path, message: `${label} is required.` })
	}
}

const addOptionalStringIssue = (
	issues: ValidationIssue[],
	value: unknown,
	path: string,
	label: string
) => {
	if (value !== undefined && typeof value !== 'string') {
		issues.push({ path, message: `${label} must be a string.` })
	}
}

const addEnumIssue = <T extends string>(
	issues: ValidationIssue[],
	value: unknown,
	values: readonly T[],
	path: string,
	label: string
): value is T => {
	if (typeof value !== 'string' || !values.includes(value as T)) {
		issues.push({ path, message: `${label} is not a recognised value.` })
		return false
	}

	return true
}

const addRequiredBooleanIssue = (
	issues: ValidationIssue[],
	value: unknown,
	path: string,
	label: string
) => {
	if (typeof value !== 'boolean') {
		issues.push({ path, message: `${label} must be true or false.` })
	}
}

const addIsoDateIssue = (
	issues: ValidationIssue[],
	value: unknown,
	path: string,
	label: string,
	required: boolean
) => {
	if (value === undefined && !required) return
	if (!isNonEmptyString(value) || !isIsoLikeDate(value)) {
		issues.push({ path, message: `${label} must be an ISO date or timestamp.` })
	}
}

export const validateCertificateDraft = (value: unknown): ValidationResult<CertificateDraft> => {
	const issues: ValidationIssue[] = []

	if (!isRecord(value)) {
		return { ok: false, issues: [{ path: '', message: 'Certificate draft must be an object.' }] }
	}

	if (value.version !== CERTIFICATE_DRAFT_VERSION) {
		issues.push({ path: 'version', message: `Version must be ${CERTIFICATE_DRAFT_VERSION}.` })
	}

	addRequiredStringIssue(issues, value.draftId, 'draftId', 'Draft ID')

	const userData = value.userData
	if (!isRecord(userData)) {
		issues.push({ path: 'userData', message: 'User data is required.' })
	} else {
		const identity = userData.identity
		if (!isRecord(identity)) {
			issues.push({ path: 'userData.identity', message: 'Identity information is required.' })
		} else {
			addRequiredStringIssue(
				issues,
				identity.givenNames,
				'userData.identity.givenNames',
				'Given names'
			)
			addRequiredStringIssue(
				issues,
				identity.familyNames,
				'userData.identity.familyNames',
				'Family names'
			)
			addEnumIssue(
				issues,
				identity.documentType,
				DOCUMENT_TYPE_VALUES,
				'userData.identity.documentType',
				'Document type'
			)
			addRequiredStringIssue(
				issues,
				identity.documentNumber,
				'userData.identity.documentNumber',
				'Document number'
			)
			addIsoDateIssue(
				issues,
				identity.dateOfBirth,
				'userData.identity.dateOfBirth',
				'Date of birth',
				false
			)
			addOptionalStringIssue(
				issues,
				identity.nationality,
				'userData.identity.nationality',
				'Nationality'
			)
			if (identity.genderMarker !== undefined) {
				addEnumIssue(
					issues,
					identity.genderMarker,
					GENDER_MARKER_VALUES,
					'userData.identity.genderMarker',
					'Gender marker'
				)
			}
		}

		const contact = userData.contact
		if (!isRecord(contact)) {
			issues.push({ path: 'userData.contact', message: 'Contact information is required.' })
		} else {
			addRequiredStringIssue(issues, contact.email, 'userData.contact.email', 'Email')
			addOptionalStringIssue(issues, contact.phone, 'userData.contact.phone', 'Phone')
			addOptionalStringIssue(
				issues,
				contact.preferredLanguage,
				'userData.contact.preferredLanguage',
				'Preferred language'
			)
		}

		const location = userData.location
		if (!isRecord(location)) {
			issues.push({ path: 'userData.location', message: 'Location information is required.' })
		} else {
			addRequiredStringIssue(
				issues,
				location.addressLine1,
				'userData.location.addressLine1',
				'Address line 1'
			)
			addOptionalStringIssue(
				issues,
				location.addressLine2,
				'userData.location.addressLine2',
				'Address line 2'
			)
			addRequiredStringIssue(
				issues,
				location.municipality,
				'userData.location.municipality',
				'Municipality'
			)
			addRequiredStringIssue(issues, location.province, 'userData.location.province', 'Province')
			addOptionalStringIssue(
				issues,
				location.postalCode,
				'userData.location.postalCode',
				'Postal code'
			)
		}

		const vulnerability = userData.vulnerability
		if (!isRecord(vulnerability)) {
			issues.push({
				path: 'userData.vulnerability',
				message: 'Vulnerability information is required.'
			})
		} else {
			const reasons = vulnerability.reasons
			if (!isStringArray(reasons) || reasons.length === 0) {
				issues.push({
					path: 'userData.vulnerability.reasons',
					message: 'At least one vulnerability reason is required.'
				})
			} else {
				reasons.forEach((reason, index) => {
					addEnumIssue(
						issues,
						reason,
						VULNERABILITY_REASON_VALUES,
						`userData.vulnerability.reasons.${index}`,
						'Vulnerability reason'
					)
				})
			}
		}
	}

	const metadata = value.metadata
	if (!isRecord(metadata)) {
		issues.push({ path: 'metadata', message: 'Metadata is required.' })
	} else {
		if (metadata.source !== 'primer-paso-public') {
			issues.push({ path: 'metadata.source', message: 'Source must be primer-paso-public.' })
		}
		addRequiredStringIssue(issues, metadata.locale, 'metadata.locale', 'Locale')
		addIsoDateIssue(issues, metadata.createdAt, 'metadata.createdAt', 'Created timestamp', true)
		addIsoDateIssue(issues, metadata.expiresAt, 'metadata.expiresAt', 'Expiry timestamp', false)
	}

	return issues.length === 0
		? { ok: true, value: value as unknown as CertificateDraft }
		: { ok: false, issues }
}

export const validateCertificateIssueRequest = (
	value: unknown
): ValidationResult<CertificateIssueRequest> => {
	const issues: ValidationIssue[] = []

	if (!isRecord(value)) {
		return {
			ok: false,
			issues: [{ path: '', message: 'Certificate issue request must be an object.' }]
		}
	}

	const draft = validateCertificateDraft(value.draft)
	if (!draft.ok) {
		issues.push(...draft.issues.map((issue) => ({ ...issue, path: `draft.${issue.path}` })))
	}

	const organisation = value.organisation
	if (!isRecord(organisation)) {
		issues.push({ path: 'organisation', message: 'Organisation information is required.' })
	} else {
		addRequiredStringIssue(issues, organisation.id, 'organisation.id', 'Organisation ID')
		addRequiredStringIssue(issues, organisation.name, 'organisation.name', 'Organisation name')
		addOptionalStringIssue(
			issues,
			organisation.registrationNumber,
			'organisation.registrationNumber',
			'Organisation registration number'
		)
		addOptionalStringIssue(
			issues,
			organisation.address,
			'organisation.address',
			'Organisation address'
		)
		addOptionalStringIssue(issues, organisation.email, 'organisation.email', 'Organisation email')
		addOptionalStringIssue(issues, organisation.phone, 'organisation.phone', 'Organisation phone')
	}

	const signer = value.signer
	if (!isRecord(signer)) {
		issues.push({ path: 'signer', message: 'Signer information is required.' })
	} else {
		addRequiredStringIssue(issues, signer.id, 'signer.id', 'Signer ID')
		addRequiredStringIssue(issues, signer.name, 'signer.name', 'Signer name')
		addRequiredStringIssue(issues, signer.role, 'signer.role', 'Signer role')
		addRequiredStringIssue(issues, signer.email, 'signer.email', 'Signer email')
	}

	const verification = value.verification
	if (!isRecord(verification)) {
		issues.push({ path: 'verification', message: 'Verification checks are required.' })
	} else {
		addRequiredBooleanIssue(
			issues,
			verification.passportOrIdentityDocumentChecked,
			'verification.passportOrIdentityDocumentChecked',
			'Identity document check'
		)
		addRequiredBooleanIssue(
			issues,
			verification.userInformationConfirmed,
			'verification.userInformationConfirmed',
			'User information confirmation'
		)
		addRequiredBooleanIssue(
			issues,
			verification.vulnerabilityInformationReviewed,
			'verification.vulnerabilityInformationReviewed',
			'Vulnerability information review'
		)
	}

	addIsoDateIssue(issues, value.issuedAt, 'issuedAt', 'Issue timestamp', true)

	return issues.length === 0
		? { ok: true, value: value as unknown as CertificateIssueRequest }
		: { ok: false, issues }
}

export const parseCertificateDraft = (value: unknown): CertificateDraft => {
	const result = validateCertificateDraft(value)
	if (!result.ok) {
		throw new Error(result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n'))
	}
	return result.value
}

export const parseCertificateIssueRequest = (value: unknown): CertificateIssueRequest => {
	const result = validateCertificateIssueRequest(value)
	if (!result.ok) {
		throw new Error(result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n'))
	}
	return result.value
}

export const isCertificateDraft = (value: unknown): value is CertificateDraft =>
	validateCertificateDraft(value).ok

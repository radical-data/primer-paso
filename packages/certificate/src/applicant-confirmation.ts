export const CERTIFICATE_APPLICANT_CONFIRMATION_METHOD_VALUES = [
	'public_handoff',
	'organisation_in_person',
	'organisation_phone_or_remote',
	'authorised_representative'
] as const

export type CertificateApplicantConfirmationMethod =
	(typeof CERTIFICATE_APPLICANT_CONFIRMATION_METHOD_VALUES)[number]

export interface CertificateApplicantConfirmation {
	informationAccurate: boolean
	understandsNotIssuedByPrimerPaso: boolean
	understandsOrganisationWillReview: boolean
	consentsToDataUseForCertificate: boolean
	consentsToStoreForAuditAndIssue: boolean
	method: CertificateApplicantConfirmationMethod
	confirmedAt: string
	confirmedByMemberId?: string
}

export const isCertificateApplicantConfirmationMethod = (
	value: unknown
): value is CertificateApplicantConfirmationMethod =>
	typeof value === 'string' &&
	CERTIFICATE_APPLICANT_CONFIRMATION_METHOD_VALUES.includes(
		value as CertificateApplicantConfirmationMethod
	)

export const applicantConfirmationComplete = (
	value: CertificateApplicantConfirmation | null | undefined
) =>
	Boolean(
		value?.informationAccurate &&
			value.understandsNotIssuedByPrimerPaso &&
			value.understandsOrganisationWillReview &&
			value.consentsToDataUseForCertificate &&
			value.consentsToStoreForAuditAndIssue &&
			value.method
	)

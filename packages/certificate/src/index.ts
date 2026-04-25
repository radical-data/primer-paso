export const CERTIFICATE_PACKAGE_VERSION = '0.0.1'

export { generateVulnerabilityCertificatePdf } from './pdf'

export {
	certificateDraftSchema,
	certificateIssueRequestSchema,
	isCertificateDraft,
	parseCertificateDraft,
	parseCertificateIssueRequest,
	validateCertificateDraft,
	validateCertificateIssueRequest
} from './schema'
export {
	CERTIFICATE_SOURCE_TEMPLATE_FILENAME,
	CERTIFICATE_SOURCE_TEMPLATE_PACKAGE_PATH,
	CERTIFICATE_TEMPLATE_FILENAME,
	CERTIFICATE_TEMPLATE_PACKAGE_PATH,
	getCertificateSourceTemplatePackagePath,
	getCertificateTemplatePackagePath
} from './template'
export type * from './types'
export {
	CERTIFICATE_DRAFT_VERSION,
	DOCUMENT_TYPE_VALUES,
	VULNERABILITY_REASON_VALUES
} from './types'

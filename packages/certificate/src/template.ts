export const CERTIFICATE_TEMPLATE_FILENAME = 'certificado-vulnerabilidad.pdf'
export const CERTIFICATE_SOURCE_TEMPLATE_FILENAME = 'certificado-vulnerabilidad.source.pdf'

export const CERTIFICATE_TEMPLATE_PACKAGE_PATH = `templates/${CERTIFICATE_TEMPLATE_FILENAME}`
export const CERTIFICATE_SOURCE_TEMPLATE_PACKAGE_PATH = `templates/${CERTIFICATE_SOURCE_TEMPLATE_FILENAME}`

export const getCertificateTemplatePackagePath = () => CERTIFICATE_TEMPLATE_PACKAGE_PATH
export const getCertificateSourceTemplatePackagePath = () =>
	CERTIFICATE_SOURCE_TEMPLATE_PACKAGE_PATH

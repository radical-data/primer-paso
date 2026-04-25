import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { CERTIFICATE_TEMPLATE_PACKAGE_PATH } from './template'
import type { CertificateIssueRequest, GeneratedCertificatePdf, VulnerabilityReason } from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const templatePath = path.join(packageRoot, CERTIFICATE_TEMPLATE_PACKAGE_PATH)

const formatDate = (value: string) =>
	new Intl.DateTimeFormat('es-ES', {
		timeZone: 'Europe/Madrid',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(new Date(value))

const setText = (
	form: ReturnType<PDFDocument['getForm']>,
	name: string,
	value: string | undefined
) => {
	form.getTextField(name).setText(value ?? '')
}

const setCheck = (form: ReturnType<PDFDocument['getForm']>, name: string, checked: boolean) => {
	const field = form.getCheckBox(name)
	if (checked) {
		field.check()
	} else {
		field.uncheck()
	}
}

const hasReason = (reasons: VulnerabilityReason[], reason: VulnerabilityReason) =>
	reasons.includes(reason)

export const generateVulnerabilityCertificatePdf = async (
	issueRequest: CertificateIssueRequest
): Promise<GeneratedCertificatePdf> => {
	const templateBytes = await readFile(templatePath)
	const pdf = await PDFDocument.load(templateBytes, { updateMetadata: false })
	const font = await pdf.embedFont(StandardFonts.Helvetica)
	const form = pdf.getForm()
	const { identity, contact, location, vulnerability } = issueRequest.draft.userData

	setText(form, 'organisation.name', issueRequest.organisation.name)
	setText(form, 'organisation.nifCif', issueRequest.organisation.registrationNumber)
	setText(form, 'organisation.registrationNumber', issueRequest.organisation.registrationNumber)
	setText(form, 'organisation.address', issueRequest.organisation.address)
	setText(
		form,
		'organisation.phoneEmail',
		[issueRequest.organisation.phone, issueRequest.organisation.email].filter(Boolean).join(' / ')
	)
	setCheck(form, 'organisation.type.publicAdministration', false)
	setCheck(form, 'organisation.type.thirdSectorOrUnion', true)
	setText(form, 'person.fullName', `${identity.givenNames} ${identity.familyNames}`)
	setText(form, 'person.identityDocumentNumber', identity.documentNumber)
	setText(form, 'person.dateOfBirth', identity.dateOfBirth ? formatDate(identity.dateOfBirth) : '')
	setText(form, 'person.nationality', identity.nationality)
	setText(
		form,
		'person.address',
		[location.addressLine1, location.addressLine2].filter(Boolean).join(', ')
	)
	setText(form, 'person.mobilePhone', contact.phone)
	setText(form, 'person.locality', location.municipality)
	setText(form, 'person.postalCode', location.postalCode)
	setText(form, 'person.province', location.province)

	const reasons = vulnerability.reasons
	setCheck(form, 'vulnerability.socialIsolation', false)
	setCheck(
		form,
		'vulnerability.homelessnessOrPrecariousHousing',
		hasReason(reasons, 'homelessness_or_housing_insecurity')
	)
	setCheck(form, 'vulnerability.discriminationOrSocialExclusion', false)
	setCheck(form, 'vulnerability.insufficientIncome', false)
	setCheck(form, 'vulnerability.povertyOrEconomicExclusionRisk', false)
	setCheck(form, 'vulnerability.difficultyAccessingEmployment', false)
	setCheck(form, 'vulnerability.dependants', hasReason(reasons, 'minor_or_dependant_support'))
	setCheck(
		form,
		'vulnerability.vulnerableFamilyUnit',
		hasReason(reasons, 'family_responsibilities')
	)
	setCheck(form, 'vulnerability.singleParentPrecarity', false)
	setCheck(form, 'vulnerability.psychosocialRisks', hasReason(reasons, 'health_or_disability'))
	setCheck(
		form,
		'vulnerability.exploitationOrAbuse',
		hasReason(reasons, 'labour_exploitation_or_abuse') ||
			hasReason(reasons, 'trafficking_or_exploitation_risk')
	)
	setCheck(form, 'vulnerability.other', hasReason(reasons, 'other'))
	setText(form, 'vulnerability.otherText', vulnerability.freeText)
	setText(
		form,
		'certificate.signerOrSeal',
		`${issueRequest.signer.name} - ${issueRequest.signer.role}`
	)
	setText(form, 'certificate.issuedAt', formatDate(issueRequest.issuedAt))

	form.updateFieldAppearances(font)
	form.flatten()

	pdf.setTitle('Certificado de vulnerabilidad')
	pdf.setSubject('Certificado de vulnerabilidad generado desde Primer Paso')
	pdf.setCreator('Primer Paso')
	pdf.setProducer('@primer-paso/certificate')

	const bytes = await pdf.save()
	return {
		bytes,
		filename: `certificado-vulnerabilidad-${issueRequest.draft.draftId}.pdf`,
		contentType: 'application/pdf'
	}
}

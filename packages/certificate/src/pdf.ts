import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { CERTIFICATE_TEMPLATE_PACKAGE_PATH } from './template'
import type { CertificateIssueRequest, GeneratedCertificatePdf, VulnerabilityReason } from './types'

// Avoid declaring a top-level `__dirname` here: Netlify's zip-it-and-ship-it
// injects a `let __dirname = ...` banner when bundling the SSR function, which
// would collide with a same-named top-level binding in this chunk and fail at
// parse time with `Identifier '__dirname' has already been declared`.
const packageRoot = path.resolve(import.meta.dirname, '..')
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
	setText(form, 'organisation.nifCif', issueRequest.organisation.nifCif)
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
	setCheck(
		form,
		'vulnerability.socialIsolation',
		hasReason(reasons, 'social_isolation_or_lack_of_support_network')
	)
	setCheck(
		form,
		'vulnerability.homelessnessOrPrecariousHousing',
		hasReason(reasons, 'homelessness_or_precarious_housing')
	)
	setCheck(
		form,
		'vulnerability.discriminationOrSocialExclusion',
		hasReason(reasons, 'discrimination_or_social_exclusion')
	)
	setCheck(form, 'vulnerability.insufficientIncome', hasReason(reasons, 'insufficient_income'))
	setCheck(
		form,
		'vulnerability.povertyOrEconomicExclusionRisk',
		hasReason(reasons, 'poverty_or_economic_exclusion_risk')
	)
	setCheck(
		form,
		'vulnerability.difficultyAccessingEmployment',
		hasReason(reasons, 'difficulty_accessing_employment')
	)
	setCheck(form, 'vulnerability.dependants', hasReason(reasons, 'dependants'))
	setCheck(form, 'vulnerability.vulnerableFamilyUnit', hasReason(reasons, 'vulnerable_family_unit'))
	setCheck(
		form,
		'vulnerability.singleParentPrecarity',
		hasReason(reasons, 'single_parent_precarity')
	)
	setCheck(form, 'vulnerability.psychosocialRisks', hasReason(reasons, 'psychosocial_risks'))
	setCheck(form, 'vulnerability.exploitationOrAbuse', hasReason(reasons, 'exploitation_or_abuse'))
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

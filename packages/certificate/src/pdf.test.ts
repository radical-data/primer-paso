import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/vulnerability-certificate.issue-request.fixture.json'
import { generateVulnerabilityCertificatePdf } from './pdf'
import { parseCertificateIssueRequest } from './schema'
import {
	CERTIFICATE_SOURCE_TEMPLATE_FILENAME,
	CERTIFICATE_SOURCE_TEMPLATE_PACKAGE_PATH,
	CERTIFICATE_TEMPLATE_FILENAME,
	CERTIFICATE_TEMPLATE_PACKAGE_PATH,
	getCertificateSourceTemplatePackagePath,
	getCertificateTemplatePackagePath
} from './template'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const templatePath = path.join(packageRoot, CERTIFICATE_TEMPLATE_PACKAGE_PATH)
const sourceTemplatePath = path.join(packageRoot, CERTIFICATE_SOURCE_TEMPLATE_PACKAGE_PATH)

describe('certificate PDF generation contract', () => {
	it('declares the official template package path', () => {
		expect(CERTIFICATE_TEMPLATE_FILENAME).toBe('certificado-vulnerabilidad.pdf')
		expect(getCertificateTemplatePackagePath()).toBe('templates/certificado-vulnerabilidad.pdf')
	})

	it('declares the source template package path', () => {
		expect(CERTIFICATE_SOURCE_TEMPLATE_FILENAME).toBe('certificado-vulnerabilidad.source.pdf')
		expect(getCertificateSourceTemplatePackagePath()).toBe(
			'templates/certificado-vulnerabilidad.source.pdf'
		)
	})

	it('has the official source PDF template committed', () => {
		expect(existsSync(sourceTemplatePath)).toBe(true)
	})

	it('has the fielded vulnerability certificate PDF template committed', () => {
		expect(existsSync(templatePath)).toBe(true)
	})

	it('adds the expected AcroForm fields to the runtime template', async () => {
		const pdf = await PDFDocument.load(readFileSync(templatePath))
		const fieldNames = pdf
			.getForm()
			.getFields()
			.map((field) => field.getName())

		expect(fieldNames).toEqual(
			expect.arrayContaining([
				'organisation.name',
				'organisation.nifCif',
				'organisation.type.publicAdministration',
				'organisation.type.thirdSectorOrUnion',
				'organisation.registrationNumber',
				'organisation.address',
				'organisation.phoneEmail',
				'person.fullName',
				'person.identityDocumentNumber',
				'person.dateOfBirth',
				'person.nationality',
				'person.address',
				'person.mobilePhone',
				'person.locality',
				'person.postalCode',
				'person.province',
				'vulnerability.socialIsolation',
				'vulnerability.homelessnessOrPrecariousHousing',
				'vulnerability.discriminationOrSocialExclusion',
				'vulnerability.insufficientIncome',
				'vulnerability.povertyOrEconomicExclusionRisk',
				'vulnerability.difficultyAccessingEmployment',
				'vulnerability.dependants',
				'vulnerability.vulnerableFamilyUnit',
				'vulnerability.singleParentPrecarity',
				'vulnerability.psychosocialRisks',
				'vulnerability.exploitationOrAbuse',
				'vulnerability.other',
				'vulnerability.otherText',
				'certificate.signerOrSeal',
				'certificate.issuedAt'
			])
		)
	})

	it('generates a PDF from fixture user, organisation, signer, and verification data', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)

		const generated = await generateVulnerabilityCertificatePdf(issueRequest)

		expect(generated.contentType).toBe('application/pdf')
		expect(generated.filename).toMatch(/certificado-vulnerabilidad/i)
		expect(generated.bytes.length).toBeGreaterThan(1000)
		expect(Buffer.from(generated.bytes.subarray(0, 5)).toString('utf8')).toBe('%PDF-')
	})

	it('sets inspectable PDF metadata for the generated certificate', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)

		const generated = await generateVulnerabilityCertificatePdf(issueRequest)
		const pdf = await PDFDocument.load(generated.bytes, { updateMetadata: false })

		expect(pdf.getTitle()).toBe('Certificado de vulnerabilidad')
		expect(pdf.getSubject()).toBe('Certificado de vulnerabilidad generado desde Primer Paso')
		expect(pdf.getCreator()).toBe('Primer Paso')
		expect(pdf.getProducer()).toContain('@primer-paso/certificate')
	})

	it('produces bytes different from the fielded template after filling and flattening', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)
		const templateBytes = readFileSync(templatePath)
		const generated = await generateVulnerabilityCertificatePdf(issueRequest)

		expect(Buffer.compare(Buffer.from(generated.bytes), templateBytes)).not.toBe(0)
	})

	it('preserves the two-page template layout', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)
		const generated = await generateVulnerabilityCertificatePdf(issueRequest)
		const pdf = await PDFDocument.load(generated.bytes, { updateMetadata: false })

		expect(pdf.getPageCount()).toBe(2)
	})
})

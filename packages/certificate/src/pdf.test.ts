import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import fixture from '../fixtures/vulnerability-certificate.issue-request.fixture.json'
import { generateVulnerabilityCertificatePdf } from './pdf'
import { parseCertificateIssueRequest } from './schema'
import {
	CERTIFICATE_TEMPLATE_FILENAME,
	CERTIFICATE_TEMPLATE_PACKAGE_PATH,
	getCertificateTemplatePackagePath
} from './template'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const templatePath = path.join(packageRoot, CERTIFICATE_TEMPLATE_PACKAGE_PATH)

describe('certificate PDF generation contract', () => {
	it('declares the official template package path', () => {
		expect(CERTIFICATE_TEMPLATE_FILENAME).toBe('certificado-vulnerabilidad.pdf')
		expect(getCertificateTemplatePackagePath()).toBe('templates/certificado-vulnerabilidad.pdf')
	})

	it('has the official vulnerability certificate PDF template committed', () => {
		expect(existsSync(templatePath)).toBe(true)
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
		const pdf = await PDFDocument.load(generated.bytes)

		expect(pdf.getTitle()).toContain('Certificado de vulnerabilidad')
		expect(pdf.getTitle()).toContain(issueRequest.draft.draftId)
		expect(pdf.getSubject()).toBe('Certificado de vulnerabilidad generado por Primer Paso')
		expect(pdf.getCreator()).toBe('Primer Paso')
		expect(pdf.getProducer()).toContain('pdf-lib')
		expect(pdf.getKeywords()).toContain('primer-paso')
		expect(pdf.getKeywords()).toContain('certificado-vulnerabilidad')
		expect(pdf.getKeywords()).toContain(issueRequest.draft.draftId)
	})

	it('draws overlay content by producing bytes different from the original template', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)
		const templateBytes = readFileSync(templatePath)
		const generated = await generateVulnerabilityCertificatePdf(issueRequest)

		expect(generated.bytes.length).toBeGreaterThan(templateBytes.length)
		expect(Buffer.compare(Buffer.from(generated.bytes), templateBytes)).not.toBe(0)
	})

	it('preserves at least one page from the template', async () => {
		const issueRequest = parseCertificateIssueRequest(fixture)
		const generated = await generateVulnerabilityCertificatePdf(issueRequest)
		const pdf = await PDFDocument.load(generated.bytes)

		expect(pdf.getPageCount()).toBeGreaterThanOrEqual(1)
	})
})

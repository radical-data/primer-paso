import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFDocument, type PDFFont, type PDFPage, rgb, StandardFonts } from 'pdf-lib'
import { CERTIFICATE_TEMPLATE_PACKAGE_PATH } from './template'
import type { CertificateIssueRequest, GeneratedCertificatePdf } from './types'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const templatePath = path.join(packageRoot, CERTIFICATE_TEMPLATE_PACKAGE_PATH)

const PAGE_MARGIN_X = 48
const PAGE_MARGIN_TOP = 54
const BODY_SIZE = 9
const HEADING_SIZE = 12
const TITLE_SIZE = 15
const LINE_GAP = 3
const CHECKBOX_SIZE = 8

interface DrawContext {
	page: PDFPage
	regularFont: PDFFont
	boldFont: PDFFont
	y: number
	contentWidth: number
}

const normaliseText = (value: string | undefined) =>
	(value ?? '')
		.replace(/\s+/g, ' ')
		.replace(/\u00a0/g, ' ')
		.trim()

const formatDate = (value: string | undefined) => {
	if (!value) return ''

	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) return value

	return new Intl.DateTimeFormat('es-ES', {
		timeZone: 'Europe/Madrid',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric'
	}).format(parsed)
}

const formatDateTime = (value: string) => {
	const parsed = new Date(value)
	if (Number.isNaN(parsed.getTime())) return value

	return new Intl.DateTimeFormat('es-ES', {
		timeZone: 'Europe/Madrid',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(parsed)
}

const formatAddress = (issueRequest: CertificateIssueRequest) => {
	const location = issueRequest.draft.userData.location
	return [
		location.addressLine1,
		location.addressLine2,
		[location.postalCode, location.municipality].filter(Boolean).join(' '),
		location.province
	]
		.map(normaliseText)
		.filter(Boolean)
		.join(', ')
}

const formatReference = (issueRequest: CertificateIssueRequest) =>
	`PP-${issueRequest.draft.draftId}-${issueRequest.organisation.id}`

const wrapText = (text: string, maxWidth: number, measure: (value: string) => number) => {
	const paragraphs = text.split(/\n+/)
	const lines: string[] = []

	for (const paragraph of paragraphs) {
		const clean = normaliseText(paragraph)
		if (!clean) {
			lines.push('')
			continue
		}

		const words = clean.split(/\s+/)
		let current = ''

		for (const word of words) {
			const candidate = current ? `${current} ${word}` : word
			if (!current || measure(candidate) <= maxWidth) {
				current = candidate
				continue
			}

			lines.push(current)
			current = word
		}

		if (current) {
			lines.push(current)
		}
	}

	return lines.length > 0 ? lines : ['']
}

const drawWrappedText = (
	context: DrawContext,
	text: string,
	options: {
		x?: number
		size?: number
		bold?: boolean
		maxWidth?: number
	}
) => {
	const size = options.size ?? BODY_SIZE
	const font = options.bold ? context.boldFont : context.regularFont
	const x = options.x ?? PAGE_MARGIN_X
	const maxWidth = options.maxWidth ?? context.contentWidth
	const lineHeight = size + LINE_GAP
	const lines = wrapText(text, maxWidth, (value) => font.widthOfTextAtSize(value, size))

	for (const line of lines) {
		context.page.drawText(line, {
			x,
			y: context.y,
			size,
			font,
			color: rgb(0.05, 0.05, 0.05)
		})
		context.y -= lineHeight
	}
}

const drawLabelValue = (context: DrawContext, label: string, value: string | undefined) => {
	const cleanValue = normaliseText(value)
	if (!cleanValue) return

	drawWrappedText(context, `${label}: ${cleanValue}`, {
		size: BODY_SIZE,
		maxWidth: context.contentWidth
	})
	context.y -= 2
}

const drawSectionTitle = (context: DrawContext, title: string) => {
	context.y -= 8
	drawWrappedText(context, title, {
		size: HEADING_SIZE,
		bold: true
	})
	context.y -= 2
}

const drawCheckbox = (context: DrawContext, label: string, checked: boolean) => {
	const x = PAGE_MARGIN_X
	const y = context.y - 1

	context.page.drawRectangle({
		x,
		y,
		width: CHECKBOX_SIZE,
		height: CHECKBOX_SIZE,
		borderWidth: 1,
		borderColor: rgb(0.05, 0.05, 0.05)
	})

	if (checked) {
		context.page.drawLine({
			start: { x: x + 1.5, y: y + 4 },
			end: { x: x + 3.5, y: y + 1.5 },
			thickness: 1.2,
			color: rgb(0.05, 0.05, 0.05)
		})
		context.page.drawLine({
			start: { x: x + 3.5, y: y + 1.5 },
			end: { x: x + 7, y: y + 7 },
			thickness: 1.2,
			color: rgb(0.05, 0.05, 0.05)
		})
	}

	drawWrappedText(context, label, {
		x: x + CHECKBOX_SIZE + 8,
		size: BODY_SIZE,
		maxWidth: context.contentWidth - CHECKBOX_SIZE - 8
	})
}

export const generateVulnerabilityCertificatePdf = async (
	issueRequest: CertificateIssueRequest
): Promise<GeneratedCertificatePdf> => {
	const templateBytes = await readFile(templatePath)
	const pdf = await PDFDocument.load(templateBytes)
	const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
	const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
	const page = pdf.getPages()[0] ?? pdf.addPage()
	const { width, height } = page.getSize()
	const reference = formatReference(issueRequest)

	pdf.setTitle(`Certificado de vulnerabilidad - ${reference}`)
	pdf.setSubject('Certificado de vulnerabilidad generado por Primer Paso')
	pdf.setCreator('Primer Paso')
	pdf.setProducer('@primer-paso/certificate')
	pdf.setKeywords([
		'primer-paso',
		'certificado-vulnerabilidad',
		issueRequest.draft.draftId,
		issueRequest.organisation.id
	])
	pdf.setCreationDate(new Date(issueRequest.issuedAt))
	pdf.setModificationDate(new Date(issueRequest.issuedAt))

	const context: DrawContext = {
		page,
		regularFont,
		boldFont,
		y: height - PAGE_MARGIN_TOP,
		contentWidth: width - PAGE_MARGIN_X * 2
	}

	drawWrappedText(context, 'Datos para certificado de vulnerabilidad', {
		size: TITLE_SIZE,
		bold: true
	})
	drawLabelValue(context, 'Referencia', reference)
	drawLabelValue(context, 'Fecha de emisión', formatDateTime(issueRequest.issuedAt))

	drawSectionTitle(context, 'Persona')
	const identity = issueRequest.draft.userData.identity
	drawLabelValue(context, 'Nombre', `${identity.givenNames} ${identity.familyNames}`)
	drawLabelValue(context, 'Documento', `${identity.documentType} ${identity.documentNumber}`)
	drawLabelValue(context, 'Fecha de nacimiento', formatDate(identity.dateOfBirth))
	drawLabelValue(context, 'Nacionalidad', identity.nationality)
	drawLabelValue(context, 'Dirección', formatAddress(issueRequest))
	drawLabelValue(context, 'Email', issueRequest.draft.userData.contact.email)
	drawLabelValue(context, 'Teléfono', issueRequest.draft.userData.contact.phone)

	drawSectionTitle(context, 'Entidad')
	drawLabelValue(context, 'Nombre', issueRequest.organisation.name)
	drawLabelValue(context, 'Registro', issueRequest.organisation.registrationNumber)
	drawLabelValue(context, 'Dirección', issueRequest.organisation.address)
	drawLabelValue(context, 'Email', issueRequest.organisation.email)
	drawLabelValue(context, 'Teléfono', issueRequest.organisation.phone)

	drawSectionTitle(context, 'Comprobaciones realizadas')
	drawCheckbox(
		context,
		'Documento de identidad o pasaporte comprobado',
		issueRequest.verification.passportOrIdentityDocumentChecked
	)
	drawCheckbox(
		context,
		'Evidencia de domicilio o permanencia comprobada',
		issueRequest.verification.locationEvidenceChecked
	)
	drawCheckbox(
		context,
		'Información de la persona confirmada',
		issueRequest.verification.userInformationConfirmed
	)
	drawCheckbox(
		context,
		'Información de vulnerabilidad revisada',
		issueRequest.verification.vulnerabilityInformationReviewed
	)

	drawSectionTitle(context, 'Motivos y contexto')
	drawLabelValue(context, 'Motivos', issueRequest.draft.userData.vulnerability.reasons.join(', '))
	drawLabelValue(context, 'Observaciones', issueRequest.draft.userData.vulnerability.freeText)

	drawSectionTitle(context, 'Firma')
	drawLabelValue(context, 'Persona firmante', issueRequest.signer.name)
	drawLabelValue(context, 'Cargo', issueRequest.signer.role)
	drawLabelValue(context, 'Email', issueRequest.signer.email)

	const bytes = await pdf.save({
		useObjectStreams: false
	})

	return {
		bytes,
		filename: `certificado-vulnerabilidad-${reference}.pdf`,
		contentType: 'application/pdf'
	}
}

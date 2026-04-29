import { PDFDocument, StandardFonts } from 'pdf-lib'
import { getTranslator, type Locale } from '$lib/content'
import type { HandoverPacket } from '$lib/server/handover'

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN_X = 44
const MARGIN_TOP = 46
const MARGIN_BOTTOM = 46
const BODY_SIZE = 10
const HEADING_SIZE = 14
const TITLE_SIZE = 18
const LINE_GAP = 3

const normaliseText = (value: string) =>
	value
		.replace(/\s+/g, ' ')
		.replace(/\u00a0/g, ' ')
		.trim()

const wrapText = (text: string, maxWidth: number, measure: (value: string) => number): string[] => {
	const paragraphs = text.split(/\n+/).map((line) => normaliseText(line))
	const lines: string[] = []

	for (const paragraph of paragraphs) {
		if (!paragraph) {
			lines.push('')
			continue
		}

		const words = paragraph.split(/\s+/)
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

const measureWrappedHeight = (
	text: string,
	maxWidth: number,
	size: number,
	measure: (value: string) => number
) => {
	const lineHeight = size + LINE_GAP
	const lines = wrapText(text, maxWidth, measure)
	return lines.length * lineHeight
}

export const buildHandoverPdf = async (
	packet: HandoverPacket,
	locale: Locale
): Promise<Uint8Array> => {
	const tt = getTranslator(locale)
	const pdf = await PDFDocument.create()
	const regularFont = await pdf.embedFont(StandardFonts.Helvetica)
	const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)

	const contentWidth = PAGE_WIDTH - MARGIN_X * 2
	const bodyLineHeight = BODY_SIZE + LINE_GAP
	const headingLineHeight = HEADING_SIZE + LINE_GAP
	const titleLineHeight = TITLE_SIZE + LINE_GAP

	let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
	let y = PAGE_HEIGHT - MARGIN_TOP

	const ensureSpace = (height: number) => {
		if (y - height >= MARGIN_BOTTOM) return
		page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
		y = PAGE_HEIGHT - MARGIN_TOP
	}

	const drawWrapped = (text: string, size = BODY_SIZE, isBold = false, indent = 0) => {
		const font = isBold ? boldFont : regularFont
		const lineHeight = size + LINE_GAP
		const maxWidth = contentWidth - indent
		const lines = wrapText(text, maxWidth, (value) => font.widthOfTextAtSize(value, size))

		ensureSpace(lines.length * lineHeight)

		for (const line of lines) {
			page.drawText(line, {
				x: MARGIN_X + indent,
				y,
				size,
				font
			})
			y -= lineHeight
		}
	}

	const drawWrappedBlock = (text: string, size = BODY_SIZE, isBold = false, indent = 0) => {
		const font = isBold ? boldFont : regularFont
		const lineHeight = size + LINE_GAP
		const maxWidth = contentWidth - indent
		const lines = wrapText(text, maxWidth, (value) => font.widthOfTextAtSize(value, size))

		ensureSpace(lines.length * lineHeight + 4)

		for (const line of lines) {
			page.drawText(line, {
				x: MARGIN_X + indent,
				y,
				size,
				font
			})
			y -= lineHeight
		}
	}

	const gap = (height: number) => {
		ensureSpace(height)
		y -= height
	}

	const drawSectionTitle = (title: string) => {
		ensureSpace(headingLineHeight + 8)
		page.drawText(title, {
			x: MARGIN_X,
			y,
			size: HEADING_SIZE,
			font: boldFont
		})
		y -= headingLineHeight
	}

	const drawList = (items: string[]) => {
		for (const item of items) {
			drawWrapped(`• ${item}`)
		}
	}

	const drawCompactListSection = (title: string, items: string[]) => {
		if (items.length === 0) return
		const firstItemHeight = measureWrappedHeight(
			`• ${items[0]}`,
			contentWidth,
			BODY_SIZE,
			(value) => regularFont.widthOfTextAtSize(value, BODY_SIZE)
		)
		ensureSpace(bodyLineHeight + firstItemHeight + 4)
		drawWrapped(title, BODY_SIZE, true)
		drawList(items)
		gap(2)
	}

	const drawAnswerRow = (label: string, value: string) => {
		const text = `${label}: ${value}`
		const height = measureWrappedHeight(text, contentWidth, BODY_SIZE, (entry) =>
			regularFont.widthOfTextAtSize(entry, BODY_SIZE)
		)
		ensureSpace(height + 2)
		drawWrapped(text)
		gap(1)
	}

	const drawReferenceRow = (label: string, value: string) => {
		const text = `${label}: ${value}`
		const height = measureWrappedHeight(text, contentWidth, BODY_SIZE, (entry) =>
			regularFont.widthOfTextAtSize(entry, BODY_SIZE)
		)
		ensureSpace(height)
		drawWrapped(text)
	}

	const generatedAt = new Date(packet.generatedAt).toLocaleString(locale, {
		timeZone: 'Europe/Madrid'
	})

	page.drawText(tt('pages.handover.title'), {
		x: MARGIN_X,
		y,
		size: TITLE_SIZE,
		font: boldFont
	})
	y -= titleLineHeight

	drawWrappedBlock(tt('pages.handover.body'))
	gap(2)
	drawWrapped(tt('pages.handover.reference', { sessionId: packet.sessionId }))
	drawWrapped(tt('pages.handover.generated_at', { generatedAt }))
	drawWrapped(tt('pages.handover.generated_by'))

	gap(10)
	drawSectionTitle(tt('pages.handover.summary_title'))
	drawWrapped(packet.resultTitle, BODY_SIZE, true)
	gap(1)
	drawWrapped(packet.eligibility)
	gap(4)
	drawWrapped(packet.routeBody)

	gap(10)
	const hasChecklistItems =
		packet.checklist.alreadyHave.length > 0 ||
		packet.checklist.stillNeed.length > 0 ||
		packet.checklist.discussWithSupport.length > 0 ||
		packet.checklist.unresolved.length > 0
	if (hasChecklistItems) {
		drawSectionTitle(tt('pages.handover.checklist_title'))
		drawCompactListSection(tt('pages.result.checklist.already_have'), packet.checklist.alreadyHave)
		drawCompactListSection(tt('pages.result.checklist.still_need'), packet.checklist.stillNeed)
		drawCompactListSection(
			tt('pages.result.checklist.discuss_with_support'),
			packet.checklist.discussWithSupport
		)
		drawCompactListSection(tt('pages.result.checklist.unresolved'), packet.checklist.unresolved)
	}

	drawSectionTitle(tt('pages.handover.answers_title'))
	for (const answer of packet.answers) {
		drawAnswerRow(answer.label, answer.value)
	}

	if (packet.flags.length > 0) {
		drawSectionTitle(tt('pages.handover.flags_title'))
		drawList(packet.flags)
	}

	drawSectionTitle(tt('pages.handover.links_title'))
	drawReferenceRow(tt('pages.handover.link.official_portal'), packet.officialPortalUrl)
	drawReferenceRow(tt('pages.handover.link.collaborators_pdf'), packet.collaboratorsPdfUrl)

	return pdf.save()
}

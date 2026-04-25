import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const outputDir = path.join(rootDir, 'apps', 'public', 'src', 'lib', 'generated')
const outputFile = path.join(outputDir, 'provinces.ts')

const SOURCE_URL = 'https://ine.es/daco/daco42/codmun/cod_provincia.htm'

const normaliseWhitespace = (value) => value.replace(/\s+/g, ' ').trim()

const htmlEntityMap = {
	nbsp: ' ',
	amp: '&',
	quot: '"',
	apos: "'",
	lt: '<',
	gt: '>',
	aacute: 'á',
	eacute: 'é',
	iacute: 'í',
	oacute: 'ó',
	uacute: 'ú',
	Aacute: 'Á',
	Eacute: 'É',
	Iacute: 'Í',
	Oacute: 'Ó',
	Uacute: 'Ú',
	agrave: 'à',
	egrave: 'è',
	igrave: 'ì',
	ograve: 'ò',
	ugrave: 'ù',
	Agrave: 'À',
	Egrave: 'È',
	Igrave: 'Ì',
	Ograve: 'Ò',
	Ugrave: 'Ù',
	acirc: 'â',
	ecirc: 'ê',
	icirc: 'î',
	ocirc: 'ô',
	ucirc: 'û',
	ntilde: 'ñ',
	Ntilde: 'Ñ',
	uuml: 'ü',
	Uuml: 'Ü',
	ccedil: 'ç',
	Ccedil: 'Ç'
}

const decodeHtml = (value) =>
	value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, entity) => {
		if (entity.startsWith('#x') || entity.startsWith('#X')) {
			const codePoint = Number.parseInt(entity.slice(2), 16)
			return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
		}

		if (entity.startsWith('#')) {
			const codePoint = Number.parseInt(entity.slice(1), 10)
			return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint)
		}

		return htmlEntityMap[entity] ?? match
	})

const getCharset = (contentType) => {
	const match = contentType?.match(/charset=([^;]+)/i)
	return match?.[1]?.trim().toLowerCase() ?? null
}

const decodeResponse = async (response) => {
	const buffer = await response.arrayBuffer()
	const contentType = response.headers.get('content-type')
	const charset = getCharset(contentType)

	const candidates = [charset, 'iso-8859-1', 'windows-1252', 'utf-8'].filter(Boolean)

	for (const candidate of candidates) {
		try {
			return new TextDecoder(candidate).decode(buffer)
		} catch {
			// try next
		}
	}

	throw new Error(`Could not decode response from ${SOURCE_URL}`)
}

const parseFromTableRows = (html) => {
	const matches = [
		...html.matchAll(
			/<tr[^>]*>\s*<td[^>]*>\s*(\d{2})\s*<\/td>\s*<td[^>]*>\s*([^<]+?)\s*<\/td>\s*<\/tr>/gims
		)
	]

	return matches.map((match) => ({
		code: match[1],
		name: normaliseWhitespace(decodeHtml(match[2]))
	}))
}

const parseFromTextFallback = (html) => {
	const text = decodeHtml(html.replace(/<[^>]+>/g, ' '))
	const matches = [...text.matchAll(/\b(\d{2})\s+(.+?)(?=\s+\d{2}\s+|$)/g)]

	return matches.map((match) => ({
		code: match[1],
		name: normaliseWhitespace(match[2])
	}))
}

const main = async () => {
	const response = await fetch(SOURCE_URL, {
		headers: {
			'User-Agent': 'primer-paso province generator'
		}
	})

	if (!response.ok) {
		throw new Error(`Failed to fetch province list: ${response.status} ${response.statusText}`)
	}

	const html = await decodeResponse(response)

	let provinces = parseFromTableRows(html)
	if (provinces.length === 0) {
		provinces = parseFromTextFallback(html)
	}

	const deduped = []
	const seen = new Set()

	for (const province of provinces) {
		if (!seen.has(province.code)) {
			seen.add(province.code)
			deduped.push(province)
		}
	}

	deduped.sort((a, b) => a.code.localeCompare(b.code))

	if (deduped.length !== 52) {
		throw new Error(`Expected 52 provinces/cities, got ${deduped.length}`)
	}

	const fileContents = `export const provinces = ${JSON.stringify(deduped, null, '\t')} as const

export type ProvinceValue = (typeof provinces)[number]['code']
export const PROVINCE_VALUES = provinces.map((province) => province.code) as ProvinceValue[]
export const provinceLabelByCode = Object.fromEntries(
	provinces.map((province) => [province.code, province.name])
) as Record<ProvinceValue, (typeof provinces)[number]['name']>
`

	await mkdir(outputDir, { recursive: true })
	await writeFile(outputFile, fileContents)

	console.log(`Wrote ${outputFile}`)
}

main().catch((error) => {
	console.error(error)
	process.exit(1)
})

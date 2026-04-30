import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

import { basename, dirname, resolve } from 'node:path'

const DEFAULT_INPUT_PDF = 'packages/certificate/vulnerability-certificate.pdf'

const DEFAULT_CERT_PATH = 'packages/signing-client/fixtures/test-organisation-signing-cert.p12'

const DEFAULT_OUTPUT_PDF = 'tmp/signed-vulnerability-certificate.pdf'

const DEFAULT_PASSPHRASE_PATH =
	'packages/signing-client/fixtures/test-organisation-signing-cert.passphrase.txt'

const args = parseArgs(process.argv.slice(2))

const inputPdfPath = args.input ?? DEFAULT_INPUT_PDF

const certPath = args.cert ?? DEFAULT_CERT_PATH

const outputPdfPath = args.output ?? DEFAULT_OUTPUT_PDF

const shouldReadDefaultPassphrase = certPath === DEFAULT_CERT_PATH

const passphrase =
	args.passphrase ??
	process.env.PKCS12_PASSPHRASE ??
	(shouldReadDefaultPassphrase ? (await readOptionalText(DEFAULT_PASSPHRASE_PATH))?.trim() : null)

const serviceUrl = (
	args.serviceUrl ??
	process.env.PRIVATE_PDF_SIGNER_URL ??
	'http://127.0.0.1:8080'
).replace(/\/+$/, '')

const serviceToken =
	args.serviceToken ?? process.env.PRIVATE_PDF_SIGNER_TOKEN ?? process.env.PDF_SIGNER_TOKEN

if (!serviceToken) {
	throw new Error(
		'Missing signer token. Set PRIVATE_PDF_SIGNER_TOKEN, PDF_SIGNER_TOKEN, or pass --service-token.'
	)
}

if (!passphrase) {
	throw new Error(
		'Missing PKCS#12 passphrase. Set PKCS12_PASSPHRASE, pass --passphrase, or add the fixture passphrase file.'
	)
}

const inputPdf = await readFile(inputPdfPath)

const pkcs12 = await readFile(certPath)

console.log(`Signing PDF: ${inputPdfPath}`)

console.log(`Using certificate: ${certPath}`)

console.log(`Signer service: ${serviceUrl}`)

const response = await fetch(`${serviceUrl}/v1/sign-pdf`, {
	method: 'POST',
	headers: {
		authorization: `Bearer ${serviceToken}`,
		'content-type': 'application/json'
	},
	body: JSON.stringify({
		unsigned_pdf_base64: inputPdf.toString('base64'),
		pkcs12_base64: pkcs12.toString('base64'),
		pkcs12_passphrase: passphrase,
		field_name: 'organisation_signature',
		page_index: Number(args.pageIndex ?? 0),
		box: parseBox(args.box) ?? [360, 48, 540, 110],
		reason: args.reason ?? 'Primer Paso PDF signing test',
		location: args.location ?? 'Local test'
	})
})

if (!response.ok) {
	const body = await response.text().catch(() => '')
	throw new Error(`Signing failed with HTTP ${response.status}: ${body}`)
}

const result = await response.json()

const signedPdf = Buffer.from(result.signed_pdf_base64, 'base64')

await mkdir(dirname(outputPdfPath), { recursive: true })

await writeFile(outputPdfPath, signedPdf)

const pdfsig = spawnSync('pdfsig', [outputPdfPath], {
	encoding: 'utf8'
})

if (pdfsig.status === 0) {
	console.log(pdfsig.stdout)
	if (pdfsig.stdout.includes('The signature form field is not signed')) {
		throw new Error('Output PDF contains an unsigned signature field')
	}
} else {
	console.warn('Could not verify PDF signature with pdfsig')
	console.warn(pdfsig.stderr)
}

console.log('')

console.log(`Signed PDF written to: ${resolve(outputPdfPath)}`)

console.log(`Filename: ${basename(outputPdfPath)}`)

console.log(`Bytes: ${signedPdf.byteLength}`)

console.log('')

console.log('Certificate metadata:')

console.log(`Subject: ${result.signer_subject}`)

console.log(`Issuer: ${result.signer_issuer}`)

console.log(`Serial: ${result.certificate_serial_number}`)

console.log(`Fingerprint SHA-256: ${result.certificate_fingerprint_sha256}`)

function parseArgs(argv) {
	const parsed = {}
	for (let index = 0; index < argv.length; index += 1) {
		const key = argv[index]
		const value = argv[index + 1]
		if (!key.startsWith('--')) {
			throw new Error(`Unexpected argument: ${key}`)
		}
		if (!value || value.startsWith('--')) {
			throw new Error(`Missing value for ${key}`)
		}
		parsed[toCamelCase(key.slice(2))] = value
		index += 1
	}
	return parsed
}

function toCamelCase(value) {
	return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function parseBox(value) {
	if (!value) return null
	const parts = value.split(',').map((part) => Number(part.trim()))
	if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) {
		throw new Error('--box must be four comma-separated numbers, e.g. 360,48,540,110')
	}
	const [x1, y1, x2, y2] = parts
	if (x2 <= x1 || y2 <= y1) {
		throw new Error('--box must be [x1,y1,x2,y2] with x2 > x1 and y2 > y1')
	}
	return parts
}

async function readOptionalText(path) {
	try {
		return await readFile(path, 'utf8')
	} catch (error) {
		if (error && typeof error === 'object' && error.code === 'ENOENT') {
			return null
		}
		throw error
	}
}

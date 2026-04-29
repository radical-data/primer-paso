import { createHash } from 'node:crypto'

export type SignatureBox = readonly [number, number, number, number]

export type SignPdfWithOrganisationCertificateInput = {
	serviceUrl: string
	serviceToken: string
	unsignedPdf: Uint8Array
	pkcs12: Uint8Array
	pkcs12Passphrase: string
	fieldName?: string
	pageIndex?: number
	box?: SignatureBox
	reason?: string
	location?: string
}

export type SignPdfWithOrganisationCertificateResult = {
	signedPdf: Uint8Array
	signedPdfSha256: string
	signerSubject: string
	signerIssuer: string
	certificateSerialNumber: string
	certificateFingerprintSha256: string
}

type SignPdfResponseBody = {
	signed_pdf_base64: string
	signer_subject: string
	signer_issuer: string
	certificate_serial_number: string
	certificate_fingerprint_sha256: string
}

type ErrorResponseBody = {
	detail?: unknown
}

const DEFAULT_BOX: SignatureBox = [360, 48, 540, 110]

export async function signPdfWithOrganisationCertificate(
	input: SignPdfWithOrganisationCertificateInput
): Promise<SignPdfWithOrganisationCertificateResult> {
	const serviceUrl = normaliseServiceUrl(input.serviceUrl)
	const response = await fetch(`${serviceUrl}/v1/sign-pdf`, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${input.serviceToken}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			unsigned_pdf_base64: toBase64(input.unsignedPdf),
			pkcs12_base64: toBase64(input.pkcs12),
			pkcs12_passphrase: input.pkcs12Passphrase,
			field_name: input.fieldName ?? 'organisation_signature',
			page_index: input.pageIndex ?? 0,
			box: input.box ?? DEFAULT_BOX,
			reason: input.reason ?? 'Vulnerability certificate issuance',
			location: input.location ?? 'Primer Paso'
		})
	})

	if (!response.ok) {
		throw new Error(await formatSigningError(response))
	}

	const body = (await response.json()) as SignPdfResponseBody
	assertSignPdfResponseBody(body)
	const signedPdf = fromBase64(body.signed_pdf_base64)

	return {
		signedPdf,
		signedPdfSha256: sha256Hex(signedPdf),
		signerSubject: body.signer_subject,
		signerIssuer: body.signer_issuer,
		certificateSerialNumber: body.certificate_serial_number,
		certificateFingerprintSha256: body.certificate_fingerprint_sha256
	}
}

function normaliseServiceUrl(value: string): string {
	const trimmed = value.trim()
	if (!trimmed) {
		throw new Error('PDF signer service URL is required')
	}
	return trimmed.replace(/\/+$/, '')
}

function toBase64(bytes: Uint8Array): string {
	return Buffer.from(bytes).toString('base64')
}

function fromBase64(value: string): Uint8Array {
	return Buffer.from(value, 'base64')
}

function sha256Hex(bytes: Uint8Array): string {
	return createHash('sha256').update(bytes).digest('hex')
}

async function formatSigningError(response: Response): Promise<string> {
	let detail: unknown
	try {
		const body = (await response.json()) as ErrorResponseBody
		detail = body.detail
	} catch {
		detail = await response.text().catch(() => undefined)
	}

	const detailText =
		typeof detail === 'string'
			? detail
			: detail === undefined
				? 'unknown error'
				: JSON.stringify(detail)
	return `PDF signing failed with HTTP ${response.status}: ${detailText}`
}

function assertSignPdfResponseBody(
	value: SignPdfResponseBody
): asserts value is SignPdfResponseBody {
	if (!value || typeof value !== 'object') {
		throw new Error('PDF signer returned an invalid response')
	}
	assertString(value.signed_pdf_base64, 'signed_pdf_base64')
	assertString(value.signer_subject, 'signer_subject')
	assertString(value.signer_issuer, 'signer_issuer')
	assertString(value.certificate_serial_number, 'certificate_serial_number')
	assertString(value.certificate_fingerprint_sha256, 'certificate_fingerprint_sha256')
}

function assertString(value: unknown, name: string): asserts value is string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`PDF signer returned invalid ${name}`)
	}
}

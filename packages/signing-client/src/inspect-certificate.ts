import { assertString, formatSigningError, normaliseServiceUrl, toBase64 } from './http'

export type InspectSigningCertificateInput = {
	serviceUrl: string
	serviceToken: string
	pkcs12: Uint8Array
	pkcs12Passphrase: string
}

export type InspectSigningCertificateResult = {
	signerSubject: string
	signerIssuer: string
	certificateSerialNumber: string
	certificateFingerprintSha256: string
	notBefore: Date | null
	notAfter: Date | null
}

type InspectCertificateResponseBody = {
	signer_subject: string
	signer_issuer: string
	certificate_serial_number: string
	certificate_fingerprint_sha256: string
	not_before: string | null
	not_after: string | null
}

export async function inspectSigningCertificate(
	input: InspectSigningCertificateInput
): Promise<InspectSigningCertificateResult> {
	const serviceUrl = normaliseServiceUrl(input.serviceUrl)

	const response = await fetch(`${serviceUrl}/v1/inspect-certificate`, {
		method: 'POST',
		headers: {
			authorization: `Bearer ${input.serviceToken}`,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			pkcs12_base64: toBase64(input.pkcs12),
			pkcs12_passphrase: input.pkcs12Passphrase
		})
	})

	if (!response.ok) {
		throw new Error(await formatSigningError(response))
	}

	const body = (await response.json()) as InspectCertificateResponseBody
	assertInspectCertificateResponseBody(body)

	return {
		signerSubject: body.signer_subject,
		signerIssuer: body.signer_issuer,
		certificateSerialNumber: body.certificate_serial_number,
		certificateFingerprintSha256: body.certificate_fingerprint_sha256,
		notBefore: parseNullableDate(body.not_before),
		notAfter: parseNullableDate(body.not_after)
	}
}

function assertInspectCertificateResponseBody(
	value: InspectCertificateResponseBody
): asserts value is InspectCertificateResponseBody {
	if (!value || typeof value !== 'object') {
		throw new Error('PDF signer returned an invalid response')
	}

	assertString(value.signer_subject, 'signer_subject')
	assertString(value.signer_issuer, 'signer_issuer')
	assertString(value.certificate_serial_number, 'certificate_serial_number')
	assertString(value.certificate_fingerprint_sha256, 'certificate_fingerprint_sha256')
}

function parseNullableDate(value: string | null): Date | null {
	if (value === null) return null

	const date = new Date(value)
	if (Number.isNaN(date.getTime())) {
		throw new Error(`PDF signer returned invalid date: ${value}`)
	}

	return date
}

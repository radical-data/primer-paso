export function normaliseServiceUrl(value: string): string {
	const trimmed = value.trim()
	if (!trimmed) {
		throw new Error('PDF signer service URL is required')
	}

	return trimmed.replace(/\/+$/, '')
}

export function toBase64(bytes: Uint8Array): string {
	return Buffer.from(bytes).toString('base64')
}

export function fromBase64(value: string): Uint8Array {
	return Buffer.from(value, 'base64')
}

type ErrorResponseBody = {
	detail?: unknown
}

export async function formatSigningError(response: Response): Promise<string> {
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

	return `PDF signer failed with HTTP ${response.status}: ${detailText}`
}

export function assertString(value: unknown, name: string): asserts value is string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`PDF signer returned invalid ${name}`)
	}
}

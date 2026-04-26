import { describe, expect, it } from 'vitest'
import { assertSafeQrPayload, generateQrSvg } from './qr'

describe('QR generation', () => {
	it('generates a real SVG QR code for an HTTPS URL', async () => {
		const svg = await generateQrSvg(
			'https://org.primerpaso.org/handoff?token=test-token-for-qr-generation'
		)

		expect(svg).toContain('<svg')
		expect(svg).toContain('<path')
		expect(svg).not.toContain('QR placeholder')
	})

	it('rejects non-HTTPS QR payloads', async () => {
		await expect(generateQrSvg('http://org.primerpaso.org/handoff?token=abc')).rejects.toThrow(
			'HTTPS'
		)
	})

	it('normalises safe HTTPS QR payloads', () => {
		expect(assertSafeQrPayload('https://org.primerpaso.org/handoff?token=test-token')).toBe(
			'https://org.primerpaso.org/handoff?token=test-token'
		)
	})

	it('rejects URLs containing credentials', () => {
		expect(() =>
			assertSafeQrPayload('https://user:password@org.primerpaso.org/handoff?token=test-token')
		).toThrow('credentials')
	})
})

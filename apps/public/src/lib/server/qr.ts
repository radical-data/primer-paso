import QRCode from 'qrcode'

const QR_SIZE = 256

/**
 * Generate a plain, high-contrast SVG QR code for server responses.
 *
 * Keep this intentionally unbranded:
 * - no logo overlay, because it reduces scan reliability
 * - high contrast black-on-white
 * - quiet zone margin
 * - quartile error correction for print, camera blur, and low-end devices
 */
export const generateQrSvg = async (value: string) => {
	if (!value.startsWith('https://')) {
		throw new Error('QR payload must be an HTTPS URL.')
	}

	return QRCode.toString(value, {
		type: 'svg',
		width: QR_SIZE,
		margin: 4,
		errorCorrectionLevel: 'Q',
		color: {
			dark: '#000000',
			light: '#ffffff'
		}
	})
}

export const assertSafeQrPayload = (value: string) => {
	const url = new URL(value)

	if (url.protocol !== 'https:') {
		throw new Error('QR payload must use HTTPS.')
	}

	if (url.username || url.password) {
		throw new Error('QR payload must not contain credentials.')
	}

	return url.toString()
}

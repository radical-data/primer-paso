import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'

const VERSION = 'v1'
const ALGORITHM = 'aes-256-gcm'
const IV_BYTES = 12
const TAG_BYTES = 16

export function encryptSigningSecret(plaintext: Uint8Array, base64Key: string): string {
	const key = parseKey(base64Key)
	const iv = randomBytes(IV_BYTES)
	const cipher = createCipheriv(ALGORITHM, key, iv, {
		authTagLength: TAG_BYTES
	})

	const ciphertext = Buffer.concat([cipher.update(Buffer.from(plaintext)), cipher.final()])
	const tag = cipher.getAuthTag()

	return [
		VERSION,
		iv.toString('base64'),
		tag.toString('base64'),
		ciphertext.toString('base64')
	].join(':')
}

export function decryptSigningSecret(encoded: string, base64Key: string): Uint8Array {
	const key = parseKey(base64Key)
	const [version, ivBase64, tagBase64, ciphertextBase64] = encoded.split(':')

	if (version !== VERSION || !ivBase64 || !tagBase64 || !ciphertextBase64) {
		throw new Error('Invalid encrypted signing secret format')
	}

	const iv = Buffer.from(ivBase64, 'base64')
	const tag = Buffer.from(tagBase64, 'base64')
	const ciphertext = Buffer.from(ciphertextBase64, 'base64')

	if (iv.length !== IV_BYTES) {
		throw new Error('Invalid encrypted signing secret IV')
	}

	if (tag.length !== TAG_BYTES) {
		throw new Error('Invalid encrypted signing secret tag')
	}

	const decipher = createDecipheriv(ALGORITHM, key, iv, {
		authTagLength: TAG_BYTES
	})
	decipher.setAuthTag(tag)

	return Buffer.concat([decipher.update(ciphertext), decipher.final()])
}

export function encryptSigningText(value: string, base64Key: string): string {
	return encryptSigningSecret(Buffer.from(value, 'utf8'), base64Key)
}

export function decryptSigningText(value: string, base64Key: string): string {
	return Buffer.from(decryptSigningSecret(value, base64Key)).toString('utf8')
}

function parseKey(base64Key: string): Buffer {
	const key = Buffer.from(base64Key, 'base64')
	if (key.length !== 32) {
		throw new Error('PRIVATE_SIGNING_CERT_ENCRYPTION_KEY must be 32 bytes base64-encoded')
	}
	return key
}

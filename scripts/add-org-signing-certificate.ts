#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
/**
 * Adapt this import if your DB package exports a different helper.
 *
 * Expected shape:
 *   sql`...`
 */
import { sql } from '@primer-paso/db'
import { inspectSigningCertificate } from '@primer-paso/signing-client'
import {
	encryptSigningSecret,
	encryptSigningText
} from '../apps/org-portal/src/lib/server/signing-secret-crypto'

type Args = {
	organisationId: string
	certPath: string
	createdByUserId: string | null
}

const args = parseArgs(process.argv.slice(2))

const signerUrl = requiredEnv('PRIVATE_PDF_SIGNER_URL')
const signerToken = requiredEnv('PRIVATE_PDF_SIGNER_TOKEN')
const encryptionKey = requiredEnv('PRIVATE_SIGNING_CERT_ENCRYPTION_KEY')

const certBytes = await readFile(args.certPath)
const passphrase = await promptHidden('Certificate password: ')

const metadata = await inspectSigningCertificate({
	serviceUrl: signerUrl,
	serviceToken: signerToken,
	pkcs12: certBytes,
	pkcs12Passphrase: passphrase
})

const encryptedPkcs12 = encryptSigningSecret(certBytes, encryptionKey)
const encryptedPassphrase = encryptSigningText(passphrase, encryptionKey)

await sql`
  insert into organisation_signing_certificates (
    organisation_id,
    encrypted_pkcs12,
    encrypted_passphrase,
    subject,
    issuer,
    serial_number,
    fingerprint_sha256,
    not_before,
    not_after,
    created_by_user_id
  )
  values (
    ${args.organisationId},
    ${encryptedPkcs12},
    ${encryptedPassphrase},
    ${metadata.signerSubject},
    ${metadata.signerIssuer},
    ${metadata.certificateSerialNumber},
    ${metadata.certificateFingerprintSha256},
    ${metadata.notBefore},
    ${metadata.notAfter},
    ${args.createdByUserId}
  )
  on conflict (organisation_id)
  where disabled_at is null
  do update set
    encrypted_pkcs12 = excluded.encrypted_pkcs12,
    encrypted_passphrase = excluded.encrypted_passphrase,
    subject = excluded.subject,
    issuer = excluded.issuer,
    serial_number = excluded.serial_number,
    fingerprint_sha256 = excluded.fingerprint_sha256,
    not_before = excluded.not_before,
    not_after = excluded.not_after,
    created_by_user_id = excluded.created_by_user_id,
    created_at = now()
`

console.log('Stored organisation signing certificate')
console.log(`Organisation: ${args.organisationId}`)
console.log(`Subject: ${metadata.signerSubject}`)
console.log(`Issuer: ${metadata.signerIssuer}`)
console.log(`Serial: ${metadata.certificateSerialNumber}`)
console.log(`Fingerprint SHA-256: ${metadata.certificateFingerprintSha256}`)
console.log(`Not before: ${metadata.notBefore?.toISOString() ?? 'unknown'}`)
console.log(`Not after: ${metadata.notAfter?.toISOString() ?? 'unknown'}`)

function parseArgs(argv: string[]): Args {
	const values = new Map<string, string>()

	for (let index = 0; index < argv.length; index += 1) {
		const key = argv[index]
		const value = argv[index + 1]

		if (!key?.startsWith('--')) {
			usage(`Unexpected argument: ${key}`)
		}

		if (!value || value.startsWith('--')) {
			usage(`Missing value for ${key}`)
		}

		values.set(key.slice(2), value)
		index += 1
	}

	const organisationId = values.get('organisation-id')
	const certPath = values.get('cert')
	const createdByUserId = values.get('created-by-user-id') ?? null

	if (!organisationId) usage('Missing --organisation-id')
	if (!certPath) usage('Missing --cert')

	return {
		organisationId,
		certPath,
		createdByUserId
	}
}

function usage(message: string): never {
	console.error(message)
	console.error('')
	console.error('Usage:')
	console.error('  node --env-file=.env --import tsx scripts/add-org-signing-certificate.ts \\')
	console.error('    --organisation-id <uuid> \\')
	console.error('    --cert ./organisation.p12 \\')
	console.error('    [--created-by-user-id <uuid>]')
	process.exit(1)
}

function requiredEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`${name} is required`)
	}
	return value
}

async function promptHidden(prompt: string): Promise<string> {
	/**
	 * readline/promises does not have a built-in hidden input mode.
	 * This simple approach avoids passing the password through argv,
	 * but it still echoes in some terminals. For a prototype admin script,
	 * that is acceptable; replace with a no-echo prompt package if desired.
	 */
	const rl = createInterface({ input, output })
	try {
		const value = await rl.question(prompt)
		if (!value) {
			throw new Error('Certificate password cannot be empty')
		}
		return value
	} finally {
		rl.close()
	}
}

#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { createPostgresOrgPortalRepository } from '@primer-paso/db'
import { inspectSigningCertificate } from '@primer-paso/signing-client'
import {
	encryptSigningSecret,
	encryptSigningText
} from '../apps/org-portal/src/lib/server/signing-secret-crypto'

type Args = {
	organisationId: string
	certPath: string
	createdByMemberId: string | null
}

const args = parseArgs(process.argv.slice(2))

const databaseUrl = process.env.PRIVATE_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim()
if (!databaseUrl) {
	console.error('Set PRIVATE_DATABASE_URL or DATABASE_URL before running this script.')
	process.exit(1)
}

const signerUrl = requiredEnv('PRIVATE_PDF_SIGNER_URL')
const signerToken = requiredEnv('PRIVATE_PDF_SIGNER_TOKEN')
const encryptionKey = requiredEnv('PRIVATE_SIGNING_CERT_ENCRYPTION_KEY')

const repository = createPostgresOrgPortalRepository({ databaseUrl })

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

const signingCertificate = await repository.replaceOrganisationSigningCertificate({
	organisationId: args.organisationId,
	createdByMemberId: args.createdByMemberId,
	encryptedPkcs12,
	encryptedPassphrase,
	subject: metadata.signerSubject,
	issuer: metadata.signerIssuer,
	serialNumber: metadata.certificateSerialNumber,
	fingerprintSha256: metadata.certificateFingerprintSha256,
	notBefore: metadata.notBefore?.toISOString(),
	notAfter: metadata.notAfter?.toISOString()
})

console.log('Stored organisation signing certificate')
console.log(`Organisation: ${args.organisationId}`)
console.log(`Certificate row id: ${signingCertificate.id}`)
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
	const createdByMemberId = values.get('created-by-member-id') ?? null

	if (!organisationId) usage('Missing --organisation-id')
	if (!certPath) usage('Missing --cert')

	return {
		organisationId,
		certPath,
		createdByMemberId
	}
}

function usage(message: string): never {
	console.error(message)
	console.error('')
	console.error('Usage:')
	console.error('  node --env-file=.env --import tsx scripts/add-org-signing-certificate.ts \\')
	console.error('    --organisation-id <uuid> \\')
	console.error('    --cert ./organisation.p12 \\')
	console.error('    [--created-by-member-id <uuid>]')
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

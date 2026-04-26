import { error } from '@sveltejs/kit'
import { getCertificateHandoffByToken } from '$lib/server/certificate-handoff'
import { env } from '$env/dynamic/public'
import { assertSafeQrPayload, generateQrSvg } from '$lib/server/qr'
import type { RequestHandler } from './$types'

const getOrgPortalUrl = () =>
	(env.PUBLIC_ORG_PORTAL_URL ?? 'https://org.primerpaso.org').replace(/\/+$/, '')

const buildOrgHandoffUrl = (token: string) => {
	const url = new URL('/handoff', getOrgPortalUrl())
	url.searchParams.set('token', token)
	return url.toString()
}

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token')

	if (!token || !(await getCertificateHandoffByToken(token))) {
		error(404, 'Certificate handoff not found or expired')
	}

	let svg: string

	try {
		const handoffUrl = assertSafeQrPayload(buildOrgHandoffUrl(token))
		svg = await generateQrSvg(handoffUrl)
	} catch {
		error(500, 'Could not generate certificate handoff QR code')
	}

	return new Response(svg, {
		headers: {
			'content-type': 'image/svg+xml; charset=utf-8',
			'cache-control': 'no-store',
			'referrer-policy': 'no-referrer',
			'x-robots-tag': 'noindex, nofollow, noarchive'
		}
	})
}

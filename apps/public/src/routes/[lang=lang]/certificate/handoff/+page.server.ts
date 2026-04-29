import { error, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'
import { localiseHref } from '$lib/i18n/routing'
import { getCertificateHandoffByToken } from '$lib/server/certificate-handoff'
import type { PageServerLoad } from './$types'

const getOrgPortalUrl = () =>
	(env.PUBLIC_ORG_PORTAL_URL ?? 'https://org.primerpaso.org').replace(/\/+$/, '')

const buildOrgHandoffUrl = (token: string) => {
	const url = new URL('/handoff', getOrgPortalUrl())
	url.searchParams.set('token', token)
	return url.toString()
}

export const load: PageServerLoad = async ({ params, url }) => {
	const token = url.searchParams.get('token')

	if (!token) {
		redirect(303, localiseHref(params.lang, '/certificate/check'))
	}

	const handoff = await getCertificateHandoffByToken(token)

	if (!handoff) {
		error(404, 'Certificate handoff not found or expired')
	}

	const orgHandoffUrl = buildOrgHandoffUrl(token)

	return {
		locale: params.lang,
		referenceCode: handoff.referenceCode,
		expiresAt: handoff.expiresAt,
		orgHandoffUrl,
		qrHref: `${localiseHref(params.lang, '/certificate/handoff/qr.svg')}?token=${encodeURIComponent(token)}`,
		backHref: localiseHref(params.lang, '/certificate/check')
	}
}

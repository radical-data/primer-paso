import { getPermissionsForRole, hasPermission, type OrgPermission } from '@primer-paso/auth'
import { type Cookies, redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { env } from '$env/dynamic/private'
import { getOrgPortalRepository } from './repository'

export const ORG_SESSION_COOKIE = 'pp_org_session'
const PENDING_HANDOFF_COOKIE = 'pp_pending_handoff'
const EIGHT_HOURS = 60 * 60 * 8
const TEN_MINUTES = 60 * 10

export const getSessionFromCookies = async (cookies: Cookies): Promise<App.Locals['session']> => {
	const token = cookies.get(ORG_SESSION_COOKIE)
	const repository = getOrgPortalRepository()

	if (!token || !repository) return null

	const resolved = await repository.findActiveOrganisationSessionByToken(token)
	if (!resolved) return null

	return {
		id: resolved.session.id,
		memberId: resolved.member.id,
		organisationId: resolved.member.organisationId,
		role: resolved.member.role,
		permissions: getPermissionsForRole(resolved.member.role)
	}
}

export const requireSession = (locals: App.Locals) => {
	if (!locals.session) {
		redirect(303, '/login')
	}

	return locals.session
}

export const requirePermission = (locals: App.Locals, permission: OrgPermission) => {
	const session = requireSession(locals)

	if (!hasPermission(session.permissions, permission)) {
		redirect(303, '/dashboard?error=permission')
	}

	return session
}

export const setOrgSessionCookie = (cookies: Cookies, token: string) => {
	cookies.set(ORG_SESSION_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: EIGHT_HOURS
	})
}

export const clearOrgSessionCookie = (cookies: Cookies) => {
	cookies.delete(ORG_SESSION_COOKIE, { path: '/' })
}

export const setPendingHandoffToken = (cookies: Cookies, token: string) => {
	cookies.set(PENDING_HANDOFF_COOKIE, token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: TEN_MINUTES
	})
}

export const getPendingHandoffToken = (cookies: Cookies) => cookies.get(PENDING_HANDOFF_COOKIE)

export const clearPendingHandoffToken = (cookies: Cookies) => {
	cookies.delete(PENDING_HANDOFF_COOKIE, { path: '/' })
}

export const normaliseEmail = (email: string) => email.trim().toLowerCase()

/**
 * Temporary PR-6 bootstrap login.
 *
 * This is intentionally organisation-member allow-list based and backed by
 * database sessions. It is not open registration.
 *
 * Replace the shared code with email OTP or passkeys before a broad public
 * launch. For pilot/admin use, set PRIVATE_ORG_PORTAL_LOGIN_CODE.
 */
export const authenticateMemberWithBootstrapCode = async ({
	email,
	code
}: {
	email: string
	code: string
}) => {
	const repository = getOrgPortalRepository()
	const expectedCode = env.PRIVATE_ORG_PORTAL_LOGIN_CODE?.trim()

	if (!repository || !expectedCode) {
		return null
	}

	if (code.trim() !== expectedCode) {
		return null
	}

	const member = await repository.findActiveOrganisationMemberByEmail(normaliseEmail(email))
	if (!member) {
		return null
	}

	return repository.createOrganisationSession({
		memberId: member.id,
		ttlHours: 8
	})
}

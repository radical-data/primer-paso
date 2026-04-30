import { getPermissionsForRole, hasPermission, type OrgPermission } from '@primer-paso/auth'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { type Cookies, error, redirect } from '@sveltejs/kit'
import { dev } from '$app/environment'
import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { getOrgPortalRepository } from './repository'

const PENDING_HANDOFF_COOKIE = 'pp_pending_handoff'
const TEN_MINUTES = 60 * 10

export const GENERIC_MAGIC_LINK_RESPONSE =
	'Si ese correo pertenece a un miembro activo de la organización, te enviaremos un enlace de acceso.'

const MAGIC_LINK_EMAIL_LIMIT = 5
const MAGIC_LINK_IP_LIMIT = 20
const MAGIC_LINK_EMAIL_IP_LIMIT = 8
const MAGIC_LINK_WINDOW_SECONDS = 60 * 15
const MAGIC_LINK_BLOCK_SECONDS = 60 * 30

export const normaliseEmail = (email: string) => email.trim().toLowerCase()

export const getOrgPortalUrl = () =>
	(publicEnv.PUBLIC_ORG_PORTAL_URL ?? 'https://org.primerpaso.org').replace(/\/+$/, '')

export const getAuthCallbackUrl = () => new URL('/auth/callback', getOrgPortalUrl()).toString()

export const isSupabaseAuthConfigured = () =>
	Boolean(
		publicEnv.PUBLIC_SUPABASE_URL?.trim() && publicEnv.PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim()
	)

export const assertSupabaseAuthConfigured = () => {
	if (!isSupabaseAuthConfigured()) {
		error(503, 'La autenticación del portal de organizaciones no está configurada.')
	}
}

const isCustomSmtpConfigured = () => privateEnv.PRIVATE_ORG_PORTAL_CUSTOM_SMTP_CONFIGURED === 'true'

export const assertProductionAuthConfiguration = () => {
	const environment = privateEnv.PRIVATE_ORG_PORTAL_ENVIRONMENT
	if ((environment === 'production' || environment === 'preview') && !isCustomSmtpConfigured()) {
		error(503, 'La entrega de correo del portal de organizaciones no está configurada.')
	}
}

const mapSupabaseUserToOrganisationSession = async (
	user: User
): Promise<App.Locals['session'] | null> => {
	const email = normaliseEmail(user.email ?? '')
	if (!email) {
		return null
	}
	const repository = getOrgPortalRepository()
	if (!repository) {
		return null
	}
	const member = await repository.findActiveOrganisationMemberByEmail(email)
	if (!member) {
		return null
	}
	return {
		id: user.id,
		memberId: member.id,
		organisationId: member.organisationId,
		email: member.email,
		role: member.role,
		permissions: getPermissionsForRole(member.role)
	}
}

export const resolveSupabaseAuthSession = async (supabase: SupabaseClient) => {
	if (!isSupabaseAuthConfigured()) {
		return { user: null, session: null }
	}
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser()
	if (authError || !user) {
		return { user: null, session: null }
	}
	const session = await mapSupabaseUserToOrganisationSession(user)
	return { user, session }
}

export const getRequestIpAddress = (request: Request) =>
	request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
	request.headers.get('x-real-ip')?.trim() ||
	'unknown'

export const checkMagicLinkRateLimit = async ({
	email,
	request
}: {
	email: string
	request: Request
}) => {
	const repository = getOrgPortalRepository()
	if (!repository) {
		return { allowed: true, blockedUntil: undefined }
	}

	const ipAddress = getRequestIpAddress(request)
	const attempts = await Promise.all([
		repository.recordOrganisationAuthAttempt({
			identifier: email,
			identifierType: 'email',
			action: 'magic_link',
			limit: MAGIC_LINK_EMAIL_LIMIT,
			windowSeconds: MAGIC_LINK_WINDOW_SECONDS,
			blockSeconds: MAGIC_LINK_BLOCK_SECONDS
		}),
		repository.recordOrganisationAuthAttempt({
			identifier: ipAddress,
			identifierType: 'ip',
			action: 'magic_link',
			limit: MAGIC_LINK_IP_LIMIT,
			windowSeconds: MAGIC_LINK_WINDOW_SECONDS,
			blockSeconds: MAGIC_LINK_BLOCK_SECONDS
		}),
		repository.recordOrganisationAuthAttempt({
			identifier: `${email}:${ipAddress}`,
			identifierType: 'email_ip',
			action: 'magic_link',
			limit: MAGIC_LINK_EMAIL_IP_LIMIT,
			windowSeconds: MAGIC_LINK_WINDOW_SECONDS,
			blockSeconds: MAGIC_LINK_BLOCK_SECONDS
		})
	])

	const blocked = attempts.find((attempt) => !attempt.allowed)
	return {
		allowed: !blocked,
		blockedUntil: blocked?.blockedUntil
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

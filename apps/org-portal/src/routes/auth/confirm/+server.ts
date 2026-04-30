import type { EmailOtpType } from '@supabase/supabase-js'
import { type RequestHandler, redirect } from '@sveltejs/kit'

const AUTHENTICATED_REDIRECT_PATH = '/dashboard'
const FAILED_REDIRECT_PATH = '/login?error=magic-link-invalid'

const normaliseOtpType = (value: string | null): EmailOtpType | null => {
	if (value === 'magiclink' || value === 'email') {
		return value
	}

	return null
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const tokenHash = url.searchParams.get('token_hash')
	const type = normaliseOtpType(url.searchParams.get('type'))

	if (!tokenHash || !type) {
		throw redirect(303, FAILED_REDIRECT_PATH)
	}

	const { error } = await locals.supabase.auth.verifyOtp({
		token_hash: tokenHash,
		type
	})

	if (error) {
		throw redirect(303, FAILED_REDIRECT_PATH)
	}

	throw redirect(303, AUTHENTICATED_REDIRECT_PATH)
}

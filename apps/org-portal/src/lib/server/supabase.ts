import { createServerClient } from '@supabase/ssr'
import type { RequestEvent } from '@sveltejs/kit'
import { env } from '$env/dynamic/public'

export const createSupabaseServerClient = (event: RequestEvent) =>
	createServerClient(env.PUBLIC_SUPABASE_URL ?? '', env.PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '', {
		cookies: {
			getAll() {
				return event.cookies.getAll()
			},
			setAll(cookiesToSet) {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, {
						...options,
						path: options.path ?? '/'
					})
				}
			}
		}
	})

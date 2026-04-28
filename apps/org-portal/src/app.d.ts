import type { OrgPermission, OrgRole } from '@primer-paso/auth'
import type { SupabaseClient, User } from '@supabase/supabase-js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			supabaseUser: User | null
			session: {
				id: string
				memberId: string
				organisationId: string
				email: string
				role: OrgRole
				permissions: OrgPermission[]
			} | null
		}
	}
}

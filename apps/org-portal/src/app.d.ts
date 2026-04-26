import type { OrgPermission, OrgRole } from '@primer-paso/auth'

declare global {
	namespace App {
		interface Locals {
			session: {
				id: string
				memberId: string
				organisationId: string
				role: OrgRole
				permissions: OrgPermission[]
			} | null
		}
	}
}

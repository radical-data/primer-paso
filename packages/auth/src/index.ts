export const AUTH_PACKAGE_VERSION = '0.0.1'

export const ORG_ROLE_VALUES = [
	'admin',
	'audit_viewer',
	'intake_volunteer',
	'authorised_signer'
] as const

export type OrgRole = (typeof ORG_ROLE_VALUES)[number]

export const ORG_PERMISSION_VALUES = [
	'handoff:open',
	'handoff:review',
	'certificate:prepare',
	'certificate:issue',
	'audit:read',
	'organisation:manage_members',
	'organisation:manage_profile'
] as const

export type OrgPermission = (typeof ORG_PERMISSION_VALUES)[number]

const rolePermissions = {
	admin: [
		'handoff:open',
		'handoff:review',
		'certificate:prepare',
		'certificate:issue',
		'audit:read',
		'organisation:manage_members',
		'organisation:manage_profile'
	],
	audit_viewer: ['audit:read'],
	intake_volunteer: ['handoff:open', 'handoff:review', 'certificate:prepare'],
	authorised_signer: ['handoff:open', 'handoff:review', 'certificate:prepare', 'certificate:issue']
} satisfies Record<OrgRole, OrgPermission[]>

export const isOrgRole = (value: unknown): value is OrgRole =>
	typeof value === 'string' && ORG_ROLE_VALUES.includes(value as OrgRole)

export const isOrgPermission = (value: unknown): value is OrgPermission =>
	typeof value === 'string' && ORG_PERMISSION_VALUES.includes(value as OrgPermission)

export const getPermissionsForRole = (role: OrgRole): OrgPermission[] => [...rolePermissions[role]]

export const hasPermission = (permissions: readonly OrgPermission[], permission: OrgPermission) =>
	permissions.includes(permission)

export const roleHasPermission = (role: OrgRole, permission: OrgPermission) =>
	hasPermission(rolePermissions[role], permission)

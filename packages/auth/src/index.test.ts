import { describe, expect, it } from 'vitest'
import { getPermissionsForRole, roleHasPermission } from './index'

describe('organisation permissions', () => {
	it('allows admins to manage organisation settings and issue certificates', () => {
		expect(roleHasPermission('admin', 'organisation:manage_members')).toBe(true)
		expect(roleHasPermission('admin', 'certificate:issue')).toBe(true)
	})

	it('does not allow audit viewers to open handoffs', () => {
		expect(roleHasPermission('audit_viewer', 'audit:read')).toBe(true)
		expect(roleHasPermission('audit_viewer', 'handoff:open')).toBe(false)
	})

	it('allows intake volunteers to prepare but not issue certificates', () => {
		expect(roleHasPermission('intake_volunteer', 'handoff:open')).toBe(true)
		expect(roleHasPermission('intake_volunteer', 'certificate:prepare')).toBe(true)
		expect(roleHasPermission('intake_volunteer', 'certificate:issue')).toBe(false)
	})

	it('allows authorised signers to issue certificates', () => {
		expect(roleHasPermission('authorised_signer', 'certificate:issue')).toBe(true)
	})

	it('returns defensive copies of permission arrays', () => {
		const permissions = getPermissionsForRole('admin')
		permissions.length = 0

		expect(getPermissionsForRole('admin')).toContain('certificate:issue')
	})
})

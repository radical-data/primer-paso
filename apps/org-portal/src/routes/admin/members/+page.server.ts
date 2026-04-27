import { isOrgRole, ORG_ROLE_VALUES } from '@primer-paso/auth'
import { OrgPortalRepositoryError } from '@primer-paso/db'
import { error, fail, redirect } from '@sveltejs/kit'
import { writeAuditEvent } from '$lib/server/audit'
import { requirePermission } from '$lib/server/auth'
import { getOrgPortalRepository } from '$lib/server/repository'
import type { Actions, PageServerLoad } from './$types'

const readString = (formData: FormData, key: string) =>
	String(formData.get(key) ?? '')
		.replace(/\s+/g, ' ')
		.trim()

const readEmail = (formData: FormData) => readString(formData, 'email').toLowerCase()

const errorMessage = (error: unknown) =>
	error instanceof OrgPortalRepositoryError
		? error.message
		: 'Something went wrong. Please try again.'

const getRepositoryOrError = () => {
	const repository = getOrgPortalRepository()
	if (!repository) {
		error(503, 'Organisation portal storage is not configured.')
	}
	return repository
}

export const load: PageServerLoad = async ({ locals }) => {
	const session = requirePermission(locals, 'organisation:manage_members')
	const repository = getRepositoryOrError()
	const [organisation, members] = await Promise.all([
		repository.findOrganisationById(session.organisationId),
		repository.listOrganisationMembers(session.organisationId)
	])

	if (!organisation) {
		error(404, 'Organisation not found.')
	}

	return {
		organisation,
		members,
		currentMemberId: session.memberId,
		roles: ORG_ROLE_VALUES
	}
}

export const actions: Actions = {
	add: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_members')
		const repository = getRepositoryOrError()
		const formData = await request.formData()
		const email = readEmail(formData)
		const name = readString(formData, 'name')
		const role = readString(formData, 'role')

		if (!email || !email.includes('@')) {
			return fail(400, {
				intent: 'add',
				error: 'Enter a valid email address.',
				value: { email, name, role }
			})
		}

		if (!name) {
			return fail(400, {
				intent: 'add',
				error: 'Enter the member name.',
				value: { email, name, role }
			})
		}

		if (!isOrgRole(role)) {
			return fail(400, {
				intent: 'add',
				error: 'Choose a valid role.',
				value: { email, name, role }
			})
		}

		try {
			const member = await repository.createOrganisationMember({
				organisationId: session.organisationId,
				email,
				name,
				role
			})

			await writeAuditEvent({
				eventType: 'organisation.member_saved',
				eventData: {
					memberId: member.id,
					email: member.email,
					role: member.role,
					status: member.status
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})
		} catch (error) {
			return fail(400, {
				intent: 'add',
				error: errorMessage(error),
				value: { email, name, role }
			})
		}

		redirect(303, '/admin/members')
	},

	role: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_members')
		const repository = getRepositoryOrError()
		const formData = await request.formData()
		const memberId = readString(formData, 'memberId')
		const role = readString(formData, 'role')

		if (!memberId || !isOrgRole(role)) {
			return fail(400, {
				intent: 'role',
				error: 'Choose a valid member and role.'
			})
		}

		try {
			const member = await repository.updateOrganisationMemberRole({
				organisationId: session.organisationId,
				memberId,
				role
			})

			await writeAuditEvent({
				eventType: 'organisation.member_role_updated',
				eventData: {
					memberId: member.id,
					email: member.email,
					role: member.role
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})
		} catch (error) {
			return fail(400, {
				intent: 'role',
				error: errorMessage(error)
			})
		}

		redirect(303, '/admin/members')
	},

	disable: async ({ locals, request }) => {
		const session = requirePermission(locals, 'organisation:manage_members')
		const repository = getRepositoryOrError()
		const formData = await request.formData()
		const memberId = readString(formData, 'memberId')

		if (!memberId) {
			return fail(400, {
				intent: 'disable',
				error: 'Choose a member to disable.'
			})
		}

		if (memberId === session.memberId) {
			return fail(400, {
				intent: 'disable',
				error: 'You cannot disable your own account.'
			})
		}

		try {
			const member = await repository.disableOrganisationMember({
				organisationId: session.organisationId,
				memberId,
				disabledByMemberId: session.memberId
			})

			await writeAuditEvent({
				eventType: 'organisation.member_disabled',
				eventData: {
					memberId: member.id,
					email: member.email,
					role: member.role
				},
				organisationId: session.organisationId,
				memberId: session.memberId,
				request
			})
		} catch (error) {
			return fail(400, {
				intent: 'disable',
				error: errorMessage(error)
			})
		}

		redirect(303, '/admin/members')
	}
}

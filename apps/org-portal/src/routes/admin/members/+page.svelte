<script lang="ts">
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'
import { NativeSelect, NativeSelectOption } from '@primer-paso/ui/native-select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@primer-paso/ui/table'

let { data, form } = $props()

const roleLabel = (role: string) =>
	({
		admin: 'Admin',
		audit_viewer: 'Audit viewer',
		intake_volunteer: 'Intake volunteer',
		authorised_signer: 'Authorised signer'
	})[role] ?? role

const statusVariant = (status: string) => (status === 'active' ? 'success' : 'outline')

const formatDate = (value: string | undefined) => {
	if (!value) return '—'
	return new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/Madrid'
	}).format(new Date(value))
}

const activeMembers = $derived(data.members.filter((member) => member.status === 'active'))
const inactiveMembers = $derived(data.members.filter((member) => member.status !== 'active'))
</script>

<svelte:head>
	<title>Members | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Organisation admin</p>
		<h1>Members</h1>
		<p>Manage who can use the organisation portal for <strong>{data.organisation.name}</strong>.</p>

		<p>
			<a href="/dashboard">Back to dashboard</a>
			{' · '}
			<a href="/admin/audit">View audit log</a>
		</p>

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}

		<section aria-labelledby="add-member-title">
			<h2 id="add-member-title">Add or reactivate a member</h2>
			<p>
				This uses the current pilot login mechanism. A member can sign in with their email and the
				shared organisation access code until email delivery replaces it.
			</p>

			<form method="POST" action="?/add">
				<div>
					<Label for="name">Name</Label>
					<Input
						id="name"
						name="name"
						autocomplete="name"
						required
						value={form?.intent === 'add' ? form.value?.name : ''}
					/>
				</div>

				<div>
					<Label for="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.intent === 'add' ? form.value?.email : ''}
					/>
				</div>

				<div>
					<Label for="role">Role</Label>
					<NativeSelect id="role" name="role" required>
						{#each data.roles as role}
							<NativeSelectOption
								value={role}
								selected={form?.intent === 'add'
									? form.value?.role === role
									: role === 'intake_volunteer'}
							>
								{roleLabel(role)}
							</NativeSelectOption>
						{/each}
					</NativeSelect>
				</div>

				<p><Button type="submit">Save member</Button></p>
			</form>
		</section>

		<section aria-labelledby="active-members-title">
			<h2 id="active-members-title">Active members</h2>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Member</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each activeMembers as member}
						<TableRow>
							<TableCell>
								<strong>{member.name}</strong><br>
								<span>{member.email}</span>
							</TableCell>
							<TableCell>
								<Badge variant={statusVariant(member.status)}>{member.status}</Badge>
							</TableCell>
							<TableCell>
								<form method="POST" action="?/role">
									<input type="hidden" name="memberId" value={member.id}>
									<NativeSelect name="role" aria-label={`Role for ${member.email}`}>
										{#each data.roles as role}
											<NativeSelectOption value={role} selected={role === member.role}>
												{roleLabel(role)}
											</NativeSelectOption>
										{/each}
									</NativeSelect>
									<Button type="submit" variant="outline" size="sm">Save</Button>
								</form>
							</TableCell>
							<TableCell>{formatDate(member.createdAt)}</TableCell>
							<TableCell>
								{#if member.id === data.currentMemberId}
									<Badge variant="outline">Current user</Badge>
								{:else}
									<form method="POST" action="?/disable">
										<input type="hidden" name="memberId" value={member.id}>
										<Button type="submit" variant="destructive" size="sm">Disable</Button>
									</form>
								{/if}
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</section>

		{#if inactiveMembers.length > 0}
			<section aria-labelledby="inactive-members-title">
				<h2 id="inactive-members-title">Inactive members</h2>

				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Member</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Disabled</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each inactiveMembers as member}
							<TableRow>
								<TableCell>
									<strong>{member.name}</strong><br>
									<span>{member.email}</span>
								</TableCell>
								<TableCell>
									<Badge variant={statusVariant(member.status)}>{member.status}</Badge>
								</TableCell>
								<TableCell>{roleLabel(member.role)}</TableCell>
								<TableCell>{formatDate(member.disabledAt)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</section>
		{/if}
	</section>
</main>

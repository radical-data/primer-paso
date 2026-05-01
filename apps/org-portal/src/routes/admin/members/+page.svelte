<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import HistoryIcon from '@lucide/svelte/icons/history'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
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
import { memberStatusLabel, roleLabel } from '$lib/labels'

let { data, form } = $props()

const statusVariant = (status: string) => (status === 'active' ? 'success' : 'outline')

const formatDate = (value: string | undefined) => {
	if (!value) return '—'
	return new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/Madrid'
	}).format(new Date(value))
}

const activeMembers = $derived(data.members.filter((member) => member.status === 'active'))
const inactiveMembers = $derived(data.members.filter((member) => member.status !== 'active'))
</script>

<svelte:head> <title>Members | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Organisation admin</p>
		<h1 class="page-title">Members</h1>
		<p class="supporting-text">
			Manage who can use the organisation portal for <strong>{data.organisation.name}</strong>.
		</p>
	</header>

	<div class="actions">
		<Button href="/dashboard" variant="ghost">
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Back to dashboard
		</Button>
		<Button href="/admin/audit" variant="ghost">
			<HistoryIcon class="size-4" aria-hidden="true" />
			View audit log
		</Button>
	</div>

	{#if form?.error}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">Could not save changes</p>
			<p class="error-text">{form.error}</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle id="add-member-title">Add or reactivate a member</CardTitle>
			<CardDescription>
				This uses the current pilot login mechanism. A member can sign in with their email and the
				shared organisation access code until email delivery replaces it.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/add" class="stack" aria-labelledby="add-member-title">
				<div class="grid gap-4 md:grid-cols-3">
					<div class="form-field">
						<Label for="name">Name</Label>
						<Input
							id="name"
							name="name"
							autocomplete="name"
							required
							value={form?.intent === 'add' ? form.value?.name : ''}
						/>
					</div>
					<div class="form-field">
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
					<div class="form-field">
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
				</div>
				<div class="actions"><Button type="submit">Save member</Button></div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle id="active-members-title">Active members</CardTitle>
			<CardDescription>
				{activeMembers.length}
				active member{activeMembers.length === 1 ? '' : 's'}.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Miembro</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Rol</TableHead>
						<TableHead>Creado</TableHead>
						<TableHead>Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each activeMembers as member}
						<TableRow>
							<TableCell>
								<div class="grid gap-0.5">
									<strong>{member.name}</strong>
									<span class="hint">{member.email}</span>
								</div>
							</TableCell>
							<TableCell>
								<Badge variant={statusVariant(member.status)}
									>{memberStatusLabel(member.status)}</Badge
								>
							</TableCell>
							<TableCell>
								<form method="POST" action="?/role" class="flex flex-wrap items-center gap-2">
									<input type="hidden" name="memberId" value={member.id}>
									<NativeSelect name="role" aria-label={`Rol de ${member.email}`}>
										{#each data.roles as role}
											<NativeSelectOption value={role} selected={role === member.role}>
												{roleLabel(role)}
											</NativeSelectOption>
										{/each}
									</NativeSelect>
									<Button type="submit" variant="outline" size="sm">Guardar rol</Button>
								</form>
							</TableCell>
							<TableCell class="whitespace-nowrap">{formatDate(member.createdAt)}</TableCell>
							<TableCell>
								{#if member.id === data.currentMemberId}
									<Badge variant="outline">Usuario actual</Badge>
								{:else}
									<form method="POST" action="?/disable">
										<input type="hidden" name="memberId" value={member.id}>
										<Button type="submit" variant="destructive" size="sm">Desactivar</Button>
									</form>
								{/if}
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</CardContent>
	</Card>

	{#if inactiveMembers.length > 0}
		<Card>
			<CardHeader>
				<CardTitle id="inactive-members-title">Inactive members</CardTitle>
				<CardDescription>
					{inactiveMembers.length}
					inactive member{inactiveMembers.length === 1 ? '' : 's'}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Miembro</TableHead>
							<TableHead>Estado</TableHead>
							<TableHead>Rol</TableHead>
							<TableHead>Desactivado</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#each inactiveMembers as member}
							<TableRow>
								<TableCell>
									<div class="grid gap-0.5">
										<strong>{member.name}</strong>
										<span class="hint">{member.email}</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge variant={statusVariant(member.status)}
										>{memberStatusLabel(member.status)}</Badge
									>
								</TableCell>
								<TableCell>{roleLabel(member.role)}</TableCell>
								<TableCell class="whitespace-nowrap">{formatDate(member.disabledAt)}</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	{/if}
</div>

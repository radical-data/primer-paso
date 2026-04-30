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
		admin: 'Administrador',
		audit_viewer: 'Visor de auditoría',
		intake_volunteer: 'Voluntario de admisión',
		authorised_signer: 'Firmante autorizado'
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
	<title>Miembros | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Administración de la organización</p>
		<h1>Miembros</h1>
		<p>
			Gestiona quién puede usar el portal de organizaciones de
			<strong>{data.organisation.name}</strong>.
		</p>

		<p>
			<a href="/dashboard">Volver al panel</a>
			{' · '}
			<a href="/admin/audit">Ver registro de auditoría</a>
		</p>

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}

		<section aria-labelledby="add-member-title">
			<h2 id="add-member-title">Añadir o reactivar un miembro</h2>
			<p>
				Esto utiliza el mecanismo de acceso del piloto actual. Un miembro puede iniciar sesión con
				su correo y el código de acceso compartido de la organización hasta que la entrega por
				correo lo sustituya.
			</p>

			<form method="POST" action="?/add">
				<div>
					<Label for="name">Nombre</Label>
					<Input
						id="name"
						name="name"
						autocomplete="name"
						required
						value={form?.intent === 'add' ? form.value?.name : ''}
					/>
				</div>

				<div>
					<Label for="email">Correo electrónico</Label>
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
					<Label for="role">Rol</Label>
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

				<p><Button type="submit">Guardar miembro</Button></p>
			</form>
		</section>

		<section aria-labelledby="active-members-title">
			<h2 id="active-members-title">Miembros activos</h2>

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
								<strong>{member.name}</strong><br>
								<span>{member.email}</span>
							</TableCell>
							<TableCell>
								<Badge variant={statusVariant(member.status)}>{member.status}</Badge>
							</TableCell>
							<TableCell>
								<form method="POST" action="?/role">
									<input type="hidden" name="memberId" value={member.id}>
									<NativeSelect name="role" aria-label={`Rol de ${member.email}`}>
										{#each data.roles as role}
											<NativeSelectOption value={role} selected={role === member.role}>
												{roleLabel(role)}
											</NativeSelectOption>
										{/each}
									</NativeSelect>
									<Button type="submit" variant="outline" size="sm">Guardar</Button>
								</form>
							</TableCell>
							<TableCell>{formatDate(member.createdAt)}</TableCell>
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
		</section>

		{#if inactiveMembers.length > 0}
			<section aria-labelledby="inactive-members-title">
				<h2 id="inactive-members-title">Miembros inactivos</h2>

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

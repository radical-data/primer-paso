<script lang="ts">
import Building2Icon from '@lucide/svelte/icons/building-2'
import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list'
import FilePlusIcon from '@lucide/svelte/icons/file-plus'
import HistoryIcon from '@lucide/svelte/icons/history'
import UsersIcon from '@lucide/svelte/icons/users'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'
import { roleLabel } from '$lib/labels'

let { data } = $props()
</script>

<svelte:head> <title>Panel | Portal de organizaciones de Primer Paso</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Panel de la organización</h1>
	</header>

	{#if data.permissionError}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">Permiso denegado</p>
			<p class="error-text">No tienes permiso para realizar esa acción en esta organización.</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle>Certificados de vulnerabilidad</CardTitle>
			<CardDescription>
				Abre un borrador enviado desde el servicio público o crea una revisión desde cero.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="grid gap-3 md:grid-cols-2">
				{#if data.session.permissions.includes("certificate:prepare")}
					<a
						href="/certificates/new"
						class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
					>
						<FilePlusIcon class="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
						<span class="grid gap-1">
							<span class="section-title">Crear revisión nueva</span>
							<span class="hint">
								Introduce los datos iniciales cuando no hay borrador público. La confirmación de la
								persona solicitante se completa antes de emitir.
							</span>
						</span>
					</a>
				{/if}

				<form
					method="GET"
					action="/handoff"
					class="panel-subtle flex items-start gap-3 transition-colors hover:bg-accent/60"
				>
					<ClipboardListIcon
						class="mt-0.5 size-5 shrink-0 text-muted-foreground"
						aria-hidden="true"
					/>
					<div class="grid flex-1 gap-3">
						<span class="grid gap-1">
							<span class="section-title">Abrir borrador público</span>
							<span class="hint"> Usa el enlace de handoff generado en el servicio público. </span>
						</span>

						<div class="grid gap-2">
							<Label for="token">Enlace de handoff</Label>
							<div class="flex flex-col gap-2 sm:flex-row">
								<Input
									id="token"
									name="token"
									autocomplete="off"
									placeholder="Pega el enlace de handoff"
								/>
								<Button type="submit">Abrir borrador</Button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</CardContent>
	</Card>

	{#if data.adminLinks.canManageOrganisation || data.adminLinks.canManageMembers || data.adminLinks.canReadAudit}
		<Card>
			<CardHeader>
				<CardTitle>Administración de la organización</CardTitle>
				<CardDescription>Herramientas disponibles según tu permiso.</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-3 md:grid-cols-2">
					{#if data.adminLinks.canManageOrganisation}
						<a
							href="/admin/organisation"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<Building2Icon
								class="mt-0.5 size-5 shrink-0 text-muted-foreground"
								aria-hidden="true"
							/>
							<span class="grid gap-1">
								<span class="section-title">Datos de organización</span>
								<span class="hint">
									Actualiza los datos de la organización y su certificado de firma.
								</span>
							</span>
						</a>
					{/if}
					{#if data.adminLinks.canManageMembers}
						<a
							href="/admin/members"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<UsersIcon class="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
							<span class="grid gap-1">
								<span class="section-title">Gestionar miembros</span>
								<span class="hint">
									Añade, desactiva o cambia el rol de los miembros de la organización.
								</span>
							</span>
						</a>
					{/if}
					{#if data.adminLinks.canReadAudit}
						<a
							href="/admin/audit"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<HistoryIcon
								class="mt-0.5 size-5 shrink-0 text-muted-foreground"
								aria-hidden="true"
							/>
							<span class="grid gap-1">
								<span class="section-title">Ver registro de auditoría</span>
								<span class="hint">
									Revisa las acciones realizadas en el portal para esta organización.
								</span>
							</span>
						</a>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/if}
</div>

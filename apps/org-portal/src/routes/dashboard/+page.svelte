<script lang="ts">
import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list'
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
		<div class="actions">
			<span class="hint">Sesión iniciada como</span>
			<Badge variant="secondary">{roleLabel(data.session.role)}</Badge>
		</div>
	</header>

	{#if data.permissionError}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">Permiso denegado</p>
			<p class="error-text">No tienes permiso para realizar esa acción en esta organización.</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle>
				<span class="inline-flex items-center gap-2">
					<ClipboardListIcon class="size-5 text-muted-foreground" aria-hidden="true" />
					Abrir un borrador de certificado
				</span>
			</CardTitle>
			<CardDescription>
				Escanea un código QR de Primer Paso o pega abajo el enlace o código del borrador.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="GET" action="/handoff" class="stack">
				<div class="form-field">
					<Label for="token">Enlace o código del borrador</Label>
					<Input id="token" name="token" autocomplete="off" placeholder="Pega un enlace o código" />
				</div>
				<div class="actions"><Button type="submit">Abrir borrador</Button></div>
			</form>
		</CardContent>
	</Card>

	{#if data.adminLinks.canManageMembers || data.adminLinks.canReadAudit}
		<Card>
			<CardHeader>
				<CardTitle>Administración de la organización</CardTitle>
				<CardDescription>Herramientas disponibles según tu permiso.</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-3 md:grid-cols-2">
					{#if data.adminLinks.canManageMembers}
						<a
							href="/admin/members"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<UsersIcon class="size-5 mt-0.5 text-muted-foreground" aria-hidden="true" />
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
							<HistoryIcon class="size-5 mt-0.5 text-muted-foreground" aria-hidden="true" />
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

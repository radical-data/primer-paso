<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@primer-paso/ui/table'
import { auditEventLabel, formatAuditEventData } from '$lib/labels'

let { data } = $props()

const formatDate = (value: string) =>
	new Intl.DateTimeFormat('es-ES', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/Madrid'
	}).format(new Date(value))
</script>

<svelte:head>
	<title>Registro de auditoría | Portal de organizaciones de Primer Paso</title>
</svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Administración de la organización</p>
		<h1 class="page-title">Registro de auditoría</h1>
		<p class="supporting-text">
			Últimas acciones registradas para <strong>{data.organisation.name}</strong>.
		</p>
	</header>

	<div class="bleed-wide">
		<Card>
			<CardHeader>
				<CardTitle>Eventos recientes</CardTitle>
				<CardDescription>
					{data.events.length}
					evento{data.events.length === 1 ? '' : 's'}
					registrado{data.events.length === 1
						? ''
						: 's'}.
				</CardDescription>
			</CardHeader>
			<CardContent>
				{#if data.events.length === 0}
					<p class="hint">Aún no se ha registrado ningún evento de auditoría.</p>
				{:else}
					<div class="max-h-[60vh] overflow-auto rounded-lg border border-border/60">
						<Table>
							<TableHeader class="sticky top-0 bg-muted/80 backdrop-blur z-10">
								<TableRow>
									<TableHead>Hora</TableHead>
									<TableHead>Evento</TableHead>
									<TableHead>Actor</TableHead>
									<TableHead>Revisión</TableHead>
									<TableHead>Detalles</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{#each data.events as event}
									<TableRow>
										<TableCell class="whitespace-nowrap">{formatDate(event.createdAt)}</TableCell>
										<TableCell>
											<Badge variant="secondary">{auditEventLabel(event.eventType)}</Badge>
										</TableCell>
										<TableCell>{event.memberEmail ?? 'Sistema'}</TableCell>
										<TableCell>
											{#if event.reviewId}
												<a
													class="text-primary underline-offset-4 hover:underline"
													href={`/reviews/${event.reviewId}`}
												>
													Ver revisión
												</a>
											{:else}
												<span class="text-muted-foreground">—</span>
											{/if}
										</TableCell>
										<TableCell class="whitespace-normal text-muted-foreground">
											{formatAuditEventData(event.eventData)}
										</TableCell>
									</TableRow>
								{/each}
							</TableBody>
						</Table>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>

	<div class="actions">
		<Button href="/dashboard" variant="ghost">
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Volver al panel
		</Button>
	</div>
</div>

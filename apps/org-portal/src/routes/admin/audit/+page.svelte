<script lang="ts">
import { Badge } from '@primer-paso/ui/badge'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@primer-paso/ui/table'

let { data } = $props()

const formatDate = (value: string) =>
	new Intl.DateTimeFormat('en-GB', {
		dateStyle: 'medium',
		timeStyle: 'short',
		timeZone: 'Europe/Madrid'
	}).format(new Date(value))

const formatEventData = (eventData: Record<string, unknown>) => {
	const entries = Object.entries(eventData)
	if (entries.length === 0) return '—'

	return entries
		.map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
		.join(', ')
}
</script>

<svelte:head>
	<title>Registro de auditoría | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Administración de la organización</p>
		<h1>Registro de auditoría</h1>
		<p>Últimas acciones registradas para <strong>{data.organisation.name}</strong>.</p>

		<p><a href="/dashboard">Volver al panel</a></p>

		{#if data.events.length === 0}
			<p>Aún no se ha registrado ningún evento de auditoría.</p>
		{:else}
			<Table>
				<TableHeader>
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
							<TableCell>{formatDate(event.createdAt)}</TableCell>
							<TableCell> <Badge variant="secondary">{event.eventType}</Badge> </TableCell>
							<TableCell>{event.memberEmail ?? 'Sistema'}</TableCell>
							<TableCell>
								{#if event.reviewId}
									<a href={`/reviews/${event.reviewId}`}>Abrir revisión</a>
								{:else}
									<span>—</span>
								{/if}
							</TableCell>
							<TableCell class="whitespace-normal">{formatEventData(event.eventData)}</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</section>
</main>

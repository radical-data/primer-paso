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
	<title>Audit log | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Organisation admin</p>
		<h1>Audit log</h1>
		<p>Latest recorded actions for <strong>{data.organisation.name}</strong>.</p>

		<p><a href="/dashboard">Back to dashboard</a></p>

		{#if data.events.length === 0}
			<p>No audit events have been recorded yet.</p>
		{:else}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Time</TableHead>
						<TableHead>Event</TableHead>
						<TableHead>Actor</TableHead>
						<TableHead>Review</TableHead>
						<TableHead>Details</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each data.events as event}
						<TableRow>
							<TableCell>{formatDate(event.createdAt)}</TableCell>
							<TableCell> <Badge variant="secondary">{event.eventType}</Badge> </TableCell>
							<TableCell>{event.memberEmail ?? 'System'}</TableCell>
							<TableCell>
								{#if event.reviewId}
									<a href={`/reviews/${event.reviewId}`}>Open review</a>
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

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

<svelte:head> <title>Audit log | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Organisation admin</p>
		<h1 class="page-title">Audit log</h1>
		<p class="supporting-text">
			Latest recorded actions for <strong>{data.organisation.name}</strong>.
		</p>
	</header>

	<div class="actions">
		<Button href="/dashboard" variant="ghost">
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Back to dashboard
		</Button>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Recent events</CardTitle>
			<CardDescription>
				{data.events.length}
				event{data.events.length === 1 ? '' : 's'}
				recorded.
			</CardDescription>
		</CardHeader>
		<CardContent>
			{#if data.events.length === 0}
				<p class="hint">No audit events have been recorded yet.</p>
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
								<TableCell class="whitespace-nowrap">{formatDate(event.createdAt)}</TableCell>
								<TableCell> <Badge variant="secondary">{event.eventType}</Badge> </TableCell>
								<TableCell>{event.memberEmail ?? 'System'}</TableCell>
								<TableCell>
									{#if event.reviewId}
										<a
											class="text-primary underline-offset-4 hover:underline"
											href={`/reviews/${event.reviewId}`}
										>
											Open review
										</a>
									{:else}
										<span class="text-muted-foreground">—</span>
									{/if}
								</TableCell>
								<TableCell class="whitespace-normal text-muted-foreground">
									{formatEventData(event.eventData)}
								</TableCell>
							</TableRow>
						{/each}
					</TableBody>
				</Table>
			{/if}
		</CardContent>
	</Card>
</div>

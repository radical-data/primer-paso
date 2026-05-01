<script lang="ts">
import { page } from '$app/state'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'

const status = $derived(page.status)
const message = $derived(page.error?.message ?? 'Something went wrong.')
</script>

<svelte:head> <title>{status} | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<Card class="text-center">
		<CardHeader class="items-center">
			<p class="eyebrow">Error {status}</p>
			<CardTitle class="page-title text-center">
				{#if status === 404}
					Page not found
				{:else if status === 403}
					Not authorised
				{:else}
					Something went wrong
				{/if}
			</CardTitle>
			<CardDescription class="text-pretty">{message}</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="actions justify-center">
				<Button href="/dashboard">Go to dashboard</Button>
				<Button href="/" variant="ghost">Back to start</Button>
			</div>
		</CardContent>
	</Card>
</div>

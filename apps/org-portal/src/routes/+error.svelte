<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent } from '@primer-paso/ui/card'
import { page } from '$app/state'

const status = $derived(page.status)
const message = $derived(page.error?.message ?? 'Something went wrong.')
</script>

<svelte:head> <title>{status} | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<Card>
		<CardContent class="grid gap-3 justify-items-center text-center py-4">
			<p class="eyebrow">Error {status}</p>
			<h1 class="text-balance text-[clamp(1.5rem,2.5vw,2rem)] font-semibold tracking-tight">
				{#if status === 404}
					Page not found
				{:else if status === 403}
					Not authorised
				{:else}
					Something went wrong
				{/if}
			</h1>
			<p class="supporting-text text-pretty">{message}</p>
			<div class="actions justify-center pt-2">
				<Button href="/dashboard">Go to dashboard</Button>
				<Button href="/" variant="ghost">Back to start</Button>
			</div>
		</CardContent>
	</Card>
</div>

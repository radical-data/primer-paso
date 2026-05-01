<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'

let { data } = $props()
</script>

<svelte:head> <title>Certificate handoff | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Certificate handoff</h1>
	</header>

	<Card>
		<CardHeader>
			<CardTitle>
				{#if data.hasToken}
					Handoff reference received
				{:else}
					No handoff reference
				{/if}
			</CardTitle>
			<CardDescription>
				{#if data.hasToken}
					Sign in as an authorised organisation user to open the draft.
				{:else}
					Open this page from a Primer Paso certificate handoff QR code or link.
				{/if}
			</CardDescription>
		</CardHeader>
		{#if !data.hasToken}
			<CardContent>
				<form method="GET" action="/handoff" class="stack">
					<div class="form-field">
						<Label for="token">Handoff token or link</Label>
						<Input id="token" name="token" autocomplete="off" placeholder="Paste a token or URL" />
					</div>
					<div class="actions"><Button type="submit">Open handoff</Button></div>
				</form>
			</CardContent>
		{/if}
	</Card>
</div>

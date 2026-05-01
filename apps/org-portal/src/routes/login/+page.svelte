<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'

let { data, form } = $props()
</script>

<svelte:head> <title>Sign in | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<div class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Sign in to the organisation portal</h1>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Send a sign-in link</CardTitle>
			<CardDescription>
				{#if data.hasPendingHandoff}
					Sign in to open the certificate handoff.
				{:else}
					Enter your organisation email. We'll send you a secure sign-in link.
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="stack">
			{#if form?.success}
				<div class="panel-subtle" role="status">
					<p class="text-pretty">
						{form.message ?? 'Check your email. The sign-in link will open this portal.'}
					</p>
				</div>
			{:else}
				{#if form?.error}
					<div class="error-summary" role="alert">
						<p class="error-summary-title">Could not send sign-in link</p>
						<p class="error-text">{form.error}</p>
					</div>
				{/if}
				<form method="POST" class="stack">
					<input type="hidden" name="next" value={data.next}>
					<div class="form-field">
						<Label for="email">Organisation email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							value={form?.email ?? data.email ?? ''}
						/>
					</div>
					<div class="actions"><Button type="submit">Send sign-in link</Button></div>
				</form>
			{/if}

			{#if !form?.success}
				<p class="hint">Access is limited to authorised members of collaborating organisations.</p>
			{/if}
		</CardContent>
	</Card>
</div>

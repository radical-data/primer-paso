<script lang="ts">
let { data, form } = $props()
</script>

<svelte:head>
	<title>Sign in | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Sign in to the organisation portal</h1>

		{#if data.hasPendingHandoff}
			<p>Sign in to open the certificate handoff.</p>
		{:else}
			<p>Enter your organisation email. We'll send you a secure sign-in link.</p>
		{/if}

		{#if form?.success}
			<p role="status">
				{form.message ?? 'Check your email. The sign-in link will open this portal.'}
			</p>
		{:else}
			{#if form?.error}
				<p role="alert">{form.error}</p>
			{/if}
			<form method="POST" class="stack">
				<input type="hidden" name="next" value={data.next}>
				<label for="email">Organisation email</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? data.email ?? ''}
				>
				<button type="submit">Send sign-in link</button>
			</form>
		{/if}

		{#if !form?.success}
			<p>Access is limited to authorised members of collaborating organisations.</p>
		{/if}
	</section>
</main>

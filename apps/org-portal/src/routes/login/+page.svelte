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
			<p>After signing in, you will continue to the certificate handoff.</p>
		{/if}

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}

		<form method="POST" class="stack">
			<label>
				Organisation email
				<input name="email" type="email" autocomplete="email" value={form?.email ?? ''} required>
			</label>

			<label>
				Access code
				<input name="code" type="password" autocomplete="one-time-code" required>
			</label>

			<button type="submit">Sign in</button>
		</form>

		<p>Access is limited to authorised members of collaborating organisations.</p>
	</section>
</main>

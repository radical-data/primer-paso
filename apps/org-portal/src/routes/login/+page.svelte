<script lang="ts">
let { data, form } = $props()
</script>

<svelte:head>
	<title>Iniciar sesión | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Iniciar sesión en el portal de organizaciones</h1>

		{#if data.hasPendingHandoff}
			<p>Inicia sesión para abrir la entrega de certificado.</p>
		{:else}
			<p>Introduce el correo de tu organización. Te enviaremos un enlace de acceso seguro.</p>
		{/if}

		{#if form?.success}
			<p role="status">
				{form.message ?? 'Revisa tu correo. El enlace de acceso abrirá este portal.'}
			</p>
		{:else}
			{#if form?.error}
				<p role="alert">{form.error}</p>
			{/if}
			<form method="POST" class="stack">
				<input type="hidden" name="next" value={data.next}>
				<label for="email">Correo de la organización</label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email ?? data.email ?? ''}
				>
				<button type="submit">Enviar enlace de acceso</button>
			</form>
		{/if}

		{#if !form?.success}
			<p>El acceso está limitado a miembros autorizados de organizaciones colaboradoras.</p>
		{/if}
	</section>
</main>

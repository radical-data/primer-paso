<script lang="ts">
let { data } = $props()
</script>

<svelte:head>
	<title>Borrador de certificado | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Borrador de certificado</h1>

		{#if data.hasToken}
			<p>
				Se ha recibido una referencia de borrador. Inicia sesión como persona autorizada de la
				organización para abrirlo.
			</p>
		{:else}
			<p>
				No se ha proporcionado ninguna referencia de borrador. Abre esta página desde un código QR
				de Primer Paso o pega el enlace o código del borrador.
			</p>
			<form method="GET" action="/handoff">
				<label>
					Enlace o código del borrador
					<input name="token" autocomplete="off">
				</label>
				<button type="submit">Abrir borrador</button>
			</form>
		{/if}
	</section>
</main>

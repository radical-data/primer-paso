<script lang="ts">
let { data } = $props()
</script>

<svelte:head>
	<title>Entrega de certificado | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Entrega de certificado</h1>

		{#if data.hasToken}
			<p>
				Se recibió una referencia de entrega. Inicia sesión como persona usuaria autorizada de la
				organización para abrir el borrador.
			</p>
		{:else}
			<p>
				No se proporcionó ninguna referencia de entrega. Abre esta página desde un código QR o
				enlace de entrega de certificado de Primer Paso.
			</p>
			<form method="GET" action="/handoff">
				<label>
					Token o enlace de entrega
					<input name="token" autocomplete="off">
				</label>
				<button type="submit">Abrir entrega</button>
			</form>
		{/if}
	</section>
</main>

<script lang="ts">
let { data } = $props()
</script>

<svelte:head>
	<title>Certificate handoff | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Certificate handoff</h1>

		{#if data.hasToken}
			<p>
				A handoff reference was received. Sign in as an authorised organisation user to open the
				draft.
			</p>
		{:else}
			<p>
				No handoff reference was provided. Open this page from a Primer Paso certificate handoff QR
				code or link.
			</p>
			<form method="GET" action="/handoff">
				<label>
					Handoff token or link
					<input name="token" autocomplete="off">
				</label>
				<button type="submit">Open handoff</button>
			</form>
		{/if}
	</section>
</main>

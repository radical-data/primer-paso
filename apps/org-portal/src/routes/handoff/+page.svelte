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
				A handoff reference was received. In the next PR this page will require an authorised
				organisation user to sign in before the draft can be opened.
			</p>
		{:else}
			<p>
				No handoff reference was provided. Open this page from a Primer Paso certificate handoff QR
				code or link.
			</p>
		{/if}

		<p>
			This portal will handle organisation review, verification confirmations, issuing, and audit
			history.
		</p>
	</section>
</main>

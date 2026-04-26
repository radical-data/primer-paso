<script lang="ts">
let { data } = $props()
</script>

<svelte:head>
	<title>Dashboard | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Primer Paso</p>
		<h1>Organisation dashboard</h1>

		{#if data.permissionError}
			<p role="alert">You do not have permission to perform that action for this organisation.</p>
		{/if}

		<p>
			You are signed in as an organisation member with the role
			<strong>{data.session.role}</strong>.
		</p>

		<h2>Open a certificate handoff</h2>
		<form method="GET" action="/handoff" class="stack">
			<label>
				Handoff token or link
				<input name="token" autocomplete="off">
			</label>
			<button type="submit">Open handoff</button>
		</form>

		<p>Open this page from a Primer Paso QR code, or paste the handoff link/token above.</p>

		<form method="POST" action="/logout"><button type="submit">Sign out</button></form>
	</section>
</main>

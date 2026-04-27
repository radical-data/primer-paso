<script lang="ts">
import { Button } from '@primer-paso/ui/button'

let { data } = $props()

const expiresAt = $derived(
	new Date(data.expiresAt).toLocaleString(data.locale ?? 'es', {
		timeZone: 'Europe/Madrid'
	})
)
</script>

<svelte:head>
	<title>Certificate handoff created | Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<section class="stack">
	<p class="eyebrow">Certificate handoff</p>

	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">Take this handoff to a collaborating organisation</h1>
			<p class="lead-text">
				The certificate draft has been saved for organisation review. This is still not an issued
				certificate.
			</p>
			<p class="hint">
				The organisation must open the handoff, check the information, decide what it can certify,
				and issue the final document.
			</p>
		</div>

		<section class="panel section-block">
			<h2 class="section-title">Reference code</h2>
			<p class="lead-text">{data.referenceCode}</p>
			<p class="hint">Expires: {expiresAt}</p>
		</section>

		<section class="panel section-block">
			<h2 class="section-title">QR code</h2>
			<p class="hint">
				Show this QR code to the organisation. It contains a handoff link, not the full certificate
				information.
			</p>
			<img
				src={data.qrHref}
				alt="QR code for the organisation certificate handoff"
				width="256"
				height="256"
				loading="eager"
			>
		</section>

		<section class="panel-subtle section-block">
			<h2 class="section-title">Organisation link</h2>
			<p class="hint">
				This link is for authorised organisation users. Show the QR code or reference code to the
				organisation rather than opening it yourself.
			</p>
			<p class="break-all">{data.orgHandoffUrl}</p>
		</section>

		<div class="actions"><Button href={data.backHref} variant="outline">Back</Button></div>
	</div>
</section>

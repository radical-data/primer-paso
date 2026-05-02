<script lang="ts">
import { Button } from '@primer-paso/ui/button'

let { data } = $props()

let copied = $state(false)
let copyFailed = $state(false)

/* Clipboard: UI Button spreads rest props onto a native button, so onclick is forwarded. */
async function copyOrgHandoffUrl() {
	copyFailed = false

	if (!navigator.clipboard?.writeText) {
		copyFailed = true
		return
	}

	try {
		await navigator.clipboard.writeText(data.orgHandoffUrl)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2500)
	} catch {
		copyFailed = true
	}
}

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
			<p class="lead-text">Show this QR code or secure link to the organisation.</p>
			<p class="hint">
				The organisation must open the handoff, check the information, decide what it can certify,
				and issue the final document.
			</p>
		</div>

		<section class="panel section-block">
			<h2 class="section-title">QR code</h2>
			<p class="hint">
				This QR code opens the secure organisation handoff link. It does not contain the full
				certificate information.
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
			<h2 class="section-title">Organisation secure link</h2>
			<p class="hint">
				If the QR code cannot be scanned, the organisation can copy or type this secure link. This
				link is for authorised organisation users only. Do not open it yourself instead of handing
				it to the organisation.
			</p>
			<p class="break-all">{data.orgHandoffUrl}</p>
			<div class="actions" style="margin-top: 0.75rem">
				<Button type="button" variant="outline" size="sm" onclick={copyOrgHandoffUrl}>
					Copy secure link
				</Button>
			</div>
			{#if copied}
				<p class="hint" role="status" aria-live="polite">Link copied.</p>
			{/if}
			{#if copyFailed}
				<p class="hint" role="status" aria-live="polite">
					Copy did not work. You can select the link text above instead.
				</p>
			{/if}
		</section>

		<section class="panel section-block">
			<h2 class="section-title">Reference code</h2>
			<p class="hint">
				Use this code only if support staff need to identify this handoff. It cannot open the draft.
			</p>
			<p class="lead-text">{data.referenceCode}</p>
			<p class="hint">Expires: {expiresAt}</p>
		</section>

		<div class="actions"><Button href={data.backHref} variant="outline">Back</Button></div>
	</div>
</section>

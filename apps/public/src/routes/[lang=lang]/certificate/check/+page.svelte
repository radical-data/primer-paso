<script lang="ts">
import { Button } from '@primer-paso/ui/button'

let { data, form } = $props()

const draft = $derived(data.draft)
const identity = $derived(draft.userData.identity)
const contact = $derived(draft.userData.contact)
const location = $derived(draft.userData.location)
const vulnerability = $derived(draft.userData.vulnerability)
const hasConsent = $derived(Boolean(data.consent))
</script>

<svelte:head>
	<title>Check certificate draft | Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<section class="stack">
	<p class="eyebrow">Certificate draft</p>

	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">Check the certificate draft</h1>
			<p class="lead-text">
				This is still only a draft. A collaborating organisation must review the details before
				issuing any certificate.
			</p>
		</div>

		{#if form?.error}
			<div class="panel-subtle section-block" role="alert">
				<h2 class="section-title">Consent needed</h2>
				<p>{form.error}</p>
			</div>
		{/if}

		<section class="panel section-block">
			<div class="actions">
				<Button href={data.editHref} variant="outline">Change details</Button>
				<Button href={data.jsonHref} variant="secondary">Download draft JSON</Button>
			</div>
		</section>

		<section class="panel section-block">
			<h2 class="section-title">Identity details</h2>
			<dl class="check-list">
				<div class="check-row">
					<dt>Given names</dt>
					<dd>{identity.givenNames}</dd>
				</div>
				<div class="check-row">
					<dt>Family names</dt>
					<dd>{identity.familyNames}</dd>
				</div>
				<div class="check-row">
					<dt>Document type</dt>
					<dd>{identity.documentType}</dd>
				</div>
				<div class="check-row">
					<dt>Document number</dt>
					<dd>{identity.documentNumber}</dd>
				</div>
				{#if identity.dateOfBirth}
					<div class="check-row">
						<dt>Date of birth</dt>
						<dd>{identity.dateOfBirth}</dd>
					</div>
				{/if}
				{#if identity.nationality}
					<div class="check-row">
						<dt>Nationality</dt>
						<dd>{identity.nationality}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section class="panel section-block">
			<h2 class="section-title">Contact and address</h2>
			<dl class="check-list">
				<div class="check-row">
					<dt>Email</dt>
					<dd>{contact.email}</dd>
				</div>
				{#if contact.phone}
					<div class="check-row">
						<dt>Phone</dt>
						<dd>{contact.phone}</dd>
					</div>
				{/if}
				<div class="check-row">
					<dt>Address</dt>
					<dd>
						{location.addressLine1}
						{#if location.addressLine2}
							, {location.addressLine2}
						{/if}
					</dd>
				</div>
				<div class="check-row">
					<dt>Municipality</dt>
					<dd>{location.municipality}</dd>
				</div>
				<div class="check-row">
					<dt>Province</dt>
					<dd>{location.province}</dd>
				</div>
				{#if location.postalCode}
					<div class="check-row">
						<dt>Postcode</dt>
						<dd>{location.postalCode}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section class="panel section-block">
			<h2 class="section-title">Vulnerability details</h2>
			<div class="list-section">
				<h3>Vulnerability circumstances</h3>
				<ul>
					{#each vulnerability.reasons as reason}
						<li>{reason}</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="cta-panel section-block">
			<h2 class="section-title">Consent before handoff</h2>
			{#if hasConsent}
				<p class="lead-text">Consent has been recorded for this draft.</p>
				{#if data.handoffEnabled}
					<form method="POST" action={data.handoffHref}>
						<Button type="submit">Create organisation handoff</Button>
					</form>
				{:else}
					<p class="hint">
						Handoff creation is not enabled yet. The next PR should replace this with a
						database-backed token and QR code.
					</p>
				{/if}
			{:else}
				<form method="POST" class="stack">
					<label class="choice-row">
						<input type="checkbox" name="informationAccurate" value="yes">
						<span>The information is accurate to the best of my knowledge.</span>
					</label>
					<label class="choice-row">
						<input type="checkbox" name="understandsNotIssued" value="yes">
						<span>I understand this is not an issued certificate.</span>
					</label>
					<label class="choice-row">
						<input type="checkbox" name="consentsToShareWithOrganisation" value="yes">
						<span
							>I consent to sharing this draft with a collaborating organisation for review.</span
						>
					</label>
					<div class="actions"><Button type="submit">Record consent</Button></div>
				</form>
			{/if}
		</section>
	</div>
</section>

<script lang="ts">
let { data, form } = $props()

type VerificationFormValue = {
	passportOrIdentityDocumentChecked: boolean
	userInformationConfirmed: boolean
	vulnerabilityInformationReviewed: boolean
}

const emptyVerification: VerificationFormValue = {
	passportOrIdentityDocumentChecked: false,
	userInformationConfirmed: false,
	vulnerabilityInformationReviewed: false
}

const formVerification = $derived.by(() => {
	if (form && 'verification' in form) {
		return form.verification as VerificationFormValue
	}

	return undefined
})

const identity = $derived(data.draft.userData.identity)
const contact = $derived(data.draft.userData.contact)
const location = $derived(data.draft.userData.location)
const vulnerability = $derived(data.draft.userData.vulnerability)
const review = $derived(data.review)
const verification = $derived(formVerification ?? review.verification ?? emptyVerification)
</script>

<svelte:head>
	<title>Review certificate handoff | Primer Paso organisation portal</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Certificate handoff</p>
		<h1>Review certificate draft</h1>

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}

		<p>
			This is a user-prepared draft. Do not issue a certificate unless your organisation has checked
			the information and can certify the circumstances.
		</p>

		<section>
			<h2>Review status</h2>
			<p><strong>{data.review.status}</strong></p>
		</section>

		<section>
			<h2>Identity details</h2>
			<dl>
				<div>
					<dt>Given names</dt>
					<dd>{identity.givenNames}</dd>
				</div>
				<div>
					<dt>Family names</dt>
					<dd>{identity.familyNames}</dd>
				</div>
				<div>
					<dt>Document type</dt>
					<dd>{identity.documentType}</dd>
				</div>
				<div>
					<dt>Document number</dt>
					<dd>{identity.documentNumber}</dd>
				</div>
				{#if identity.dateOfBirth}
					<div>
						<dt>Date of birth</dt>
						<dd>{identity.dateOfBirth}</dd>
					</div>
				{/if}
				{#if identity.nationality}
					<div>
						<dt>Nationality</dt>
						<dd>{identity.nationality}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section>
			<h2>Contact and address</h2>
			<dl>
				<div>
					<dt>Email</dt>
					<dd>{contact.email}</dd>
				</div>
				{#if contact.phone}
					<div>
						<dt>Phone</dt>
						<dd>{contact.phone}</dd>
					</div>
				{/if}
				<div>
					<dt>Address</dt>
					<dd>
						{location.addressLine1}
						{#if location.addressLine2}
							, {location.addressLine2}
						{/if}
					</dd>
				</div>
				<div>
					<dt>Municipality</dt>
					<dd>{location.municipality}</dd>
				</div>
				<div>
					<dt>Province</dt>
					<dd>{location.province}</dd>
				</div>
				{#if location.postalCode}
					<div>
						<dt>Postcode</dt>
						<dd>{location.postalCode}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section>
			<h2>Vulnerability circumstances</h2>
			<ul>
				{#each vulnerability.reasons as reason}
					<li>{reason}</li>
				{/each}
			</ul>
		</section>

		<form method="POST" action="?/save">
			<h2>Verification confirmations</h2>
			<label>
				<input
					type="checkbox"
					name="passportOrIdentityDocumentChecked"
					value="yes"
					checked={verification.passportOrIdentityDocumentChecked}
				>
				I checked the identity document where available.
			</label>
			<label>
				<input
					type="checkbox"
					name="userInformationConfirmed"
					value="yes"
					checked={verification.userInformationConfirmed}
				>
				I confirmed these details with the person.
			</label>
			<label>
				<input
					type="checkbox"
					name="vulnerabilityInformationReviewed"
					value="yes"
					checked={verification.vulnerabilityInformationReviewed}
				>
				I reviewed the vulnerability circumstances.
			</label>
			<p>This review action is recorded in the audit log.</p>
			<button type="submit">Save review</button>
			{#if data.canMarkReadyToIssue}
				<button type="submit" formaction="?/ready">Mark ready to issue</button>
			{/if}
		</form>

		<p><a href="/dashboard">Back to dashboard</a></p>
	</section>
</main>

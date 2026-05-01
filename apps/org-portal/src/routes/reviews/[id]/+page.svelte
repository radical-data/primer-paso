<script lang="ts">
import DownloadIcon from '@lucide/svelte/icons/download'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Separator } from '@primer-paso/ui/separator'

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

const statusTone = $derived(
	review.status === 'issued' ? 'success' : review.status === 'ready_to_issue' ? 'info' : 'warning'
)
</script>

<svelte:head>
	<title>Review certificate handoff | Primer Paso organisation portal</title>
</svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Certificate handoff</p>
		<h1 class="page-title">Review certificate draft</h1>
		<div class="actions">
			<span class="status-pill" data-tone={statusTone}>{review.status}</span>
		</div>
	</header>

	{#if form?.error}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">Could not save review</p>
			<p class="error-text">{form.error}</p>
		</div>
	{/if}

	<div class="panel-subtle">
		<p class="supporting-text">
			This is a user-prepared draft. Do not issue a certificate unless your organisation has checked
			the information and can certify the circumstances.
		</p>
	</div>

	<Card>
		<CardHeader> <CardTitle>Identity details</CardTitle> </CardHeader>
		<CardContent>
			<dl class="summary-grid">
				<div class="summary-item">
					<dt class="summary-label">Given names</dt>
					<dd class="summary-value">{identity.givenNames}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Family names</dt>
					<dd class="summary-value">{identity.familyNames}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Document type</dt>
					<dd class="summary-value">{identity.documentType}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Document number</dt>
					<dd class="summary-value">{identity.documentNumber}</dd>
				</div>
				{#if identity.dateOfBirth}
					<div class="summary-item">
						<dt class="summary-label">Date of birth</dt>
						<dd class="summary-value">{identity.dateOfBirth}</dd>
					</div>
				{/if}
				{#if identity.nationality}
					<div class="summary-item">
						<dt class="summary-label">Nationality</dt>
						<dd class="summary-value">{identity.nationality}</dd>
					</div>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<Card>
		<CardHeader> <CardTitle>Contact and address</CardTitle> </CardHeader>
		<CardContent>
			<dl class="summary-grid">
				<div class="summary-item">
					<dt class="summary-label">Email</dt>
					<dd class="summary-value">{contact.email}</dd>
				</div>
				{#if contact.phone}
					<div class="summary-item">
						<dt class="summary-label">Phone</dt>
						<dd class="summary-value">{contact.phone}</dd>
					</div>
				{/if}
				<div class="summary-item">
					<dt class="summary-label">Address</dt>
					<dd class="summary-value">
						{location.addressLine1}
						{#if location.addressLine2}
							, {location.addressLine2}
						{/if}
					</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Municipality</dt>
					<dd class="summary-value">{location.municipality}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Province</dt>
					<dd class="summary-value">{location.province}</dd>
				</div>
				{#if location.postalCode}
					<div class="summary-item">
						<dt class="summary-label">Postcode</dt>
						<dd class="summary-value">{location.postalCode}</dd>
					</div>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<Card>
		<CardHeader> <CardTitle>Vulnerability circumstances</CardTitle> </CardHeader>
		<CardContent>
			<ul class="grid gap-2 list-disc ps-5">
				{#each vulnerability.reasons as reason}
					<li>{vulnerabilityReasonLabel(reason)}</li>
				{/each}
			</ul>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Verification confirmations</CardTitle>
			<CardDescription>This review action is recorded in the audit log.</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/save" class="stack">
				<div class="check-list">
					<label class="check-row">
						<input
							type="checkbox"
							name="passportOrIdentityDocumentChecked"
							value="yes"
							checked={verification.passportOrIdentityDocumentChecked}
							class="mt-1 size-4"
						>
						<span class="text-sm leading-6">
							I checked the identity document where available.
						</span>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="userInformationConfirmed"
							value="yes"
							checked={verification.userInformationConfirmed}
							class="mt-1 size-4"
						>
						<span class="text-sm leading-6"> I confirmed these details with the person. </span>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="vulnerabilityInformationReviewed"
							value="yes"
							checked={verification.vulnerabilityInformationReviewed}
							class="mt-1 size-4"
						>
						<span class="text-sm leading-6"> I reviewed the vulnerability circumstances. </span>
					</label>
				</div>
				<Separator />
				<div class="actions">
					<Button type="submit">Save review</Button>
					{#if data.canMarkReadyToIssue}
						<Button type="submit" formaction="?/ready" variant="secondary">
							Mark ready to issue
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	{#if data.canIssueCertificate}
		<Card>
			<CardHeader>
				<CardTitle>Issue certificate</CardTitle>
				<CardDescription>
					You can issue the certificate now that the review is ready.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" action="?/issue">
					<Button type="submit" variant="success">Issue certificate</Button>
				</form>
			</CardContent>
		</Card>
	{/if}

	{#if data.certificateHref}
		<Card>
			<CardHeader> <CardTitle>Issued certificate</CardTitle> </CardHeader>
			<CardContent>
				<Button href={data.certificateHref} variant="outline">
					<DownloadIcon class="size-4" aria-hidden="true" />
					Download issued certificate
				</Button>
			</CardContent>
		</Card>
	{/if}
</div>

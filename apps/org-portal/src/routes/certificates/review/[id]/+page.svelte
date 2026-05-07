<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import DownloadIcon from '@lucide/svelte/icons/download'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Separator } from '@primer-paso/ui/separator'
import CertificateReviewForm from '$lib/components/certificate-review-form.svelte'
import { reviewStatusLabel } from '$lib/labels'

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

const review = $derived(data.review)
const verification = $derived(formVerification ?? review.verification ?? emptyVerification)
const statusTone = $derived(
	review.status === 'issued' ? 'success' : review.status === 'ready_to_issue' ? 'info' : 'warning'
)

const defaultConfirmationMethod = $derived(
	data.review.applicantConfirmation?.method ??
		(data.review.origin === 'public_handoff' ? 'public_handoff' : 'organisation_in_person')
)
let confirmationMethod = $state('')

$effect(() => {
	if (!confirmationMethod) {
		confirmationMethod = defaultConfirmationMethod
	}
})
</script>

<svelte:head>
	<title>Revisar borrador de certificado | Portal de organizaciones de Primer Paso</title>
</svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Borrador de certificado</p>
		<h1 class="page-title">Revisar el borrador del certificado</h1>
		<div class="actions">
			<span class="status-pill" data-tone={statusTone}>{reviewStatusLabel(review.status)}</span>
		</div>
	</header>

	{#if form?.error}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">No se pudo guardar la revisión</p>
			<p class="error-text">{form.error}</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle>Datos revisados</CardTitle>
			<CardDescription>
				Revisa y corrige los datos que se usarán para emitir el certificado.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<CertificateReviewForm
				value={data.formValue}
				documentTypeOptions={data.documentTypeOptions}
				vulnerabilityReasonOptions={data.vulnerabilityReasonOptions}
				correctionTypeOptions={data.correctionTypeOptions}
				action="?/updateReviewedData"
				submitLabel="Guardar datos revisados"
				showCorrectionControls
				error={form?.error}
			/>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Applicant confirmation</CardTitle>
			<CardDescription>
				Applicant confirmation is required before the certificate can be marked ready to issue.
			</CardDescription>
		</CardHeader>
		<CardContent>
			{#if form?.applicantConfirmationError}
				<div class="error-summary" role="alert">
					<p class="error-summary-title">Applicant confirmation is incomplete</p>
					<p class="error-text">{form.applicantConfirmationError}</p>
				</div>
			{/if}
			<form method="POST" action="?/applicantConfirmation" class="stack">
				<div class="check-list">
					<label class="check-row">
						<input
							type="checkbox"
							name="informationAccurate"
							checked={data.review.applicantConfirmation?.informationAccurate}
						>
						<span
							>The applicant confirms the information is accurate to the best of their knowledge.</span
						>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="understandsNotIssuedByPrimerPaso"
							checked={data.review.applicantConfirmation?.understandsNotIssuedByPrimerPaso}
						>
						<span>The applicant understands Primer Paso does not issue the certificate.</span>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="understandsOrganisationWillReview"
							checked={data.review.applicantConfirmation?.understandsOrganisationWillReview}
						>
						<span
							>The applicant understands the organisation will review the information before issue.</span
						>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="consentsToDataUseForCertificate"
							checked={data.review.applicantConfirmation?.consentsToDataUseForCertificate}
						>
						<span>
							The applicant agrees that the organisation may use this data for certificate review
							and issue.
						</span>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="consentsToStoreForAuditAndIssue"
							checked={data.review.applicantConfirmation?.consentsToStoreForAuditAndIssue}
						>
						<span>
							The applicant agrees that the organisation may store this data for audit and
							certificate records.
						</span>
					</label>
				</div>
				<div class="form-field">
					<label for="confirmationMethod">Confirmation method</label>
					<select id="confirmationMethod" name="confirmationMethod" bind:value={confirmationMethod}>
						{#if data.review.origin === 'public_handoff' || confirmationMethod === 'public_handoff'}
							<option value="public_handoff">Public handoff</option>
						{/if}
						<option value="organisation_in_person">In person</option>
						<option value="organisation_phone_or_remote">Phone or remote</option>
						<option value="authorised_representative">Authorised representative</option>
					</select>
				</div>
				<div class="actions">
					<Button type="submit">Save applicant confirmation</Button>
				</div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Confirmaciones de verificación</CardTitle>
			<CardDescription>
				Estas confirmaciones quedarán registradas en el historial de auditoría.
			</CardDescription>
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
							He comprobado el documento de identidad si la persona lo ha aportado.
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
						<span class="text-sm leading-6">He confirmado estos datos con la persona.</span>
					</label>
					<label class="check-row">
						<input
							type="checkbox"
							name="vulnerabilityInformationReviewed"
							value="yes"
							checked={verification.vulnerabilityInformationReviewed}
							class="mt-1 size-4"
						>
						<span class="text-sm leading-6">He revisado las circunstancias de vulnerabilidad.</span>
					</label>
				</div>
				<Separator />
				<div class="actions">
					<Button type="submit">Guardar confirmaciones</Button>
					{#if data.canMarkReadyToIssue}
						<Button type="submit" formaction="?/ready" variant="secondary">
							Marcar como lista para emitir
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	{#if data.canIssueCertificate}
		<Card>
			<CardHeader>
				<CardTitle>Emitir certificado</CardTitle>
				<CardDescription>
					Puedes emitir el certificado ahora que la revisión está lista.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" action="?/issue">
					<Button type="submit" variant="success">Emitir certificado</Button>
				</form>
			</CardContent>
		</Card>
	{/if}

	{#if data.certificateHref}
		<Card>
			<CardHeader><CardTitle>Certificado emitido</CardTitle></CardHeader>
			<CardContent>
				<Button href={data.certificateHref} variant="outline">
					<DownloadIcon class="size-4" aria-hidden="true" />
					Descargar certificado emitido
				</Button>
			</CardContent>
		</Card>
	{/if}

	<div class="actions">
		<Button href="/dashboard" variant="ghost">
			<ArrowLeftIcon class="size-4" aria-hidden="true" />
			Volver al panel
		</Button>
	</div>
</div>

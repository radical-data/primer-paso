<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import DownloadIcon from '@lucide/svelte/icons/download'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Separator } from '@primer-paso/ui/separator'
import { reviewStatusLabel, vulnerabilityReasonLabel } from '$lib/labels'

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

	<div class="panel-subtle">
		<p class="supporting-text">
			Este borrador ha sido preparado por la persona solicitante. Antes de emitir el certificado,
			comprueba la información con la persona y confirma que la organización puede acreditar las
			circunstancias indicadas.
		</p>
	</div>

	<Card>
		<CardHeader> <CardTitle>Datos de identidad</CardTitle> </CardHeader>
		<CardContent>
			<dl class="summary-grid">
				<div class="summary-item">
					<dt class="summary-label">Nombres</dt>
					<dd class="summary-value">{identity.givenNames}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Apellidos</dt>
					<dd class="summary-value">{identity.familyNames}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Tipo de documento</dt>
					<dd class="summary-value">{identity.documentType}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Número de documento</dt>
					<dd class="summary-value">{identity.documentNumber}</dd>
				</div>
				{#if identity.dateOfBirth}
					<div class="summary-item">
						<dt class="summary-label">Fecha de nacimiento</dt>
						<dd class="summary-value">{identity.dateOfBirth}</dd>
					</div>
				{/if}
				{#if identity.nationality}
					<div class="summary-item">
						<dt class="summary-label">Nacionalidad</dt>
						<dd class="summary-value">{identity.nationality}</dd>
					</div>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<Card>
		<CardHeader> <CardTitle>Contacto y dirección</CardTitle> </CardHeader>
		<CardContent>
			<dl class="summary-grid">
				<div class="summary-item">
					<dt class="summary-label">Correo electrónico</dt>
					<dd class="summary-value">{contact.email}</dd>
				</div>
				{#if contact.phone}
					<div class="summary-item">
						<dt class="summary-label">Teléfono</dt>
						<dd class="summary-value">{contact.phone}</dd>
					</div>
				{/if}
				<div class="summary-item">
					<dt class="summary-label">Dirección</dt>
					<dd class="summary-value">
						{location.addressLine1}
						{#if location.addressLine2}
							, {location.addressLine2}
						{/if}
					</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Municipio</dt>
					<dd class="summary-value">{location.municipality}</dd>
				</div>
				<div class="summary-item">
					<dt class="summary-label">Provincia</dt>
					<dd class="summary-value">{location.province}</dd>
				</div>
				{#if location.postalCode}
					<div class="summary-item">
						<dt class="summary-label">Código postal</dt>
						<dd class="summary-value">{location.postalCode}</dd>
					</div>
				{/if}
			</dl>
		</CardContent>
	</Card>

	<Card>
		<CardHeader> <CardTitle>Circunstancias de vulnerabilidad</CardTitle> </CardHeader>
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
			<CardHeader> <CardTitle>Certificado emitido</CardTitle> </CardHeader>
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

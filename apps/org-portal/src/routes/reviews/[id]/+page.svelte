<script lang="ts">
import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left'
import DownloadIcon from '@lucide/svelte/icons/download'
import PencilIcon from '@lucide/svelte/icons/pencil'
import type { VulnerabilityReason } from '@primer-paso/certificate'
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
const original = $derived(review.draftSnapshot ?? data.draft)
const canCorrect = $derived(review.status === 'in_review')
const persisted = $derived(data.draft)

let reviewedIdentity = $state({ ...data.draft.userData.identity })
let reviewedContact = $state({ ...data.draft.userData.contact })
let reviewedLocation = $state({ ...data.draft.userData.location })
let reviewedVulnerabilityReasons = $state([...data.draft.userData.vulnerability.reasons])
let loadedReviewId = $state<string | undefined>(undefined)

const differs = (current: unknown, previous: unknown) =>
	JSON.stringify(current ?? null) !== JSON.stringify(previous ?? null)

let editingIdentity = $state(false)
let editingContact = $state(false)
let editingVulnerability = $state(false)

// Keep local edit state when the form is being used, but reset it if SvelteKit
// reuses this component instance for a different review.
$effect(() => {
	const id = data.review.id
	if (loadedReviewId === undefined) {
		loadedReviewId = id
		return
	}
	if (loadedReviewId === id) return

	loadedReviewId = id
	reviewedIdentity = { ...data.draft.userData.identity }
	reviewedContact = { ...data.draft.userData.contact }
	reviewedLocation = { ...data.draft.userData.location }
	reviewedVulnerabilityReasons = [...data.draft.userData.vulnerability.reasons]
	editingIdentity = false
	editingContact = false
	editingVulnerability = false
})

const toggleVulnerabilityReason = (value: VulnerabilityReason) => {
	if (!editingVulnerability || !canCorrect) return

	if (reviewedVulnerabilityReasons.includes(value)) {
		reviewedVulnerabilityReasons = reviewedVulnerabilityReasons.filter((reason) => reason !== value)
		return
	}

	reviewedVulnerabilityReasons = [...reviewedVulnerabilityReasons, value]
}

type Modification = {
	label: string
	from: string
	to: string
}

const display = (value: unknown) => {
	if (Array.isArray(value)) {
		return value.map((item) => vulnerabilityReasonLabel(item)).join(', ')
	}

	if (value === undefined || value === null || value === '') {
		return 'Sin dato'
	}

	return String(value)
}

const savedModifications = $derived.by<Modification[]>(() =>
	[
		['Nombres', persisted.userData.identity.givenNames, original.userData.identity.givenNames],
		['Apellidos', persisted.userData.identity.familyNames, original.userData.identity.familyNames],
		[
			'Tipo de documento',
			persisted.userData.identity.documentType,
			original.userData.identity.documentType
		],
		[
			'Número de documento',
			persisted.userData.identity.documentNumber,
			original.userData.identity.documentNumber
		],
		[
			'Fecha de nacimiento',
			persisted.userData.identity.dateOfBirth,
			original.userData.identity.dateOfBirth
		],
		[
			'Nacionalidad',
			persisted.userData.identity.nationality,
			original.userData.identity.nationality
		],
		['Correo electrónico', persisted.userData.contact.email, original.userData.contact.email],
		['Teléfono', persisted.userData.contact.phone, original.userData.contact.phone],
		[
			'Dirección',
			persisted.userData.location.addressLine1,
			original.userData.location.addressLine1
		],
		[
			'Dirección, línea 2',
			persisted.userData.location.addressLine2,
			original.userData.location.addressLine2
		],
		[
			'Municipio',
			persisted.userData.location.municipality,
			original.userData.location.municipality
		],
		['Provincia', persisted.userData.location.province, original.userData.location.province],
		[
			'Código postal',
			persisted.userData.location.postalCode,
			original.userData.location.postalCode
		],
		[
			'Circunstancias de vulnerabilidad',
			persisted.userData.vulnerability.reasons,
			original.userData.vulnerability.reasons
		]
	]
		.filter(([, current, previous]) => differs(current, previous))
		.map(([label, current, previous]) => ({
			label: String(label),
			from: display(previous),
			to: display(current)
		}))
)

const pendingModifications = $derived.by<Modification[]>(() =>
	[
		['Nombres', reviewedIdentity.givenNames, persisted.userData.identity.givenNames],
		['Apellidos', reviewedIdentity.familyNames, persisted.userData.identity.familyNames],
		['Tipo de documento', reviewedIdentity.documentType, persisted.userData.identity.documentType],
		[
			'Número de documento',
			reviewedIdentity.documentNumber,
			persisted.userData.identity.documentNumber
		],
		['Fecha de nacimiento', reviewedIdentity.dateOfBirth, persisted.userData.identity.dateOfBirth],
		['Nacionalidad', reviewedIdentity.nationality, persisted.userData.identity.nationality],
		['Correo electrónico', reviewedContact.email, persisted.userData.contact.email],
		['Teléfono', reviewedContact.phone, persisted.userData.contact.phone],
		['Dirección', reviewedLocation.addressLine1, persisted.userData.location.addressLine1],
		['Dirección, línea 2', reviewedLocation.addressLine2, persisted.userData.location.addressLine2],
		['Municipio', reviewedLocation.municipality, persisted.userData.location.municipality],
		['Provincia', reviewedLocation.province, persisted.userData.location.province],
		['Código postal', reviewedLocation.postalCode, persisted.userData.location.postalCode],
		[
			'Circunstancias de vulnerabilidad',
			reviewedVulnerabilityReasons,
			persisted.userData.vulnerability.reasons
		]
	]
		.filter(([, current, previous]) => differs(current, previous))
		.map(([label, current, previous]) => ({
			label: String(label),
			from: display(previous),
			to: display(current)
		}))
)

const hasPendingModifications = $derived(pendingModifications.length > 0)

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
		<CardHeader>
			<CardTitle>Datos revisados</CardTitle>
			<CardDescription>
				Los datos están bloqueados por defecto. Desbloquea una sección solo si necesitas corregirla
				durante la entrevista.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/updateReviewedData" class="stack">
				<div class="panel-subtle">
					<p class="supporting-text">
						Las correcciones no modifican el borrador original. Si guardas cambios, las
						confirmaciones de verificación se reiniciarán.
					</p>
				</div>

				<section class="stack">
					<div class="actions justify-between">
						<h2 class="section-title">Identidad</h2>
						{#if canCorrect}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={() => (editingIdentity = !editingIdentity)}
							>
								<PencilIcon class="size-4" aria-hidden="true" />
								{editingIdentity ? 'Bloquear identidad' : 'Corregir identidad'}
							</Button>
						{/if}
					</div>

					<div class="summary-grid">
						<div class="form-field">
							<label for="givenNames">Nombres</label>
							<input
								id="givenNames"
								name="givenNames"
								bind:value={reviewedIdentity.givenNames}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(reviewedIdentity.givenNames, original.userData.identity.givenNames)}
							>
							{#if differs(reviewedIdentity.givenNames, original.userData.identity.givenNames)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.givenNames)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="familyNames">Apellidos</label>
							<input
								id="familyNames"
								name="familyNames"
								bind:value={reviewedIdentity.familyNames}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(reviewedIdentity.familyNames, original.userData.identity.familyNames)}
							>
							{#if differs(reviewedIdentity.familyNames, original.userData.identity.familyNames)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.familyNames)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="documentType">Tipo de documento</label>
							<input
								id="documentType"
								name="documentType"
								bind:value={reviewedIdentity.documentType}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(
									reviewedIdentity.documentType,
									original.userData.identity.documentType
								)}
							>
							{#if differs(reviewedIdentity.documentType, original.userData.identity.documentType)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.documentType)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="documentNumber">Número de documento</label>
							<input
								id="documentNumber"
								name="documentNumber"
								bind:value={reviewedIdentity.documentNumber}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(
									reviewedIdentity.documentNumber,
									original.userData.identity.documentNumber
								)}
							>
							{#if differs(reviewedIdentity.documentNumber, original.userData.identity.documentNumber)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.documentNumber)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="dateOfBirth">Fecha de nacimiento</label>
							<input
								id="dateOfBirth"
								name="dateOfBirth"
								type="date"
								bind:value={reviewedIdentity.dateOfBirth}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(reviewedIdentity.dateOfBirth, original.userData.identity.dateOfBirth)}
							>
							{#if differs(reviewedIdentity.dateOfBirth, original.userData.identity.dateOfBirth)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.dateOfBirth)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="nationality">Nacionalidad</label>
							<input
								id="nationality"
								name="nationality"
								bind:value={reviewedIdentity.nationality}
								readonly={!canCorrect || !editingIdentity}
								data-modified={differs(reviewedIdentity.nationality, original.userData.identity.nationality)}
							>
							{#if differs(reviewedIdentity.nationality, original.userData.identity.nationality)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.identity.nationality)}
								</p>
							{/if}
						</div>
					</div>
				</section>

				<Separator />

				<section class="stack">
					<div class="actions justify-between">
						<h2 class="section-title">Contacto y dirección</h2>
						{#if canCorrect}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={() => (editingContact = !editingContact)}
							>
								<PencilIcon class="size-4" aria-hidden="true" />
								{editingContact ? 'Bloquear contacto' : 'Corregir contacto'}
							</Button>
						{/if}
					</div>

					<div class="summary-grid">
						<div class="form-field">
							<label for="email">Correo electrónico</label>
							<input
								id="email"
								name="email"
								type="email"
								bind:value={reviewedContact.email}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(reviewedContact.email, original.userData.contact.email)}
							>
							{#if differs(reviewedContact.email, original.userData.contact.email)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.contact.email)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="phone">Teléfono</label>
							<input
								id="phone"
								name="phone"
								bind:value={reviewedContact.phone}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(reviewedContact.phone, original.userData.contact.phone)}
							>
							{#if differs(reviewedContact.phone, original.userData.contact.phone)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.contact.phone)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="addressLine1">Dirección</label>
							<input
								id="addressLine1"
								name="addressLine1"
								bind:value={reviewedLocation.addressLine1}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(
									reviewedLocation.addressLine1,
									original.userData.location.addressLine1
								)}
							>
							{#if differs(reviewedLocation.addressLine1, original.userData.location.addressLine1)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.location.addressLine1)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="addressLine2">Dirección, línea 2</label>
							<input
								id="addressLine2"
								name="addressLine2"
								bind:value={reviewedLocation.addressLine2}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(
									reviewedLocation.addressLine2,
									original.userData.location.addressLine2
								)}
							>
							{#if differs(reviewedLocation.addressLine2, original.userData.location.addressLine2)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.location.addressLine2)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="municipality">Municipio</label>
							<input
								id="municipality"
								name="municipality"
								bind:value={reviewedLocation.municipality}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(
									reviewedLocation.municipality,
									original.userData.location.municipality
								)}
							>
							{#if differs(reviewedLocation.municipality, original.userData.location.municipality)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.location.municipality)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="province">Provincia</label>
							<input
								id="province"
								name="province"
								bind:value={reviewedLocation.province}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(reviewedLocation.province, original.userData.location.province)}
							>
							{#if differs(reviewedLocation.province, original.userData.location.province)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.location.province)}
								</p>
							{/if}
						</div>

						<div class="form-field">
							<label for="postalCode">Código postal</label>
							<input
								id="postalCode"
								name="postalCode"
								bind:value={reviewedLocation.postalCode}
								readonly={!canCorrect || !editingContact}
								data-modified={differs(reviewedLocation.postalCode, original.userData.location.postalCode)}
							>
							{#if differs(reviewedLocation.postalCode, original.userData.location.postalCode)}
								<p class="modified-note">
									Modificado. Original: {display(original.userData.location.postalCode)}
								</p>
							{/if}
						</div>
					</div>
				</section>

				<Separator />

				<section class="stack">
					<div class="actions justify-between">
						<h2 class="section-title">Circunstancias de vulnerabilidad</h2>
						{#if canCorrect}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onclick={() => (editingVulnerability = !editingVulnerability)}
							>
								<PencilIcon class="size-4" aria-hidden="true" />
								{editingVulnerability ? 'Bloquear circunstancias' : 'Corregir circunstancias'}
							</Button>
						{/if}
					</div>
					<fieldset class="form-field">
						{#each data.vulnerabilityReasonOptions as option}
							{@const checked = reviewedVulnerabilityReasons.includes(option.value)}
							<label class="check-row">
								<input
									type="checkbox"
									value={option.value}
									{checked}
									disabled={!canCorrect || !editingVulnerability}
									onchange={() => toggleVulnerabilityReason(option.value)}
								>
								<span>{option.label}</span>
							</label>
						{/each}

						{#each reviewedVulnerabilityReasons as reason}
							<input type="hidden" name="vulnerabilityReasons" value={reason}>
						{/each}

						{#if differs(reviewedVulnerabilityReasons, original.userData.vulnerability.reasons)}
							<p class="modified-note">
								Modificado. Original: {display(original.userData.vulnerability.reasons)}
							</p>
						{/if}
					</fieldset>
				</section>

				{#if savedModifications.length > 0}
					<Separator />

					<section class="panel-subtle stack">
						<h2 class="section-title">Modificaciones ya guardadas por la organización</h2>
						<ul class="grid gap-3">
							{#each savedModifications as modification}
								<li class="modified-summary-item">
									<strong>{modification.label}</strong>
									<span>Original: {modification.from}</span>
									<span>Revisado guardado: {modification.to}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/if}

				{#if pendingModifications.length > 0}
					<Separator />

					<section class="panel-subtle stack">
						<h2 class="section-title">Modificaciones pendientes de confirmar</h2>
						<p class="supporting-text">
							Estos cambios todavía no se han guardado. La organización debe confirmarlos antes de
							continuar con la verificación.
						</p>
						<ul class="grid gap-3">
							{#each pendingModifications as modification}
								<li class="modified-summary-item">
									<strong>{modification.label}</strong>
									<span>Guardado: {modification.from}</span>
									<span>Nuevo: {modification.to}</span>
								</li>
							{/each}
						</ul>
					</section>

					<div class="form-field">
						<label for="correctionType">Tipo de corrección</label>
						<select id="correctionType" name="correctionType" disabled={!canCorrect}>
							<option value="confirmed_with_applicant">
								Confirmado con la persona solicitante
							</option>
							<option value="document_verified">Verificado con documento</option>
							<option value="typo">Corrección tipográfica</option>
							<option value="standardised_format">Formato normalizado</option>
							<option value="other">Otra</option>
						</select>
					</div>

					<div class="form-field">
						<label for="correctionNote">Nota opcional</label>
						<textarea
							id="correctionNote"
							name="correctionNote"
							rows="3"
							disabled={!canCorrect}
						></textarea>
					</div>

					<label class="check-row panel-subtle">
						<input
							type="checkbox"
							name="correctionsConfirmed"
							value="yes"
							required
							disabled={!canCorrect}
						>
						<span>
							Confirmo que he comprobado estas modificaciones con la persona solicitante o con la
							documentación aportada, y que la organización asume responsabilidad por los datos
							revisados.
						</span>
					</label>
				{/if}

				{#if canCorrect}
					<div class="actions">
						<Button type="submit" disabled={!hasPendingModifications}>
							Guardar modificaciones
						</Button>
					</div>
				{:else}
					<p class="hint">Los datos ya no se pueden corregir en este estado.</p>
				{/if}
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
			{#if hasPendingModifications}
				<div class="error-summary" role="alert">
					<p class="error-summary-title">Hay modificaciones sin guardar</p>
					<p class="error-text">
						Guarda o descarta las modificaciones antes de confirmar la verificación. Si continúas
						sin guardarlas, el certificado se emitiría con los datos guardados anteriormente.
					</p>
				</div>
			{/if}

			<form method="POST" action="?/save" class="stack">
				<div class="check-list">
					<label class="check-row">
						<input
							type="checkbox"
							name="passportOrIdentityDocumentChecked"
							value="yes"
							checked={verification.passportOrIdentityDocumentChecked}
							disabled={hasPendingModifications}
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
							disabled={hasPendingModifications}
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
							disabled={hasPendingModifications}
							class="mt-1 size-4"
						>
						<span class="text-sm leading-6">He revisado las circunstancias de vulnerabilidad.</span>
					</label>
				</div>
				<Separator />
				<div class="actions">
					<Button type="submit" disabled={hasPendingModifications}>Guardar confirmaciones</Button>
					{#if data.canMarkReadyToIssue}
						<Button
							type="submit"
							formaction="?/ready"
							variant="secondary"
							disabled={hasPendingModifications}
						>
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
				{#if hasPendingModifications}
					<div class="error-summary" role="alert">
						<p class="error-summary-title">No se puede emitir con modificaciones sin guardar</p>
						<p class="error-text">
							Guarda o descarta las modificaciones antes de emitir el certificado.
						</p>
					</div>
				{/if}
				<form method="POST" action="?/issue">
					<Button type="submit" variant="success" disabled={hasPendingModifications}>
						Emitir certificado
					</Button>
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

<style>
input[data-modified="true"],
input[readonly][data-modified="true"] {
	border-color: var(--color-warning, #b7791f);
	background: color-mix(in srgb, var(--color-warning, #b7791f) 8%, transparent);
}

input[readonly] {
	cursor: default;
}

.modified-note {
	margin-top: 0.25rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-warning-text, #92400e);
}

.modified-summary-item {
	display: grid;
	gap: 0.25rem;
	border-inline-start: 0.25rem solid var(--color-warning, #b7791f);
	padding: 0.75rem;
	background: color-mix(in srgb, var(--color-warning, #b7791f) 7%, transparent);
	border-radius: 0.75rem;
}
</style>

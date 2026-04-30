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
	<title>Revisar entrega de certificado | Portal de organizaciones de Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<main class="shell">
	<section class="card">
		<p class="eyebrow">Entrega de certificado</p>
		<h1>Revisar el borrador del certificado</h1>

		{#if form?.error}
			<p role="alert">{form.error}</p>
		{/if}

		<p>
			Este es un borrador preparado por la persona usuaria. No emitas un certificado a menos que tu
			organización haya comprobado la información y pueda certificar las circunstancias.
		</p>

		<section>
			<h2>Estado de la revisión</h2>
			<p><strong>{data.review.status}</strong></p>
		</section>

		<section>
			<h2>Datos de identidad</h2>
			<dl>
				<div>
					<dt>Nombres</dt>
					<dd>{identity.givenNames}</dd>
				</div>
				<div>
					<dt>Apellidos</dt>
					<dd>{identity.familyNames}</dd>
				</div>
				<div>
					<dt>Tipo de documento</dt>
					<dd>{identity.documentType}</dd>
				</div>
				<div>
					<dt>Número de documento</dt>
					<dd>{identity.documentNumber}</dd>
				</div>
				{#if identity.dateOfBirth}
					<div>
						<dt>Fecha de nacimiento</dt>
						<dd>{identity.dateOfBirth}</dd>
					</div>
				{/if}
				{#if identity.nationality}
					<div>
						<dt>Nacionalidad</dt>
						<dd>{identity.nationality}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section>
			<h2>Contacto y dirección</h2>
			<dl>
				<div>
					<dt>Correo electrónico</dt>
					<dd>{contact.email}</dd>
				</div>
				{#if contact.phone}
					<div>
						<dt>Teléfono</dt>
						<dd>{contact.phone}</dd>
					</div>
				{/if}
				<div>
					<dt>Dirección</dt>
					<dd>
						{location.addressLine1}
						{#if location.addressLine2}
							, {location.addressLine2}
						{/if}
					</dd>
				</div>
				<div>
					<dt>Municipio</dt>
					<dd>{location.municipality}</dd>
				</div>
				<div>
					<dt>Provincia</dt>
					<dd>{location.province}</dd>
				</div>
				{#if location.postalCode}
					<div>
						<dt>Código postal</dt>
						<dd>{location.postalCode}</dd>
					</div>
				{/if}
			</dl>
		</section>

		<section>
			<h2>Circunstancias de vulnerabilidad</h2>
			<ul>
				{#each vulnerability.reasons as reason}
					<li>{reason}</li>
				{/each}
			</ul>
		</section>

		<form method="POST" action="?/save">
			<h2>Confirmaciones de verificación</h2>
			<label>
				<input
					type="checkbox"
					name="passportOrIdentityDocumentChecked"
					value="yes"
					checked={verification.passportOrIdentityDocumentChecked}
				>
				He comprobado el documento de identidad cuando estaba disponible.
			</label>
			<label>
				<input
					type="checkbox"
					name="userInformationConfirmed"
					value="yes"
					checked={verification.userInformationConfirmed}
				>
				He confirmado estos datos con la persona.
			</label>
			<label>
				<input
					type="checkbox"
					name="vulnerabilityInformationReviewed"
					value="yes"
					checked={verification.vulnerabilityInformationReviewed}
				>
				He revisado las circunstancias de vulnerabilidad.
			</label>
			<p>Esta acción de revisión queda registrada en el registro de auditoría.</p>
			<button type="submit">Guardar revisión</button>
			{#if data.canMarkReadyToIssue}
				<button type="submit" formaction="?/ready">Marcar lista para emitir</button>
			{/if}
		</form>
		{#if data.canIssueCertificate}
			<form method="POST" action="?/issue"><button type="submit">Emitir certificado</button></form>
		{/if}
		{#if data.certificateHref}
			<p><a href={data.certificateHref}>Descargar certificado emitido</a></p>
		{/if}

		<p><a href="/dashboard">Volver al panel</a></p>
	</section>
</main>

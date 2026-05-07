<script lang="ts">
type Option = {
	value: string
	label: string
}

type CertificateDraftFormValue = {
	givenNames: string
	familyNames: string
	documentType: string
	documentNumber: string
	dateOfBirth: string
	nationality: string
	email: string
	phone: string
	addressLine1: string
	addressLine2: string
	municipality: string
	province: string
	postalCode: string
	vulnerabilityReasons: string[]
}

let {
	value,
	documentTypeOptions,
	vulnerabilityReasonOptions,
	action,
	submitLabel,
	showCorrectionControls = false,
	correctionTypeOptions = [],
	error
}: {
	value: CertificateDraftFormValue
	documentTypeOptions: Option[]
	vulnerabilityReasonOptions: Option[]
	action: string
	submitLabel: string
	showCorrectionControls?: boolean
	correctionTypeOptions?: Option[]
	error?: string
} = $props()
</script>

<form method="POST" {action} class="stack">
	{#if error}
		<div class="error-summary" role="alert">
			<p class="error-text">{error}</p>
		</div>
	{/if}

	<section class="stack">
		<h2 class="section-title">Datos de la persona solicitante</h2>
		<label>
			Nombres
			<input name="givenNames" required autocomplete="given-name" value={value.givenNames}>
		</label>
		<label>
			Apellidos
			<input name="familyNames" required autocomplete="family-name" value={value.familyNames}>
		</label>
		<label>
			Tipo de documento
			<select name="documentType" required>
				{#each documentTypeOptions as option}
					<option value={option.value} selected={value.documentType === option.value}>
						{option.label}
					</option>
				{/each}
			</select>
		</label>
		<label>
			Número de documento
			<input name="documentNumber" required value={value.documentNumber}>
		</label>
		<label>
			Fecha de nacimiento
			<input name="dateOfBirth" type="date" value={value.dateOfBirth}>
		</label>
		<label>
			Nacionalidad
			<input name="nationality" value={value.nationality}>
		</label>
	</section>

	<section class="stack">
		<h2 class="section-title">Contacto</h2>
		<label>
			Correo electrónico
			<input name="email" type="email" required autocomplete="email" value={value.email}>
		</label>
		<label>
			Teléfono
			<input name="phone" autocomplete="tel" value={value.phone}>
		</label>
	</section>

	<section class="stack">
		<h2 class="section-title">Domicilio</h2>
		<label>
			Dirección
			<input name="addressLine1" required autocomplete="address-line1" value={value.addressLine1}>
		</label>
		<label>
			Complemento de dirección
			<input name="addressLine2" autocomplete="address-line2" value={value.addressLine2}>
		</label>
		<label>
			Municipio
			<input name="municipality" required autocomplete="address-level2" value={value.municipality}>
		</label>
		<label>
			Provincia
			<input name="province" required autocomplete="address-level1" value={value.province}>
		</label>
		<label>
			Código postal
			<input name="postalCode" autocomplete="postal-code" value={value.postalCode}>
		</label>
	</section>

	<section class="stack">
		<h2 class="section-title">Circunstancias de vulnerabilidad</h2>
		{#each vulnerabilityReasonOptions as option}
			<label class="check-row">
				<input
					type="checkbox"
					name="vulnerabilityReasons"
					value={option.value}
					checked={value.vulnerabilityReasons.includes(option.value)}
				>
				<span>{option.label}</span>
			</label>
		{/each}
	</section>

	{#if showCorrectionControls}
		<section class="stack">
			<h2 class="section-title">Motivo de la corrección</h2>
			<label>
				Tipo de corrección
				<select name="correctionType">
					{#each correctionTypeOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
			<label>
				Nota opcional
				<textarea name="correctionNote"></textarea>
			</label>
		</section>
	{/if}

	<div class="actions">
		<button type="submit">{submitLabel}</button>
	</div>
</form>

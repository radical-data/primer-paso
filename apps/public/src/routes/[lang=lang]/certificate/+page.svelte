<script lang="ts">
import { Button } from '$lib/components/ui/button'

let { data, form } = $props()

const value = $derived(form?.value ?? data.value)
const issues = $derived(form?.issues ?? [])

const fieldError = (field: string) =>
	issues.find((issue: { field: string; message: string }) => issue.field === field)?.message

const checked = (option: string) =>
	Array.isArray(value.vulnerabilityReasons) && value.vulnerabilityReasons.includes(option)
</script>

<svelte:head>
	<title>Prepare certificate draft | Primer Paso</title>
	<meta name="robots" content="noindex, nofollow">
</svelte:head>

<section class="stack">
	<p class="eyebrow">Certificate draft</p>

	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">Prepare a vulnerability certificate draft</h1>
			<p class="lead-text">
				This creates a draft for a collaborating organisation to review. Primer Paso does not issue
				the certificate.
			</p>
			<p class="hint">
				The organisation must check the information, decide whether it can certify the situation,
				and issue the final document.
			</p>
		</div>

		{#if issues.length > 0}
			<div class="panel-subtle section-block" role="alert" aria-labelledby="certificate-errors">
				<h2 id="certificate-errors" class="section-title">Check the certificate details</h2>
				<ul>
					{#each issues as issue}
						<li>{issue.message}</li>
					{/each}
				</ul>
			</div>
		{/if}

		<form method="POST" class="stack">
			<section class="panel section-block">
				<h2 class="section-title">Identity details</h2>

				<div class="form-field">
					<label for="givenNames">Given names</label>
					<input
						id="givenNames"
						name="givenNames"
						value={value.givenNames}
						autocomplete="given-name"
						aria-invalid={fieldError('givenNames') ? 'true' : undefined}
					>
					{#if fieldError('givenNames')}
						<p class="error-text">{fieldError('givenNames')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="familyNames">Family names</label>
					<input
						id="familyNames"
						name="familyNames"
						value={value.familyNames}
						autocomplete="family-name"
						aria-invalid={fieldError('familyNames') ? 'true' : undefined}
					>
					{#if fieldError('familyNames')}
						<p class="error-text">{fieldError('familyNames')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="documentType">Identity document type</label>
					<select
						id="documentType"
						name="documentType"
						aria-invalid={fieldError('documentType') ? 'true' : undefined}
					>
						<option value="">Choose an option</option>
						{#each data.documentTypeOptions as option}
							<option value={option.value} selected={value.documentType === option.value}>
								{option.label}
							</option>
						{/each}
					</select>
					{#if fieldError('documentType')}
						<p class="error-text">{fieldError('documentType')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="documentNumber">Identity document number</label>
					<input
						id="documentNumber"
						name="documentNumber"
						value={value.documentNumber}
						aria-invalid={fieldError('documentNumber') ? 'true' : undefined}
					>
					{#if fieldError('documentNumber')}
						<p class="error-text">{fieldError('documentNumber')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="dateOfBirth">Date of birth</label>
					<input id="dateOfBirth" name="dateOfBirth" type="date" value={value.dateOfBirth}>
				</div>

				<div class="form-field">
					<label for="nationality">Nationality</label>
					<input id="nationality" name="nationality" value={value.nationality}>
				</div>
			</section>

			<section class="panel section-block">
				<h2 class="section-title">Contact and address</h2>

				<div class="form-field">
					<label for="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={value.email}
						autocomplete="email"
						aria-invalid={fieldError('email') ? 'true' : undefined}
					>
					{#if fieldError('email')}
						<p class="error-text">{fieldError('email')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="phone">Phone</label>
					<input id="phone" name="phone" value={value.phone} autocomplete="tel">
				</div>

				<div class="form-field">
					<label for="addressLine1">Address</label>
					<input
						id="addressLine1"
						name="addressLine1"
						value={value.addressLine1}
						autocomplete="address-line1"
						aria-invalid={fieldError('addressLine1') ? 'true' : undefined}
					>
					{#if fieldError('addressLine1')}
						<p class="error-text">{fieldError('addressLine1')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="addressLine2">Address line 2</label>
					<input id="addressLine2" name="addressLine2" value={value.addressLine2}>
				</div>

				<div class="form-field">
					<label for="municipality">Municipality</label>
					<input
						id="municipality"
						name="municipality"
						value={value.municipality}
						aria-invalid={fieldError('municipality') ? 'true' : undefined}
					>
					{#if fieldError('municipality')}
						<p class="error-text">{fieldError('municipality')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="province">Province</label>
					<input
						id="province"
						name="province"
						value={value.province}
						aria-invalid={fieldError('province') ? 'true' : undefined}
					>
					{#if fieldError('province')}
						<p class="error-text">{fieldError('province')}</p>
					{/if}
				</div>

				<div class="form-field">
					<label for="postalCode">Postcode</label>
					<input
						id="postalCode"
						name="postalCode"
						value={value.postalCode}
						autocomplete="postal-code"
					>
				</div>
			</section>

			<section class="panel section-block">
				<fieldset class="form-field">
					<legend class="section-title text-base">Vulnerability circumstances</legend>
					<p class="hint">
						Choose the circumstances to prepare for organisation review. The organisation decides
						what it can certify.
					</p>
					{#each data.vulnerabilityReasonOptions as option}
						<label class="choice-row">
							<input
								type="checkbox"
								name="vulnerabilityReasons"
								value={option.value}
								checked={checked(option.value)}
							>
							<span>{option.label}</span>
						</label>
					{/each}
					{#if fieldError('vulnerabilityReasons')}
						<p class="error-text">{fieldError('vulnerabilityReasons')}</p>
					{/if}
				</fieldset>
			</section>

			<div class="actions">
				<Button type="submit">Review draft</Button>
				<Button href={data.backHref} variant="outline">Back</Button>
			</div>
		</form>
	</div>
</section>

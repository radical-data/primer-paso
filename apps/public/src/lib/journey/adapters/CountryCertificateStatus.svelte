<script lang="ts">
import { Label } from '@primer-paso/ui/label'
import { type CountryLocale, getCountryName } from '$lib/generated/countries'
import type { CriminalRecordCertificateStatus, PreviousResidenceCountry } from '$lib/journey/types'

type CountryCertificateStatusProps = {
	name: string
	value?: PreviousResidenceCountry[]
	locale: CountryLocale
	labels: {
		status: Record<CriminalRecordCertificateStatus, string>
	}
	describedby?: string
}

let {
	name,
	value = $bindable([]),
	locale,
	labels,
	describedby = undefined
}: CountryCertificateStatusProps = $props()

const certificateStatusOptions = (
	[
		'already_have',
		'requested_waiting',
		'not_requested_yet',
		'not_sure'
	] as const satisfies readonly CriminalRecordCertificateStatus[]
).map((status) => ({
	value: status,
	label: labels.status[status]
}))

const optionId = (prefix: string, optionValue: string) =>
	`${prefix}-${optionValue}`.replaceAll(/[^a-zA-Z0-9_-]/g, '-')

const updateCountry = (countryCode: string, patch: Partial<PreviousResidenceCountry>) => {
	value = value.map((country) => {
		if (country.countryCode !== countryCode) return country

		return {
			...country,
			...patch
		}
	})
}

const serialisedValue = $derived(JSON.stringify(value))
</script>

<input type="hidden" {name} value={serialisedValue}>

<div class="grid gap-8">
	{#each value.filter((country) => country.countryCode !== 'ES') as country (country.countryCode)}
		<section class="grid gap-4">
			<h2 class="text-base font-semibold leading-7">
				{getCountryName(country.countryCode, locale)}
			</h2>
			<div class="grid gap-3">
				{#each certificateStatusOptions as option (option.value)}
					<div class="app-option-row relative block rounded-2xl">
						<input
							id={optionId(`${country.countryCode}-certificate-status`, option.value)}
							class="app-option-control peer sr-only"
							type="radio"
							name={`${country.countryCode}-certificate-status`}
							checked={country.certificateStatus === option.value}
							onchange={() =>
								updateCountry(country.countryCode, {
									certificateStatus: option.value
								})}
							aria-describedby={describedby}
						>
						<Label
							class="app-option-label"
							for={optionId(`${country.countryCode}-certificate-status`, option.value)}
						>
							<span class="app-option-indicator" data-type="radio" aria-hidden="true">
								<span class="size-2 rounded-full bg-current"></span>
							</span>
							<span class="app-option-copy">
								<span class="app-option-title">{option.label}</span>
							</span>
						</Label>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</div>

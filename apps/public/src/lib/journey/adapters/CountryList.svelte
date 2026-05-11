<script lang="ts">
import CheckIcon from '@lucide/svelte/icons/check'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'
import Fuse from 'fuse.js'
import { type CountryLocale, getCountryName } from '$lib/generated/countries'
import type { JourneyOption } from '$lib/journey/config'
import type { PreviousResidenceCountry } from '$lib/journey/types'

type CountryListProps = {
	name: string
	value?: PreviousResidenceCountry[]
	options: JourneyOption[]
	locale: CountryLocale
	searchLabel: string
	labels: {
		spain: string
		spainHint: string
		commonCountries: string
		allOtherCountries: string
		searchResults: string
	}
	commonCountryCodes?: string[]
	describedby?: string
}

let {
	name,
	value = $bindable([]),
	options,
	locale,
	searchLabel,
	labels,
	commonCountryCodes = [],
	describedby = undefined
}: CountryListProps = $props()

let searchQuery = $state('')

const localisedOptions = $derived(
	options.map((option) => ({
		...option,
		label: getCountryName(option.value, locale)
	}))
)

const ensureSpain = (countries: PreviousResidenceCountry[]) =>
	countries.some((country) => country.countryCode === 'ES')
		? countries
		: [{ countryCode: 'ES' }, ...countries]

const selectedCodes = $derived(new Set(ensureSpain(value).map((country) => country.countryCode)))

const fuse = $derived(
	new Fuse(localisedOptions, {
		keys: ['label'],
		threshold: 0.3
	})
)

const spainOption = $derived(localisedOptions.find((option) => option.value === 'ES'))
const foreignOptions = $derived(localisedOptions.filter((option) => option.value !== 'ES'))
const commonOptions = $derived(
	commonCountryCodes.flatMap((code) => {
		const option = foreignOptions.find((entry) => entry.value === code)
		return option ? [option] : []
	})
)
const commonCodeSet = $derived(new Set(commonOptions.map((option) => option.value)))
const allOptions = $derived(foreignOptions.filter((option) => !commonCodeSet.has(option.value)))

const isSearching = $derived(searchQuery.trim() !== '')

const searchResultOptions = $derived(
	isSearching
		? fuse
				.search(searchQuery.trim())
				.map((result) => result.item)
				.filter((option) => option.value !== 'ES')
		: []
)

const optionId = (countryCode: string) =>
	`${name}-${countryCode}`.replaceAll(/[^a-zA-Z0-9_-]/g, '-')

const toggleCountry = (countryCode: string) => {
	const nextSelectedCodes = new Set(selectedCodes)
	if (nextSelectedCodes.has(countryCode)) {
		nextSelectedCodes.delete(countryCode)
	} else {
		nextSelectedCodes.add(countryCode)
	}
	nextSelectedCodes.add('ES')

	const existingByCode = new Map(value.map((country) => [country.countryCode, country]))
	value = [...nextSelectedCodes].map(
		(code) =>
			existingByCode.get(code) ?? {
				countryCode: code,
				certificateStatus: undefined
			}
	)
}

const serialisedValue = $derived(JSON.stringify(ensureSpain(value)))
</script>

<input type="hidden" {name} value={serialisedValue}>

<div class="grid gap-4">
	{#if spainOption}
		<div class="app-option-row relative block rounded-2xl">
			<input
				id={optionId('ES')}
				class="app-option-control peer sr-only"
				type="checkbox"
				checked
				disabled
				aria-describedby={describedby}
			>
			<Label class="app-option-label cursor-not-allowed opacity-80" for={optionId('ES')}>
				<span class="app-option-indicator" data-type="checkbox" aria-hidden="true">
					<CheckIcon class="size-3.5" />
				</span>
				<span class="app-option-copy">
					<span class="app-option-title">{labels.spain || spainOption.label}</span>
					<span class="app-option-description">{labels.spainHint}</span>
				</span>
			</Label>
		</div>
	{/if}

	{#if commonOptions.length > 0 && !isSearching}
		<section class="grid gap-3">
			<h2 class="text-sm font-semibold">{labels.commonCountries}</h2>
			{#each commonOptions as option (option.value)}
				<div class="app-option-row relative block rounded-2xl">
					<input
						id={optionId(option.value)}
						class="app-option-control peer sr-only"
						type="checkbox"
						checked={selectedCodes.has(option.value)}
						onchange={() => toggleCountry(option.value)}
						aria-describedby={describedby}
					>
					<Label class="app-option-label" for={optionId(option.value)}>
						<span class="app-option-indicator" data-type="checkbox" aria-hidden="true">
							<CheckIcon class="size-3.5" />
						</span>
						<span class="app-option-copy">
							<span class="app-option-title">{option.label ?? option.labelKey}</span>
						</span>
					</Label>
				</div>
			{/each}
		</section>
	{/if}

	<h2 class="text-sm font-semibold">
		{isSearching ? labels.searchResults : labels.allOtherCountries}
	</h2>
	<Input
		type="search"
		bind:value={searchQuery}
		aria-label={searchLabel}
		aria-describedby={describedby}
		class="w-full"
	/>
	<div class="grid max-h-[28rem] gap-3 overflow-y-auto">
		{#each isSearching ? searchResultOptions : allOptions as option (option.value)}
			<div class="app-option-row relative block rounded-2xl">
				<input
					id={optionId(option.value)}
					class="app-option-control peer sr-only"
					type="checkbox"
					checked={selectedCodes.has(option.value)}
					onchange={() => toggleCountry(option.value)}
					aria-describedby={describedby}
				>
				<Label class="app-option-label" for={optionId(option.value)}>
					<span class="app-option-indicator" data-type="checkbox" aria-hidden="true">
						<CheckIcon class="size-3.5" />
					</span>
					<span class="app-option-copy">
						<span class="app-option-title">{option.label ?? option.labelKey}</span>
					</span>
				</Label>
			</div>
		{/each}
	</div>
</div>

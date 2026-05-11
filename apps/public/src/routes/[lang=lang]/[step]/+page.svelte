<script lang="ts">
import { CheckboxGroup } from '@primer-paso/ui/checkbox-group'
import { Field } from '@primer-paso/ui/field'
import { NativeSelect, NativeSelectOption } from '@primer-paso/ui/native-select'
import { RadioGroup } from '@primer-paso/ui/radio-group'
import { trackEvent } from '$lib/analytics/matomo'
import QuestionPage from '$lib/components/questions/QuestionPage.svelte'
import { getTranslator } from '$lib/content'
import CountryCertificateStatus from '$lib/journey/adapters/CountryCertificateStatus.svelte'
import CountryList from '$lib/journey/adapters/CountryList.svelte'
import { COMMON_PREVIOUS_RESIDENCE_COUNTRY_CODES } from '$lib/journey/previous-residence-country-options'
import type { PreviousResidenceCountry } from '$lib/journey/types'

let { data, form } = $props()

const locale = $derived(data.locale ?? 'es')
const tt = $derived(getTranslator(locale))
const provinceId = $derived(`${data.step.field}-select`)

const rawValue = $derived(form?.value ?? data.value)
const distinctBody = $derived(
	data.step.body && data.step.body !== data.step.title ? data.step.body : undefined
)
const currentError = $derived(form?.error)

const scalarValue = $derived(typeof rawValue === 'string' ? rawValue : '')
const multiValue = $derived(
	Array.isArray(rawValue)
		? rawValue.filter((entry): entry is string => typeof entry === 'string')
		: []
)
const countryValue = $derived(
	Array.isArray(rawValue)
		? rawValue.filter(
				(entry): entry is PreviousResidenceCountry =>
					typeof entry === 'object' &&
					entry !== null &&
					'countryCode' in entry &&
					typeof entry.countryCode === 'string'
			)
		: []
)
let countryFormValue = $state<PreviousResidenceCountry[]>([])

$effect(() => {
	countryFormValue = countryValue
})

const errorSummaryItems = $derived(
	currentError
		? [
				{
					href: data.step.adapter === 'select' ? `#${provinceId}` : `#${data.step.field}`,
					message: currentError
				}
			]
		: []
)

let lastTrackedError = $state<string | null>(null)

$effect(() => {
	if (
		typeof form?.error !== 'string' ||
		form.error.length === 0 ||
		form.error === lastTrackedError
	) {
		return
	}

	trackEvent('Journey', 'Validation error', data.step.slug)
	lastTrackedError = form.error
})
</script>
<svelte:head> <meta name="robots" content="noindex, nofollow"> </svelte:head>
<QuestionPage
	{locale}
	errors={errorSummaryItems}
	returnTo={data.returnTo}
	backHref={data.backHref}
	stepSlug={data.step.slug}
>
	{#if data.step.adapter === 'single-choice'}
		<Field
			asFieldset
			asPageHeading
			id={data.step.field}
			name={data.step.field}
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
		>
			{#snippet input(_props)}
				<RadioGroup
					name={data.step.field}
					value={scalarValue}
					options={data.step.options}
					describedby={_props.describedby}
				/>
			{/snippet}
		</Field>
	{:else if data.step.adapter === 'multi-choice'}
		<Field
			asFieldset
			asPageHeading
			id={data.step.field}
			name={data.step.field}
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
		>
			{#snippet input(_props)}
				<CheckboxGroup
					name={data.step.field}
					values={multiValue}
					options={data.step.options}
					describedby={_props.describedby}
				/>
			{/snippet}
		</Field>
	{:else if data.step.adapter === 'country-list'}
		<Field
			asFieldset
			asPageHeading
			id={data.step.field}
			name={data.step.field}
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
		>
			{#snippet input(_props)}
				<CountryList
					name={data.step.field}
					bind:value={countryFormValue}
					options={data.step.options}
					locale={data.locale ?? 'es'}
					searchLabel={tt('steps.previous_residence_countries.search_label')}
					commonCountryCodes={COMMON_PREVIOUS_RESIDENCE_COUNTRY_CODES}
					labels={{
						spain: tt('steps.previous_residence_countries.spain_locked_label'),
						spainHint: tt('steps.previous_residence_countries.spain_locked_hint'),
						commonCountries: tt('steps.previous_residence_countries.common_countries_label'),
						allOtherCountries: tt('steps.previous_residence_countries.all_other_countries'),
						searchResults: tt('steps.previous_residence_countries.search_results')
					}}
					describedby={_props.describedby}
				/>
			{/snippet}
		</Field>
	{:else if data.step.adapter === 'country-certificate-status'}
		<Field
			asFieldset
			asPageHeading
			id={data.step.field}
			name={data.step.field}
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
		>
			{#snippet input(_props)}
				<CountryCertificateStatus
					name={data.step.field}
					bind:value={countryFormValue}
					locale={data.locale ?? 'es'}
					describedby={_props.describedby}
					labels={{
						status: {
							already_have: tt('steps.criminal_record_certificates.options.already_have'),
							requested_waiting: tt(
								'steps.criminal_record_certificates.options.requested_waiting'
							),
							not_requested_yet: tt(
								'steps.criminal_record_certificates.options.not_requested_yet'
							),
							not_sure: tt('steps.criminal_record_certificates.options.not_sure')
						}
					}}
				/>
			{/snippet}
		</Field>
	{:else if data.step.adapter === 'select'}
		<Field
			id={provinceId}
			name={data.step.field}
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
			asPageHeading
		>
			{#snippet input(_props)}
				<NativeSelect
					id={_props.id}
					name={_props.name}
					value={scalarValue}
					class="w-full"
					aria-invalid={_props.invalid ? 'true' : undefined}
					aria-describedby={_props.describedby}
				>
					<NativeSelectOption value="">{tt('common.choose_an_option')}</NativeSelectOption>
					{#each data.step.options as option}
						<NativeSelectOption value={option.value}>{option.label}</NativeSelectOption>
					{/each}
				</NativeSelect>
			{/snippet}
		</Field>
	{/if}
</QuestionPage>

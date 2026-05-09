<script lang="ts">
import { CheckboxGroup } from '@primer-paso/ui/checkbox-group'
import { Field } from '@primer-paso/ui/field'
import { NativeSelect, NativeSelectOption } from '@primer-paso/ui/native-select'
import { RadioGroup } from '@primer-paso/ui/radio-group'
import { trackEvent } from '$lib/analytics/matomo'
import QuestionPage from '$lib/components/questions/QuestionPage.svelte'
import { getTranslator } from '$lib/content'

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
	eyebrow={data.step.eyebrow}
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

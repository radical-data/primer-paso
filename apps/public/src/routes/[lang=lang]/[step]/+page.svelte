<script lang="ts">
import { trackEvent } from '$lib/analytics/matomo'
import FormField from '$lib/components/forms/FormField.svelte'
import ChoiceGroup from '$lib/components/questions/ChoiceGroup.svelte'
import QuestionPage from '$lib/components/questions/QuestionPage.svelte'
import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select'
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
	error={currentError}
	returnTo={data.returnTo}
	backHref={data.backHref}
	stepSlug={data.step.slug}
>
	{#if data.step.adapter === 'single-choice'}
		<ChoiceGroup
			type="radio"
			name={data.step.field}
			question={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
			options={data.step.options}
			value={scalarValue}
		/>
	{:else if data.step.adapter === 'multi-choice'}
		<ChoiceGroup
			type="checkbox"
			name={data.step.field}
			question={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
			options={data.step.options}
			values={multiValue}
		/>
	{:else if data.step.adapter === 'select'}
		<FormField
			label={data.step.title}
			description={distinctBody}
			hint={data.step.hint}
			error={currentError}
			forId={provinceId}
			asPageHeading
		>
			<NativeSelect
				id={provinceId}
				name={data.step.field}
				value={scalarValue}
				class="w-full"
				aria-invalid={currentError ? 'true' : undefined}
				aria-describedby={`${provinceId}-hint ${provinceId}-error`}
			>
				<NativeSelectOption value="">{tt('common.choose_an_option')}</NativeSelectOption>
				{#each data.step.options as option}
					<NativeSelectOption value={option.value}>{option.label}</NativeSelectOption>
				{/each}
			</NativeSelect>
		</FormField>
	{/if}
</QuestionPage>

<script lang="ts">
import CheckIcon from '@lucide/svelte/icons/check'
import { Label } from '$lib/components/ui/label'

export interface ChoiceOption {
	value: string
	label: string
}

interface Props {
	type: 'radio' | 'checkbox'
	name: string
	options: ChoiceOption[]
	value?: string
	values?: string[]
	question: string
	description?: string
	hint?: string
	error?: string
}

let {
	type,
	name,
	options,
	value = '',
	values = [],
	question,
	description,
	hint,
	error
}: Props = $props()

const isChecked = (optionValue: string) =>
	type === 'radio' ? value === optionValue : values.includes(optionValue)

const optionId = (optionValue: string) => `${name}-${optionValue}`
const hintId = $derived(`${name}-hint`)
const errorId = $derived(`${name}-error`)
const describedBy = $derived(
	[
		description && description !== question ? `${name}-description` : undefined,
		hint ? hintId : undefined,
		error ? errorId : undefined
	]
		.filter((value): value is string => Boolean(value))
		.join(' ')
)
</script>

<fieldset class="question-group" aria-describedby={describedBy || undefined}>
	<legend class="question-legend">
		<h1>{question}</h1>
	</legend>
	{#if description && description !== question}
		<p class="lead-text" id={`${name}-description`}>{description}</p>
	{/if}
	{#if hint}
		<p class="hint" id={hintId}>{hint}</p>
	{/if}
	{#if error}
		<p class="error-text" id={errorId}>{error}</p>
	{/if}
	{#each options as option}
		<div class="app-option-row">
			<input
				class="app-option-control peer"
				id={optionId(option.value)}
				{type}
				{name}
				value={option.value}
				aria-invalid={error ? 'true' : undefined}
				aria-describedby={describedBy || undefined}
				checked={isChecked(option.value)}
			>
			<Label class="app-option-label" for={optionId(option.value)}>
				<span class="app-option-indicator" data-type={type} aria-hidden="true">
					{#if type === 'checkbox'}
						<CheckIcon class="size-3.5" />
					{:else}
						<span class="size-2 rounded-full bg-current"></span>
					{/if}
				</span>
				<span class="app-option-copy"> <span class="app-option-title">{option.label}</span> </span>
			</Label>
		</div>
	{/each}
</fieldset>

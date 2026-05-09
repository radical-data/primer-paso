<script lang="ts">
import type { Snippet } from 'svelte'
import { cn } from '../../utils.js'
import { Label } from '../label/index.js'

export type FieldSnippetProps = {
	id: string
	name: string
	describedby: string | undefined
	invalid: boolean
}

type FieldProps = {
	id: string
	name: string
	label?: string
	description?: string
	hint?: string
	error?: string | null
	asPageHeading?: boolean
	/** When true, render a fieldset + legend (for grouped radios/checkboxes). */
	asFieldset?: boolean
	class?: string
	input: Snippet<[FieldSnippetProps]>
}

let {
	id,
	name,
	label,
	description,
	hint,
	error,
	asPageHeading = false,
	asFieldset = false,
	class: className,
	input
}: FieldProps = $props()

const hintId = $derived(`${id}-hint`)
const errorId = $derived(`${id}-error`)
const descriptionId = $derived(`${id}-description`)
const describedby = $derived(
	[
		description && description !== label ? descriptionId : undefined,
		hint ? hintId : undefined,
		error ? errorId : undefined
	]
		.filter(Boolean)
		.join(' ') || undefined
)
const invalid = $derived(Boolean(error))
</script>

{#if asFieldset}
	<fieldset
		data-slot="field"
		data-invalid={invalid || undefined}
		{id}
		aria-describedby={describedby}
		class={cn('question-group m-0 grid gap-4 border-0 p-0', className)}
	>
		{#if label}
			<legend class="question-legend">
				{#if asPageHeading}
					<h1 class="page-title">{label}</h1>
				{:else}
					<span class="text-base font-semibold leading-7">{label}</span>
				{/if}
			</legend>
		{/if}
		{#if description && description !== label}
			<p class="lead-text max-w-[65ch] text-base leading-7 md:text-lg" id={descriptionId}>
				{description}
			</p>
		{/if}
		{#if hint}
			<p class="text-muted-foreground text-sm leading-6" id={hintId}>{hint}</p>
		{/if}
		{#if error}
			<p class="text-destructive text-sm font-medium" id={errorId}>
				<span class="sr-only">Error:</span>
				{error}
			</p>
		{/if}
		{@render input({ id, name, describedby, invalid })}
	</fieldset>
{:else}
	<div data-slot="field" data-invalid={invalid || undefined} class={cn('form-field', className)}>
		{#if label}
			{#if asPageHeading}
				<Label class="form-label text-sm font-semibold tracking-tight" for={id}>
					<h1 class="page-title">{label}</h1>
				</Label>
			{:else}
				<Label class="form-label text-sm font-semibold tracking-tight" for={id}>{label}</Label>
			{/if}
		{/if}
		{#if description && description !== label}
			<p
				class="form-description text-muted-foreground max-w-[65ch] text-sm leading-6"
				id={descriptionId}
			>
				{description}
			</p>
		{/if}
		{#if hint}
			<p class="text-muted-foreground text-sm leading-6" id={hintId}>{hint}</p>
		{/if}
		{@render input({ id, name, describedby, invalid })}
		{#if error}
			<p class="error-text text-destructive text-sm font-medium" id={errorId}>
				<span class="sr-only">Error:</span>
				{error}
			</p>
		{/if}
	</div>
{/if}

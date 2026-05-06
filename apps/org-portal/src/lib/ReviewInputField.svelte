<script lang="ts">
import ModifiedNote from './ModifiedNote.svelte'

let {
	label,
	name,
	type = 'text',
	value = $bindable(),
	readonly,
	modified,
	original,
	oninput: oninputProp
} = $props<{
	label: string
	name: string
	type?: string
	value: string | undefined
	readonly: boolean
	modified: boolean
	original: string
	oninput?: (event: Event & { currentTarget: HTMLInputElement }) => void
}>()
</script>

<div class="form-field">
	<label for={name}>{label}</label>
	{#if oninputProp}
		<input
			id={name}
			{name}
			{type}
			value={value ?? ''}
			{readonly}
			data-modified={modified}
			oninput={oninputProp}
		>
	{:else}
		<input id={name} {name} {type} bind:value {readonly} data-modified={modified}>
	{/if}
	{#if modified}
		<ModifiedNote {original} />
	{/if}
</div>

<style>
input[data-modified="true"],
input[readonly][data-modified="true"] {
	border-color: var(--color-warning, #b7791f);
	background: color-mix(in srgb, var(--color-warning, #b7791f) 8%, transparent);
}

input[readonly] {
	cursor: default;
}
</style>

<script lang="ts">
import ModifiedNote from './ModifiedNote.svelte'

let {
	label,
	name,
	type = 'text',
	value = $bindable(),
	readonly,
	modified,
	original
} = $props<{
	label: string
	name: string
	type?: string
	value: string | undefined
	readonly: boolean
	modified: boolean
	original: string
}>()
</script>

<div class="form-field">
	<label for={name}>{label}</label>
	<input id={name} {name} {type} bind:value {readonly} data-modified={modified}>
	{#if modified}
		<ModifiedNote {original} />
	{/if}
</div>

<style>
input[data-modified='true'],
input[readonly][data-modified='true'] {
	border-color: var(--color-warning, #b7791f);
	background: color-mix(in srgb, var(--color-warning, #b7791f) 8%, transparent);
}

input[readonly] {
	cursor: default;
}
</style>

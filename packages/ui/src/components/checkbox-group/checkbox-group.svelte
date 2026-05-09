<script lang="ts" module>
export type CheckboxOption = {
	value: string
	label: string
	hint?: string
	disabled?: boolean
}
</script>

<script lang="ts">
import CheckIcon from '@lucide/svelte/icons/check'
import { cn } from '../../utils.js'
import { Label } from '../label/index.js'

type CheckboxGroupProps = {
	name: string
	values?: string[] | null
	options: CheckboxOption[]
	class?: string
	describedby?: string | null
}

let {
	name,
	values = [],
	options,
	class: className,
	describedby = undefined
}: CheckboxGroupProps = $props()

const optionId = (optionValue: string) =>
	`${name}-${optionValue}`.replaceAll(/[^a-zA-Z0-9_-]/g, '-')
const valueList = $derived(values ?? [])
</script>

<div data-slot="checkbox-group" class={cn('grid gap-3', className)}>
	{#each options as option (option.value)}
		<div data-slot="checkbox-option" class="app-option-row relative block rounded-2xl">
			<input
				id={optionId(option.value)}
				class="app-option-control peer sr-only"
				type="checkbox"
				{name}
				value={option.value}
				checked={valueList.includes(option.value)}
				disabled={option.disabled}
				aria-describedby={describedby ?? undefined}
			>
			<Label class="app-option-label" for={optionId(option.value)}>
				<span class="app-option-indicator" data-type="checkbox" aria-hidden="true">
					<CheckIcon class="size-3.5" />
				</span>
				<span class="app-option-copy">
					<span class="app-option-title">{option.label}</span>
					{#if option.hint}
						<span class="text-muted-foreground text-sm leading-6">{option.hint}</span>
					{/if}
				</span>
			</Label>
		</div>
	{/each}
</div>

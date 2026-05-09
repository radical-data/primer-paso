<script lang="ts" module>
export type RadioOption = {
	value: string
	label: string
	hint?: string
	disabled?: boolean
}
</script>

<script lang="ts">
import { cn } from '../../utils.js'
import { Label } from '../label/index.js'

type RadioGroupProps = {
	name: string
	value?: string | null
	options: RadioOption[]
	class?: string
	describedby?: string | null
}

let {
	name,
	value = null,
	options,
	class: className,
	describedby = undefined
}: RadioGroupProps = $props()

const optionId = (optionValue: string) =>
	`${name}-${optionValue}`.replaceAll(/[^a-zA-Z0-9_-]/g, '-')
</script>

<div data-slot="radio-group" class={cn('grid gap-3', className)}>
	{#each options as option (option.value)}
		<div data-slot="radio-option" class="app-option-row relative block rounded-2xl">
			<input
				id={optionId(option.value)}
				class="app-option-control peer sr-only"
				type="radio"
				{name}
				value={option.value}
				checked={value === option.value}
				disabled={option.disabled}
				aria-describedby={describedby ?? undefined}
			>
			<Label class="app-option-label" for={optionId(option.value)}>
				<span class="app-option-indicator" data-type="radio" aria-hidden="true">
					<span class="size-2 rounded-full bg-current"></span>
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

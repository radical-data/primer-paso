<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'
import { cn } from '../../utils.js'

type SeparatorProps = HTMLAttributes<HTMLHRElement> & {
	ref?: HTMLHRElement | null
	orientation?: 'horizontal' | 'vertical'
}

let {
	ref = $bindable(null),
	class: className,
	'data-slot': dataSlot = 'separator',
	orientation = 'horizontal',
	...restProps
}: SeparatorProps = $props()
</script>

<hr
	bind:this={ref}
	data-slot={dataSlot}
	data-orientation={orientation}
	aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
	class={cn(
		'bg-border shrink-0 border-0',
		orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
		className
	)}
	{...restProps}
>

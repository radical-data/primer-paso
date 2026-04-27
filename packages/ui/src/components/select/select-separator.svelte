<script lang="ts">
import type { HTMLAttributes } from 'svelte/elements'
import { cn } from '../../utils.js'
import { Separator } from '../separator/index.js'

let {
	ref = $bindable(null),
	class: className,
	...restProps
}: HTMLAttributes<HTMLHRElement> & { ref?: HTMLHRElement | null } = $props()
</script>

<Separator
	bind:ref
	data-slot="select-separator"
	class={cn("bg-border -mx-1 my-1 h-px pointer-events-none", className)}
	{...restProps}
/>

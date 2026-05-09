<script lang="ts" module>
export type StatusTone = 'success' | 'info' | 'warning' | 'neutral'
</script>

<script lang="ts">
import type { Snippet } from 'svelte'
import { cn } from '../../utils.js'

const dataTone = (tone: StatusTone): string => {
	switch (tone) {
		case 'success':
			return 'positive'
		case 'info':
			return 'informational'
		case 'warning':
			return 'caution'
		case 'neutral':
			return 'neutral'
		default:
			return 'neutral'
	}
}

type StatusPanelProps = {
	tone?: StatusTone
	class?: string
	children: Snippet
}

let { tone = 'neutral', class: className, children }: StatusPanelProps = $props()

const resolvedDataTone = $derived(dataTone(tone))
</script>

<section
	data-slot="status-panel"
	class={cn('status-panel', className)}
	data-tone={resolvedDataTone}
>
	{@render children()}
</section>

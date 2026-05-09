<script lang="ts" module>
export type SummaryListRow = {
	key: string
	value: string | number | null | undefined
	actionHref?: string
	actionLabel?: string
}
</script>

<script lang="ts">
import { cn } from '../../utils.js'
import { Button } from '../button/index.js'

type SummaryListProps = {
	rows: SummaryListRow[]
	/** When set, shown for null/undefined/empty string values. Otherwise the value cell is empty. */
	emptyValueLabel?: string
	class?: string
}

let { rows, emptyValueLabel, class: className }: SummaryListProps = $props()

const cellValue = (value: SummaryListRow['value']) => {
	const empty = value === null || value === undefined || value === ''
	if (empty) {
		return emptyValueLabel !== undefined ? emptyValueLabel : ''
	}
	return String(value)
}
</script>

<dl data-slot="summary-list" class={cn('check-list grid gap-3', className)}>
	{#each rows as row (row.key + String(row.value))}
		<div
			data-slot="summary-list-row"
			class="check-row border-border grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start"
		>
			<dt class="section-title m-0 text-base font-semibold">{row.key}</dt>
			<dd class="m-0">{cellValue(row.value)}</dd>
			{#if row.actionHref && row.actionLabel}
				<dd class="m-0 flex items-start justify-start md:justify-end">
					<Button href={row.actionHref} variant="outline" size="sm">
						{row.actionLabel}
						<span class="sr-only"> {row.key}</span>
					</Button>
				</dd>
			{/if}
		</div>
	{/each}
</dl>

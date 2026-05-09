<script lang="ts" module>
export type ErrorSummaryItem = {
	href: string
	message: string
}
</script>

<script lang="ts">
import { cn } from '../../utils.js'

type ErrorSummaryProps = {
	title?: string
	errors: ErrorSummaryItem[]
	class?: string
	titleId?: string
}

let {
	title = 'There is a problem',
	errors,
	class: className,
	titleId: titleIdProp
}: ErrorSummaryProps = $props()

const titleId = $derived(titleIdProp ?? 'error-summary-title')
</script>

{#if errors.length > 0}
	<section
		data-slot="error-summary"
		role="alert"
		aria-labelledby={titleId}
		class={cn('error-summary', className)}
	>
		<h2 id={titleId} data-slot="error-summary-title" class="error-summary-title">
			{title}
		</h2>
		<ul class="m-0 mt-3 grid list-none gap-2 p-0">
			{#each errors as errorItem (errorItem.href + errorItem.message)}
				<li>
					<a
						class="error-text font-medium underline underline-offset-2 hover:decoration-2"
						href={errorItem.href}
					>
						{errorItem.message}
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

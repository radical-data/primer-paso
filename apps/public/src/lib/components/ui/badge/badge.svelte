<script lang="ts" module>
import type { HTMLAttributes } from 'svelte/elements'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn, type WithElementRef } from '$lib/utils.js'

export const badgeVariants = tv({
	base: 'inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-semibold shadow-xs transition-colors',
	variants: {
		variant: {
			default: 'border-transparent bg-primary text-primary-foreground',
			secondary: 'border-transparent bg-secondary text-secondary-foreground',
			outline: 'border-border text-foreground',
			success:
				'border-transparent bg-[var(--color-success-soft)] text-[var(--color-success-foreground)]',
			info: 'border-transparent bg-[var(--color-info-soft)] text-[var(--color-info-foreground)]',
			warning:
				'border-transparent bg-[var(--color-warning-soft)] text-[var(--color-warning-foreground)]'
		}
	},
	defaultVariants: {
		variant: 'default'
	}
})

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant']
export type BadgeProps = WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> & {
	variant?: BadgeVariant
}
</script>

<script lang="ts">
let {
	class: className,
	variant = 'default',
	ref = $bindable(null),
	children,
	...restProps
}: BadgeProps = $props()
</script>

<span
	bind:this={ref}
	data-slot="badge"
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</span>

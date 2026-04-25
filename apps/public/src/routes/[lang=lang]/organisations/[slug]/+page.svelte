<script lang="ts">
import Clock3Icon from '@lucide/svelte/icons/clock-3'
import GlobeIcon from '@lucide/svelte/icons/globe'
import MailIcon from '@lucide/svelte/icons/mail'
import MapPinIcon from '@lucide/svelte/icons/map-pin'
import PhoneIcon from '@lucide/svelte/icons/phone'
import { trackEvent } from '$lib/analytics/matomo'
import { Button } from '$lib/components/ui/button'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
import type { OrganisationRecord } from '$lib/organisations/types'

let {
	data
}: {
	data: {
		locale?: Locale
		backHref: string
		organisation: OrganisationRecord
	}
} = $props()

const tt = $derived(getTranslator(data.locale ?? 'es'))
const organisation = $derived(data.organisation)

const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

const formatOpeningHoursLabel = (startDay: number, endDay: number) =>
	startDay === endDay
		? (weekdayLabels[startDay] ?? '')
		: `${weekdayLabels[startDay] ?? ''}–${weekdayLabels[endDay] ?? ''}`

const formatTimeRanges = (value: string) => value.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, '$1–$2')

const metaDescription = $derived.by(() => {
	const parts = [
		organisation.location,
		organisation.phone ? tt('pages.organisations.detail.meta_has_phone') : '',
		organisation.website ? tt('pages.organisations.detail.meta_has_website') : ''
	].filter(Boolean)

	return parts.join(' · ')
})
</script>

<svelte:head>
	<title>{organisation.name} | {tt('pages.organisations.meta_title')} | Primer Paso</title>
	<meta name="description" content={metaDescription || tt('pages.organisations.meta_description')}>
</svelte:head>

<section class="stack">
	<p class="eyebrow">{tt('pages.organisations.eyebrow')}</p>

	<div class="app-card stack">
		<div class="section-block">
			<div class="actions">
				<Button href={data.backHref} variant="outline">{tt('common.back')}</Button>
			</div>
			<h1 class="page-title">{organisation.name}</h1>
			<p class="lead-text">{tt('pages.organisations.detail.lead')}</p>
		</div>

		<div class="result-grid">
			<section class="panel section-block">
				<h2 class="section-title">{tt('pages.organisations.detail.contact_title')}</h2>
				<div class="directory-card-list">
					{#if organisation.location}
						<p class="supporting-text inline-flex items-start gap-2">
							<MapPinIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
							<span>{organisation.location}</span>
						</p>
					{/if}
					{#if organisation.phone}
						<p class="supporting-text inline-flex items-start gap-2">
							<PhoneIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
							<a href={`tel:${organisation.phone}`}>{organisation.phone}</a>
						</p>
					{/if}
					{#if organisation.email}
						<p class="supporting-text inline-flex items-start gap-2">
							<MailIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
							<a href={`mailto:${organisation.email}`}>{organisation.email}</a>
						</p>
					{/if}
					{#if organisation.website}
						<p class="supporting-text inline-flex items-start gap-2">
							<GlobeIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
							<a href={organisation.website} target="_blank" rel="noreferrer">
								{organisation.website}
							</a>
						</p>
					{/if}
				</div>

				<div class="actions">
					{#if organisation.website}
						<Button
							href={organisation.website}
							target="_blank"
							rel="noreferrer"
							onclick={() =>
								trackEvent('Directory', 'Open organisation website', organisation.slug)}
						>
							{tt('common.visit_website')}
						</Button>
					{/if}
					{#if organisation.email}
						<Button
							href={`mailto:${organisation.email}`}
							variant="outline"
							onclick={() => trackEvent('Directory', 'Email organisation', organisation.slug)}
						>
							{tt('common.email')}
						</Button>
					{/if}
					{#if organisation.phone}
						<Button
							href={`tel:${organisation.phone}`}
							variant="outline"
							onclick={() => trackEvent('Directory', 'Call organisation', organisation.slug)}
						>
							{tt('common.call')}
						</Button>
					{/if}
				</div>
			</section>

			{#if organisation.openingHours.length > 0}
				<section class="panel section-block">
					<h2 class="section-title">{tt('pages.organisations.detail.opening_hours_title')}</h2>
					<div class="directory-hours">
						{#each organisation.openingHours as row (`${organisation.id}-${row.startDay}-${row.endDay}-${row.hours}`)}
							<p class="supporting-text directory-hours-row">
								<span class="directory-hours-icon" aria-hidden="true">
									<Clock3Icon class="size-4" />
								</span>
								<span class="directory-hours-label">
									{formatOpeningHoursLabel(row.startDay, row.endDay)}
								</span>
								<span>{formatTimeRanges(row.hours)}</span>
							</p>
						{/each}
					</div>
				</section>
			{/if}
		</div>

		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.organisations.guidance_title')}</h2>
			<p class="supporting-text">{tt('pages.organisations.detail.guidance_body')}</p>
		</div>
	</div>
</section>

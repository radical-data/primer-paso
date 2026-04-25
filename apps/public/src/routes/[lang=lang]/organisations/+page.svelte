<script lang="ts">
import Building2Icon from '@lucide/svelte/icons/building-2'
import Clock3Icon from '@lucide/svelte/icons/clock-3'
import GlobeIcon from '@lucide/svelte/icons/globe'
import MailIcon from '@lucide/svelte/icons/mail'
import MapPinIcon from '@lucide/svelte/icons/map-pin'
import PhoneIcon from '@lucide/svelte/icons/phone'
import SearchIcon from '@lucide/svelte/icons/search'
import { trackEvent } from '$lib/analytics/matomo'
import { Badge } from '$lib/components/ui/badge'
import { Button } from '$lib/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
import { Input } from '$lib/components/ui/input'
import { Label } from '$lib/components/ui/label'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
import { localiseHref } from '$lib/i18n/routing'
import type { OrganisationRecord } from '$lib/organisations/types'

type DirectoryData = {
	locale?: Locale
	filters: { q: string }
	organisations: OrganisationRecord[]
	summary: { total: number; withWebsite: number; withPhone: number; withEmail: number }
}

let { data }: { data: DirectoryData } = $props()
const tt = $derived(getTranslator(data.locale ?? 'es'))

const resultLabel = $derived.by(() =>
	tt(
		data.summary.total === 1
			? 'pages.organisations.summary.one'
			: 'pages.organisations.summary.many',
		{
			count: String(data.summary.total)
		}
	)
)

const weekdayDates = [
	new Date(Date.UTC(2026, 0, 5)),
	new Date(Date.UTC(2026, 0, 6)),
	new Date(Date.UTC(2026, 0, 7)),
	new Date(Date.UTC(2026, 0, 8)),
	new Date(Date.UTC(2026, 0, 9)),
	new Date(Date.UTC(2026, 0, 10)),
	new Date(Date.UTC(2026, 0, 11))
]

const formatWeekday = (dayIndex: number) =>
	new Intl.DateTimeFormat(data.locale ?? 'es', { weekday: 'short', timeZone: 'UTC' }).format(
		weekdayDates[dayIndex]
	)

const formatOpeningHoursLabel = (startDay: number, endDay: number) =>
	startDay === endDay
		? formatWeekday(startDay)
		: `${formatWeekday(startDay)}–${formatWeekday(endDay)}`

const formatTimeRanges = (value: string) => value.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/g, '$1–$2')

const trackDirectorySearch = () => {
	const query = data.filters.q.trim()
	if (!query) return
	trackEvent('Directory', 'Search', query)
}
</script>

<svelte:head>
	<title>{tt('pages.organisations.meta_title')} | Primer Paso</title>
	<meta name="description" content={tt('pages.organisations.meta_description')}>
</svelte:head>

<section class="stack">
	<p class="eyebrow">{tt('pages.organisations.eyebrow')}</p>
	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">{tt('pages.organisations.title')}</h1>
			<p class="lead-text">{tt('pages.organisations.lead')}</p>
		</div>

		<form
			class="directory-toolbar"
			method="GET"
			onsubmit={trackDirectorySearch}
			action={localiseHref(data.locale ?? 'es', '/organisations')}
		>
			<div class="form-field">
				<Label for="directory-search">{tt('pages.organisations.search_label')}</Label>
				<div class="relative">
					<Input
						id="directory-search"
						name="q"
						value={data.filters.q}
						placeholder={tt('pages.organisations.search_placeholder')}
						class="w-full pl-10"
					/>
					<SearchIcon
						class="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2"
						aria-hidden="true"
					/>
				</div>
			</div>

			<div class="directory-toolbar-actions">
				<Button type="submit">{tt('pages.organisations.apply_filters')}</Button>
				<Button href={localiseHref(data.locale ?? 'es', '/organisations')} variant="outline"
					>{tt('pages.organisations.clear')}</Button
				>
			</div>
		</form>

		<div class="directory-meta" aria-live="polite">
			<Badge variant="outline">{resultLabel}</Badge>
		</div>

		{#if data.organisations.length > 0}
			<div class="directory-grid">
				{#each data.organisations as organisation (organisation.id)}
					<Card class="directory-card" size="sm">
						<CardHeader>
							<div class="flex items-start gap-3">
								<div class="rounded-full bg-secondary p-2">
									<Building2Icon class="size-4" aria-hidden="true" />
								</div>
								<div class="grid gap-2">
									<CardTitle>{organisation.name}</CardTitle>
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
												<span>{organisation.phone}</span>
											</p>
										{/if}
										{#if organisation.email}
											<p class="supporting-text inline-flex items-start gap-2">
												<MailIcon class="mt-1 size-4 shrink-0" aria-hidden="true" />
												<span>{organisation.email}</span>
											</p>
										{/if}
										{#if organisation.openingHours.length > 0}
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
										{/if}
									</div>
								</div>
							</div>
						</CardHeader>
						<CardFooter class="gap-3 px-6 pb-4">
							<Button
								href={localiseHref(data.locale ?? 'es', `/organisations/${organisation.slug}`)}
								variant="outline"
								onclick={() =>
									trackEvent('Directory', 'View organisation detail', organisation.slug)}
							>
								{tt('pages.organisations.action.view_details')}
							</Button>
							{#if organisation.website}
								<Button
									href={organisation.website}
									target="_blank"
									rel="noreferrer"
									onclick={() =>
										trackEvent('Directory', 'Open organisation website', organisation.slug)}
									variant="secondary"
								>
									{tt('common.visit_website')}
									<GlobeIcon class="size-4" />
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
						</CardFooter>
					</Card>
				{/each}
			</div>
		{:else}
			<div class="panel-subtle section-block">
				<h2 class="section-title">{tt('pages.organisations.empty_title')}</h2>
				<p class="supporting-text">{tt('pages.organisations.empty_body')}</p>
				<div class="actions">
					<Button href={localiseHref(data.locale ?? 'es', '/organisations')} variant="outline">
						{tt('pages.organisations.action.browse_all')}
					</Button>
				</div>
			</div>
		{/if}

		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.organisations.guidance_title')}</h2>
			<p class="supporting-text">{tt('pages.organisations.guidance_body')}</p>
			<div class="actions">
				<Button
					href={localiseHref(data.locale ?? 'es', '/screener')}
					onclick={() => trackEvent('Journey', 'Open start', 'organisations')}
					>{tt('pages.organisations.action.start_screener')}</Button
				>
			</div>
		</div>
	</div>
</section>

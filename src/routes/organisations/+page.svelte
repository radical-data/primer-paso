<script lang="ts">
import Building2Icon from '@lucide/svelte/icons/building-2'
import GlobeIcon from '@lucide/svelte/icons/globe'
import MailIcon from '@lucide/svelte/icons/mail'
import MapPinIcon from '@lucide/svelte/icons/map-pin'
import PhoneIcon from '@lucide/svelte/icons/phone'
import SearchIcon from '@lucide/svelte/icons/search'
import { Badge } from '$lib/components/ui/badge'
import { Button } from '$lib/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card'
import { Input } from '$lib/components/ui/input'
import { Label } from '$lib/components/ui/label'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'
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

		<form class="directory-toolbar" method="GET" action="/organisations">
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
				<Button href="/organisations" variant="outline">{tt('pages.organisations.clear')}</Button>
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
										{#if organisation.openingHours}
											<p class="supporting-text">{organisation.openingHours}</p>
										{/if}
									</div>
								</div>
							</div>
						</CardHeader>
						<CardFooter class="gap-3 px-6 pb-4">
							{#if organisation.website}
								<Button
									href={organisation.website}
									target="_blank"
									rel="noreferrer"
									variant="secondary"
								>
									{tt('pages.organisations.action.visit_website')}
									<GlobeIcon class="size-4" />
								</Button>
							{/if}
							{#if organisation.email}
								<Button href={`mailto:${organisation.email}`} variant="outline">
									{tt('pages.organisations.action.email')}
								</Button>
							{/if}
							{#if organisation.phone}
								<Button href={`tel:${organisation.phone}`} variant="outline">
									{tt('pages.organisations.action.call')}
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
					<Button href="/organisations" variant="outline">
						{tt('pages.organisations.action.browse_all')}
					</Button>
				</div>
			</div>
		{/if}

		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.organisations.guidance_title')}</h2>
			<p class="supporting-text">{tt('pages.organisations.guidance_body')}</p>
			<div class="actions">
				<Button href="/start">{tt('pages.organisations.action.start_screener')}</Button>
			</div>
		</div>
	</div>
</section>

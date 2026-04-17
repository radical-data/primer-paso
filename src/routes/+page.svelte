<script lang="ts">
import { Button } from '$lib/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '$lib/components/ui/card'
import type { Locale } from '$lib/content'
import { getTranslator } from '$lib/content'

let { data } = $props()
const tt = $derived(getTranslator((data.locale ?? 'es') as Locale))
</script>

<section class="stack">
	<p class="eyebrow">{tt('pages.home.eyebrow')}</p>
	<div class="app-card stack">
		<div class="section-block">
			<h1 class="page-title">{tt('pages.home.title')}</h1>
			<p class="lead-text">{tt('pages.home.lead')}</p>
		</div>
		<div class="section-block">
			<h2 class="section-title">{tt('pages.home.choose')}</h2>
			<div class="task-grid">
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{tt('pages.home.quiz_title')}</CardTitle>
						<CardDescription>{tt('pages.home.quiz_body')}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter> <Button href="/start">{tt('pages.home.quiz_action')}</Button> </CardFooter>
				</Card>
				<Card class="task-card">
					<CardHeader>
						<CardTitle>{tt('pages.home.directory_title')}</CardTitle>
						<CardDescription>{tt('pages.home.directory_body')}</CardDescription>
					</CardHeader>
					<CardContent />
					<CardFooter>
						<Button href="/organisations" variant="secondary">
							{tt('pages.home.directory_action')}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</div>
		<div class="panel-subtle section-block">
			<h2 class="section-title">{tt('pages.home.note_title')}</h2>
			<p class="supporting-text">{tt('pages.home.note_body')}</p>
		</div>
	</div>
</section>

<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@primer-paso/ui/card'
</script>

<svelte:head> <title>Organisation portal | Primer Paso</title> </svelte:head>

<div class="stack-lg">
	<div class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Organisation portal</h1>
		<p class="lead-text">
			Open certificate handoffs, review draft information, record verification confirmations, and
			prepare certificates for issue.
		</p>
	</div>

	<Card>
		<CardHeader> <CardTitle>Sign in to continue</CardTitle> </CardHeader>
		<CardContent class="stack">
			<p class="supporting-text">
				Certificate issue is limited to authorised organisation users. All actions are recorded in
				the audit history.
			</p>
			<div class="actions"><Button href="/login">Sign in</Button></div>
		</CardContent>
	</Card>
</div>

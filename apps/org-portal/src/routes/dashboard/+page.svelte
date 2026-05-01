<script lang="ts">
import ClipboardListIcon from '@lucide/svelte/icons/clipboard-list'
import HistoryIcon from '@lucide/svelte/icons/history'
import UsersIcon from '@lucide/svelte/icons/users'
import { Badge } from '@primer-paso/ui/badge'
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'

let { data } = $props()
</script>

<svelte:head> <title>Dashboard | Primer Paso organisation portal</title> </svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Organisation dashboard</h1>
		<div class="actions">
			<span class="hint">Signed in as</span>
			<Badge variant="secondary">{data.session.role}</Badge>
		</div>
	</header>

	{#if data.permissionError}
		<div class="error-summary" role="alert">
			<p class="error-summary-title">Permission denied</p>
			<p class="error-text">
				You do not have permission to perform that action for this organisation.
			</p>
		</div>
	{/if}

	<Card>
		<CardHeader>
			<CardTitle>
				<span class="inline-flex items-center gap-2">
					<ClipboardListIcon class="size-5 text-muted-foreground" aria-hidden="true" />
					Open a certificate handoff
				</span>
			</CardTitle>
			<CardDescription>
				Open this page from a Primer Paso QR code, or paste the handoff link or token below.
			</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="GET" action="/handoff" class="stack">
				<div class="form-field">
					<Label for="token">Handoff token or link</Label>
					<Input id="token" name="token" autocomplete="off" placeholder="Paste a token or URL" />
				</div>
				<div class="actions"><Button type="submit">Open handoff</Button></div>
			</form>
		</CardContent>
	</Card>

	{#if data.adminLinks.canManageMembers || data.adminLinks.canReadAudit}
		<Card>
			<CardHeader>
				<CardTitle>Organisation admin</CardTitle>
				<CardDescription>Tools available to your role.</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-3 md:grid-cols-2">
					{#if data.adminLinks.canManageMembers}
						<a
							href="/admin/members"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<UsersIcon class="size-5 mt-0.5 text-muted-foreground" aria-hidden="true" />
							<span class="grid gap-1">
								<span class="section-title">Manage members</span>
								<span class="hint">Add, deactivate, or change roles for organisation members.</span>
							</span>
						</a>
					{/if}
					{#if data.adminLinks.canReadAudit}
						<a
							href="/admin/audit"
							class="panel-subtle flex items-start gap-3 no-underline transition-colors hover:bg-accent/60"
						>
							<HistoryIcon class="size-5 mt-0.5 text-muted-foreground" aria-hidden="true" />
							<span class="grid gap-1">
								<span class="section-title">View audit log</span>
								<span class="hint">Review actions taken in the portal for this organisation.</span>
							</span>
						</a>
					{/if}
				</div>
			</CardContent>
		</Card>
	{/if}
</div>

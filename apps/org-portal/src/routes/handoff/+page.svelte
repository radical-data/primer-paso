<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'

let { data } = $props()
</script>

<svelte:head>
	<title>Borrador de certificado | Portal de organizaciones de Primer Paso</title>
</svelte:head>

<div class="stack-lg">
	<header class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Borrador de certificado</h1>
	</header>

	<Card>
		<CardHeader>
			<CardTitle>
				{#if data.hasToken}
					Referencia de borrador recibida
				{:else}
					Sin referencia de borrador
				{/if}
			</CardTitle>
			<CardDescription>
				{#if data.hasToken}
					Inicia sesión como persona autorizada de la organización para abrir el borrador.
				{:else}
					Abre esta página desde un código QR de Primer Paso o pega el enlace o código del borrador.
				{/if}
			</CardDescription>
		</CardHeader>
		{#if !data.hasToken}
			<CardContent>
				<form method="GET" action="/handoff" class="stack">
					<div class="form-field">
						<Label for="token">Enlace o código del borrador</Label>
						<Input
							id="token"
							name="token"
							autocomplete="off"
							placeholder="Pega un enlace o código"
						/>
					</div>
					<div class="actions"><Button type="submit">Abrir borrador</Button></div>
				</form>
			</CardContent>
		{/if}
	</Card>
</div>

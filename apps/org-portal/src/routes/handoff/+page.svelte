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
					Acceso al borrador en curso
				{:else}
					Abrir borrador de certificado
				{/if}
			</CardTitle>
			<CardDescription>
				{#if data.hasToken}
					Inicia sesión como persona autorizada de la organización para abrir el borrador.
				{:else}
					Abre esta página desde un código QR de Primer Paso o pega el enlace seguro del borrador.
				{/if}
			</CardDescription>
		</CardHeader>
		{#if !data.hasToken}
			<CardContent>
				{#if data.error === 'reference_code_not_supported'}
					<div class="panel-subtle" role="alert">
						<p class="text-pretty">
							Ese código es solo una referencia. Para abrir el borrador necesitas escanear el QR o
							pegar el enlace seguro completo.
						</p>
					</div>
				{:else if data.error === 'missing_token'}
					<div class="panel-subtle" role="alert">
						<p class="text-pretty">Pega el enlace seguro completo del borrador.</p>
					</div>
				{/if}
				<form method="GET" action="/handoff" class="stack">
					<div class="form-field">
						<Label for="token">Enlace seguro del borrador</Label>
						<Input
							id="token"
							name="token"
							autocomplete="off"
							placeholder="Pega el enlace seguro del borrador"
						/>
					</div>
					<div class="actions"><Button type="submit">Abrir borrador</Button></div>
				</form>
			</CardContent>
		{/if}
	</Card>
</div>

<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@primer-paso/ui/card'
import { Input } from '@primer-paso/ui/input'
import { Label } from '@primer-paso/ui/label'

let { data, form } = $props()
</script>

<svelte:head> <title>Iniciar sesión | Portal de organizaciones de Primer Paso</title> </svelte:head>

<div class="stack-lg">
	<div class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Iniciar sesión en el portal de organizaciones</h1>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Enviar enlace de acceso</CardTitle>
			<CardDescription>
				{#if data.hasPendingHandoff}
					Inicia sesión para abrir el borrador de certificado.
				{:else}
					Introduce el correo de tu organización. Te enviaremos un enlace de acceso seguro.
				{/if}
			</CardDescription>
		</CardHeader>
		<CardContent class="stack">
			{#if form?.success}
				<div class="panel-subtle" role="status">
					<p class="text-pretty">
						{form.message ?? 'Revisa tu correo. El enlace de acceso abrirá este portal.'}
					</p>
				</div>
			{:else}
				{#if form?.error}
					<div class="error-summary" role="alert">
						<p class="error-summary-title">No se pudo enviar el enlace de acceso</p>
						<p class="error-text">{form.error}</p>
					</div>
				{/if}
				<form method="POST" class="stack">
					<input type="hidden" name="next" value={data.next}>
					<div class="form-field">
						<Label for="email">Correo de la organización</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							value={form?.email ?? data.email ?? ''}
						/>
					</div>
					<div class="actions"><Button type="submit">Enviar enlace de acceso</Button></div>
				</form>
			{/if}

			{#if !form?.success}
				<p class="hint">
					El acceso está limitado a miembros activos de organizaciones colaboradoras.
				</p>
			{/if}
		</CardContent>
	</Card>
</div>

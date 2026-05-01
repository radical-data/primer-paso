<script lang="ts">
import { Button } from '@primer-paso/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@primer-paso/ui/card'
</script>

<svelte:head> <title>Portal de organizaciones | Primer Paso</title> </svelte:head>

<div class="stack-lg">
	<div class="section-block">
		<p class="eyebrow">Primer Paso</p>
		<h1 class="page-title">Portal de organizaciones</h1>
		<p class="lead-text">
			Utiliza este portal para abrir borradores de certificado, revisar la información, registrar
			las confirmaciones de verificación y preparar certificados para su emisión.
		</p>
	</div>

	<Card>
		<CardHeader> <CardTitle>Iniciar sesión para continuar</CardTitle> </CardHeader>
		<CardContent class="stack">
			<p class="supporting-text">
				La emisión de certificados está limitada a personas autorizadas de la organización. Todas
				las acciones quedan registradas en el historial de auditoría.
			</p>
			<div class="actions"><Button href="/login">Iniciar sesión</Button></div>
		</CardContent>
	</Card>
</div>

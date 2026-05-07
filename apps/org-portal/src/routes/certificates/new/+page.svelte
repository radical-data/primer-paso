<script lang="ts">
import * as Card from '@primer-paso/ui/card'
import CertificateReviewForm from '$lib/components/certificate-review-form.svelte'

let { data, form } = $props()
</script>

<svelte:head> <title>Crear revisión de certificado | Primer Paso org portal</title> </svelte:head>

<div class="stack-lg">
	<header class="stack">
		<h1 class="page-title">Crear revisión de certificado</h1>
		<p class="text-muted-foreground max-w-3xl">
			Introduce los datos iniciales cuando la atención empieza directamente con la organización.
		</p>
	</header>

	<Card.Root>
		<Card.Header>
			<Card.Title>Datos iniciales</Card.Title>
			<Card.Description>
				Estos datos se guardarán como datos iniciales de la revisión. Podrán corregirse antes de
				emitir el certificado.
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<CertificateReviewForm
				value={data.formValue}
				documentTypeOptions={data.documentTypeOptions}
				vulnerabilityReasonOptions={data.vulnerabilityReasonOptions}
				action="?/create"
				submitLabel="Crear revisión"
				error={form?.error}
			/>
		</Card.Content>
	</Card.Root>
</div>

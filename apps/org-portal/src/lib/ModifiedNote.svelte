<script lang="ts">
let { original } = $props<{
	original: string
}>()
</script>

<p class="modified-note">Modificado. Original: {original}</p>

<style>
.modified-note {
	margin-top: 0.25rem;
	font-size: 0.875rem;
	font-weight: 600;
	color: var(--color-warning-text, #92400e);
}
</style>

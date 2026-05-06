import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import mermaid from 'astro-mermaid'

export default defineConfig({
	site: 'https://research.primerpaso.org',
	integrations: [
		starlight({
			title: 'Primer Paso Research',
			description: 'Research notes on regularisation and civic tech.',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/radical-data/primer-paso'
				}
			],
			sidebar: [
				{
					label: 'Regularisation',
					autogenerate: { directory: 'regularisation' }
				},
				{
					label: 'Civic tech',
					autogenerate: { directory: 'civic-tech' }
				}
			]
		}),
		mermaid({
			theme: 'forest',
			autoTheme: true,
			mermaidConfig: {
				flowchart: {
					curve: 'basis'
				}
			}
		})
	],
})

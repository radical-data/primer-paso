/** @type {import('prettier').Config} */
export default {
	plugins: ['prettier-plugin-astro'],

	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro'
			}
		}
	],

	useTabs: true,
	printWidth: 100,
	semi: false,
	singleQuote: true,
	trailingComma: 'none'
}

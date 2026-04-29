import { getSitemapEntries, renderSitemapXml } from '$lib/server/sitemap'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = () => {
	const xml = renderSitemapXml(getSitemapEntries())

	return new Response(xml, {
		headers: {
			'content-type': 'application/xml; charset=utf-8',
			'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400'
		}
	})
}

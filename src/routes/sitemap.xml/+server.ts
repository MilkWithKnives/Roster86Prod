import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const baseUrl = 'https://roster86.com';
	
	const staticPages = [
		'',
		'/pricing',
		'/features',
		'/about',
		'/contact',
		'/auth/login',
		'/auth/signup',
		'/privacy',
		'/terms'
	];

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${staticPages
		.map(
			(page) => `
	<url>
		<loc>${baseUrl}${page}</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>${page === '' ? 'daily' : page === '/pricing' ? 'weekly' : 'monthly'}</changefreq>
		<priority>${page === '' ? '1.0' : page === '/pricing' ? '0.9' : '0.8'}</priority>
	</url>`
		)
		.join('')}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};

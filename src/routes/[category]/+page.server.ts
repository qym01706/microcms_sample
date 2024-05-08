import { fetchAllContentIds, fetchArticles, fetchCategory } from '$lib/functions/microcms';
import { PUBLIC_PER_PAGE } from '$env/static/public';
import { error } from '@sveltejs/kit';

export async function entries() {
	const ids = await fetchAllContentIds('category');
	return ids.map((id) => ({ category: id }));
}

export async function load({ params }) {
	const categoryId = params.category;
	const limit = isNaN(Number(PUBLIC_PER_PAGE)) ? 10 : Number(PUBLIC_PER_PAGE);
	const filters = `category[equals]${categoryId}`;
	const [category, articleIds, { contents }] = await Promise.all([
		fetchCategory(categoryId),
		fetchAllContentIds('article', filters),
		fetchArticles({ limit, orders: '-published', filters })
	]);
	if (!category) throw error(404, { message: 'Not found' });

	return { category, totalCount: articleIds.length || 0, articles: contents };
}

import { type Metadata } from 'next';
import { PAGE } from '@/config/public-page.config';

export const metadata: Metadata = {
	title: 'Trending',
	description: 'Trending desc',
	alternates: {
		canonical: PAGE.TRENDING,
	},
	openGraph: {
		type: 'website',
		url: PAGE.TRENDING,
		title: 'Trending',
	},
};

export default function TrendingPage() {
	return <div>Trending</div>;
}

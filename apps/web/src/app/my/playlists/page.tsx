import type { Metadata } from 'next';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { PPage } from './PPage';

export const metadata: Metadata = {
	title: 'Playlists',
	...NO_INDEX_PAGE,
};

export default function Page() {
	return <PPage />;
}

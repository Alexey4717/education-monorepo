import type { Metadata } from 'next';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import { SearchPage } from './SearchPage';

export const metadata: Metadata = {
    title: 'Search',
    ...NO_INDEX_PAGE,
};

export default function SPage() {
    return <SearchPage />;
}

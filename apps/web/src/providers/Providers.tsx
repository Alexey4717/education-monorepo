'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

/**
 * Компонент со всеми провайдерами
 * @param children
 * @constructor
 */
export function Providers({ children }: { children: ReactNode }) {
	// Чтобы точно инициализировать на клиенте, т.к. useState работает только там
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}

import { type Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { type ReactNode } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Providers } from '@/providers/Providers';
import './globals.scss';

const geistRoboto = Roboto({
	variable: '--font-roboto-sans',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'MediaHub',
	description: 'Imitation of blog-platform',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistRoboto.variable} antialiased`}>
				<Providers>
					<Layout>{children}</Layout>
				</Providers>
			</body>
		</html>
	);
}

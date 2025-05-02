import { type ReactNode } from 'react';
import { type Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Layout } from '@/components/layout/Layout';
import './globals.scss';

const geistRoboto = Roboto({
    variable: '--font-roboto-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Education project',
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
        <Layout>
            {children}
        </Layout>
        </body>
        </html>
    );
}

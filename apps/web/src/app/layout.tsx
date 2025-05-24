import { type Metadata, type Viewport } from 'next';
import { Roboto } from 'next/font/google';
import { type ReactNode } from 'react';
import { Providers } from '@/providers/Providers';
import { COLORS } from '@/constants/colors.constants';
import { SITE_NAME, SITE_URL } from '@/constants/constants';
import './globals.scss';

const geistRoboto = Roboto({
    variable: '--font-roboto-sans',
    subsets: ['latin'],
});

export const fetchCache = 'default-cache';

export const metadata: Metadata = {
    icons: {
        icon: '/images/logo.svg',
        shortcut: '/images/logo.svg',
        apple: '/images/256.png',
        other: {
            rel: 'touch-icons',
            url: '/images/256.png',
            sizes: '256x256',
            type: 'image/png',
        },
    },
    title: {
        absolute: `${SITE_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: 'Best app for video watching',
    openGraph: {
        type: 'website',
        siteName: 'localhost',
        emails: [`info@redvideo.com`],
        images: [
            {
                url: '/images/og.jpg',
                width: 909,
                height: 500,
                alt: `${SITE_NAME}`,
            },
        ],
    },
    metadataBase: new URL(SITE_URL),
    applicationName: `${SITE_NAME}`,
    authors: {
        name: 'Max Shushval [RED Group]',
        url: 'https://htmllessons.io',
    },
    manifest: '/manifest.json',
    publisher: 'Max Shushval [RED Group]',
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    themeColor: COLORS.bg,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={geistRoboto.className}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}

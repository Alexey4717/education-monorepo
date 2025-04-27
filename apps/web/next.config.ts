import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:3001/api/:path*', // TODO брать порт из переменных окружения
            },
        ];
    },
};

export default nextConfig;

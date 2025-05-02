import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true, // Может конфликтовать со старыми библиотеками
    poweredByHeader: false, // чтоб человек не смог обнаружить, на каком фреймворке написано приложение
    async rewrites() {
        const source = '/api/:path*';
        return [
            {
                source, // перезапись урла, чтоб запрос из /api и нужного порта
                destination: `${process.env.SERVER_URL}${source}`, // На проде будет другой домен
            },
        ];
    },
};

export default nextConfig;

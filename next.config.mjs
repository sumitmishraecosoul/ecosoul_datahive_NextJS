/** @type {import('next').NextConfig} */
import DEV_URL from './src/config/config.js';

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${DEV_URL}/:path*`,
            },
        ];
    },
};

export default nextConfig;

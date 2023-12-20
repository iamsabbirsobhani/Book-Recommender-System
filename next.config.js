/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'images.amazon.com',
                port: '',
            },
        ],
    },
}

module.exports = nextConfig

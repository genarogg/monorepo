/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4000/:path*',
      },
      {
        source: '/graphql/:path*',
        destination: 'http://localhost:4000/graphql',
      },
      {
        source: '/docs/:path*',
        destination: 'http://localhost:4500/docs/:path*',
      },
      {
        source: '/_astro/:path*',
        destination: 'http://localhost:4500/_astro/:path*',
      }

    ];
  },
}

export default nextConfig
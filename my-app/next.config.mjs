/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'images.unsplash.com', 'avatars.githubusercontent.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Disable static generation during build to avoid database connection issues
  experimental: {
    // Disable static generation for now since we need database access
  },
  // We'll use dynamic rendering for all pages to avoid build-time database access
  typescript: {
    // Don't fail build if TypeScript has errors (optional)
    ignoreBuildErrors: false,
  },
  eslint: {
    // Don't fail build if ESLint has errors (optional)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;

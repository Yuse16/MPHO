/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: new URL('../..', import.meta.url).pathname,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

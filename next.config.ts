import type { NextConfig } from "next"

const makePublicPreviewOrigin = (() => {
  const publicURL = process.env.FIGMA_PUBLIC_URL
  if (!publicURL) return undefined

  try {
    // Next.js expects host[:port] entries rather than full URL origins.
    return new URL(publicURL).host
  } catch {
    return undefined
  }
})()

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./figma-image-loader.ts",
  },
  // Don't block publishing or preview deploys on errors if the emitted JS is valid
  typescript: {
    ignoreBuildErrors: true,
  },
  // `next dev` serves the Make preview at a per-sandbox cross-origin host. Next
  // blocks its dev resources (`/_next/*`, HMR WebSocket, internal endpoints)
  // unless the origin is listed here, and a blocked HMR socket stalls Turbopack.
  // Dev-only - ignored by `next build`.
  allowedDevOrigins: makePublicPreviewOrigin ? [makePublicPreviewOrigin] : [],
  // Prerender source maps add ~100 MB per static build worker
  enablePrerenderSourceMaps: false,
  experimental: {
    // Caps static build workers (~250-380 MB each) to lower `next build` peak memory
    cpus: 2,
  },
  env: {
    NEXT_PUBLIC_SITE_URL:
      process.env.FIGMA_PUBLIC_URL || "http://localhost:3000",
  },
}

export default nextConfig

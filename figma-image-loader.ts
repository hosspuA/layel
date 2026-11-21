type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}

const PAYLOAD_FILE_PATH_PATTERN = /^\/(?!\/)(?:.+\/)?api\/[^/]+\/file\/.+$/

/**
 * Pass-through image loader for local/public assets. Adds sizing params only
 * for Payload media file URLs when those are present.
 */
export default function imageLoader({
  quality,
  src,
  width,
}: ImageLoaderProps): string {
  const [pathname, search = ""] = src.split("?")

  if (!PAYLOAD_FILE_PATH_PATTERN.test(pathname)) {
    return src
  }

  const searchParams = new URLSearchParams(search)
  searchParams.set("w", String(width))
  if (quality !== undefined) {
    searchParams.set("q", String(quality))
  }

  return `${pathname}?${searchParams}`
}

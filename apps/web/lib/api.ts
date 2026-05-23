// Central API path utility
// Uses relative paths so Next.js rewrites proxy to the Render backend
// This avoids CORS issues and keeps the API URL in one place (next.config.ts)
export const API_URL = ""

export function apiPath(path: string) {
  return path.startsWith("/") ? path : `/${path}`
}

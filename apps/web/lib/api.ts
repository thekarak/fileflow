// Central API path utility
// Uses relative paths so Next.js rewrites proxy to the Render backend
// This avoids CORS issues and keeps the API URL in one place (next.config.ts)
export const API_URL = ""

export function apiPath(path: string) {
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem("fileflow_custom_api_url")
    if (customUrl) {
      const cleanUrl = customUrl.endsWith("/") ? customUrl.slice(0, -1) : customUrl
      const cleanPath = path.startsWith("/") ? path : `/${path}`
      return `${cleanUrl}${cleanPath}`
    }
  }
  return path.startsWith("/") ? path : `/${path}`
}

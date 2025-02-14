export async function getTokenFromCookies(req: Request): Promise<string | null> {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/google_access_token=([^;]+)/)
  return match ? decodeURIComponent(match[1] as string) : null
}

export function getQueryParam(req: Request, key: string): string | null {
  const url = new URL(req.url)
  return url.searchParams.get(key)
}

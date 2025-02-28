export function getQueryParam(req: Request, key: string): string | null {
  const url = new URL(req.url)
  return url.searchParams.get(key)
}

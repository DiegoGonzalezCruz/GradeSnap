// app/lib/getUserAccessToken.ts
import { getServerSideURL } from '@/utilities/getURL'
import { NextRequest } from 'next/server'

// This helper assumes that your refresh endpoint is hosted on the same domain.
// It calls the refresh endpoint, which in turn sets updated cookies.
export async function getUserAccessToken(req: NextRequest): Promise<string | null> {
  let token = req.cookies.get('google_access_token')?.value
  const expiration = req.cookies.get('google_access_token_expiration')?.value

  if (!token || !expiration) {
    return null
  }

  // Check if token is expired.
  const expirationTime = parseInt(expiration, 10)
  const now = Date.now()
  if (expirationTime > now) {
    // Token is still valid.
    return token
  }

  // Token expired: call your refresh endpoint.
  // Note: We assume that process.env.NEXT_PUBLIC_BASE_URL points to your backend domain.
  const refreshResponse = await fetch(`${getServerSideURL()}/api/auth/google/refresh`, {
    method: 'GET',
    // Pass along the cookies so that the refresh endpoint can identify the user.
    headers: { cookie: req.headers.get('cookie') || '' },
  })

  if (!refreshResponse.ok) {
    // Refresh failed – you could also handle this more gracefully.
    return null
  }

  // The refresh endpoint should set new cookies for the token and its expiration.
  // Since this is a server-side call, you may need to extract the new token from the response headers.
  // Here, we try to extract it from the Set-Cookie header.
  const setCookieHeader = refreshResponse.headers.get('set-cookie') || ''
  const match = setCookieHeader.match(/google_access_token=([^;]+)/)
  if (match && match[1]) {
    token = match[1]
    return token
  }

  // Fallback: if you cannot extract the token, return null.
  return null
}

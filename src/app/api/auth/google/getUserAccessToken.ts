import { getServerSideURL } from '@/utilities/getURL'
import { NextRequest } from 'next/server'

// This helper assumes that your refresh endpoint is hosted on the same domain.
export async function getUserAccessToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('google_access_token')?.value as string
  console.log(token, 'Access Token') // TODO: Fix this
  const expiration = req.cookies.get('google_access_token_expiration')?.value as string
  console.log(expiration, 'Expiration Time') // TODO: Fix this

  // If token or expiration is missing, consider it unauthenticated.
  // if (!token || !expiration) {
  //   return null
  // }

  const expirationTime = parseInt(expiration, 10)
  const now = Date.now()
  if (expirationTime > now) {
    // Token is still valid.
    return token
  }

  // Token expired: call your refresh endpoint.
  const refreshResponse = await fetch(`${getServerSideURL()}/api/auth/google/refresh`, {
    method: 'GET',
    headers: { cookie: req.headers.get('cookie') || '' },
  })

  if (!refreshResponse.ok) {
    console.error('Error refreshing access token')
    return null
  }

  // Extract the new token from the Set-Cookie header.
  const setCookieHeader = refreshResponse.headers.get('set-cookie') || ''
  const match = setCookieHeader.match(/google_access_token=([^;]+)/)
  if (match && match[1]) {
    return match[1]
  }

  return null
}

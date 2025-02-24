import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getCookie } from 'cookies-next'

export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('google_access_token')?.value

  if (!accessToken) {
    return NextResponse.next()
  }

  // Check if the token is expired or about to expire (5 minutes buffer)
  const expirationTime = req.cookies.get('google_access_token_expiration')?.value
  if (expirationTime && Date.now() + 5 * 60 * 1000 > Number(expirationTime)) {
    try {
      const response = await fetch('/api/auth/google/refresh')
      if (response.ok) {
        console.log('Google access token refreshed successfully')
        // After refreshing, redirect to the same URL to get the updated cookie
        return NextResponse.redirect(req.url)
      } else {
        console.error('Failed to refresh Google access token')
      }
    } catch (error) {
      console.error('Error refreshing Google access token:', error)
    }
  }

  return NextResponse.next()
}

// Apply this middleware to all API routes under the /api/classroom path
export const config = {
  matcher: '/api/classroom/:path*',
}

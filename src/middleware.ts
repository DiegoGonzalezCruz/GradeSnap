import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Adjust the endpoint if your Payload collection slug differs from "users"
  const meEndpoint = `${req.nextUrl.origin}/api/users/me`

  try {
    const response = await fetch(meEndpoint, {
      method: 'GET',
      headers: { cookie: req.headers.get('cookie') || '' },
    })

    if (!response.ok) {
      console.error(`Error from Payload me endpoint: ${response.status}`)
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const data = await response.json()

    // Redirect to /login if the user is not authenticated
    if (!data.user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Error checking authentication with Payload:', error)
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

// Apply this middleware to all routes under /dashboard
export const config = {
  matcher: '/dashboard/:path*',
}

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getUserAccessToken } from './app/api/auth/google/getUserAccessToken'

export async function middleware(req: NextRequest) {
  const accessToken = await getUserAccessToken(req)
  console.log(req, 'req')
  // console.log('MIDDLEWARE Access Token:', accessToken, 'MIDDLEWARE ')

  if (!accessToken) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// Apply this middleware to all API routes under the /api/classroom path
export const config = {
  matcher: '/dashboard/:path*',
}

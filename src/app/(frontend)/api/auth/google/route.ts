import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { serialize } from 'cookie'

export const GET = async (request: Request) => {
  const url = new URL(request.url)
  const redirectParam = url.searchParams.get('redirect') || '/'

  const host = request.headers.get('host')
  if (!host) {
    return NextResponse.json({ error: 'Host header missing' }, { status: 400 })
  }

  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const baseURL = `${protocol}://${host}`
  const redirectURI = `${baseURL}/api/auth/google/callback`

  // Generate a random state parameter for CSRF protection
  const state = crypto.randomBytes(16).toString('hex')

  // Set state & redirect in an HTTP-only cookie
  const stateCookie = serialize('oauth_state', state, {
    httpOnly: true,
    secure: protocol === 'https',
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  })

  const redirectCookie = serialize('oauth_redirect', redirectParam, {
    httpOnly: true,
    secure: protocol === 'https',
    maxAge: 600,
    path: '/',
    sameSite: 'lax',
  })

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectURI,
    response_type: 'code',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/classroom.coursework.me',
      'https://www.googleapis.com/auth/classroom.coursework.students',
      'https://www.googleapis.com/auth/classroom.announcements',
      'https://www.googleapis.com/auth/drive.readonly', // include if file content access is required
    ].join(' '),
    state,
    access_type: 'offline',
    prompt: 'consent',
  })

  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`

  const response = NextResponse.redirect(googleAuthURL)
  response.headers.append('Set-Cookie', stateCookie)
  response.headers.append('Set-Cookie', redirectCookie)

  // Add CORS headers
  response.headers.append('Access-Control-Allow-Origin', '*')
  response.headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type')

  return response
}

// Handle preflight requests
export const OPTIONS = () => {
  const response = new NextResponse(null, { status: 204 })
  response.headers.append('Access-Control-Allow-Origin', '*')
  response.headers.append('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.append('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

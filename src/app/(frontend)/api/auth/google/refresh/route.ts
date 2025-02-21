import { NextResponse } from 'next/server'
import axios from 'axios'
import { serialize } from 'cookie'
import { getPayload } from 'payload'
import config from '@payload-config'

interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export const GET = async (request: Request) => {
  try {
    const payload = await getPayload({ config })

    // Get the user's ID from the payload-token cookie
    const cookieHeader = request.headers.get('cookie') || ''
    const cookies = cookieHeader
      .split('; ')
      .reduce((acc: Record<string, string>, cookie: string) => {
        const parts = cookie.split('=')
        if (parts.length === 2) {
          const [key, value] = parts.map((part) => part.trim())
          if (key && value) {
            acc[key] = value
          }
        }
        return acc
      }, {})

    const payloadToken = cookies['payload-token']

    if (!payloadToken) {
      return NextResponse.json({ error: 'No payload-token cookie provided' }, { status: 401 })
    }

    // Verify the JWT token
    const decoded = jwt.verify(payloadToken, process.env.PAYLOAD_SECRET) as { id: string }
    const userId = decoded.id

    // Get the user from Payload
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const refreshToken = user.googleRefreshToken

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found for user' }, { status: 400 })
    }

    const protocol = request.headers.get('host')?.startsWith('localhost') ? 'http' : 'https'
    const baseUrl = `${protocol}://${request.headers.get('host')}`

    // 1. Exchange refresh token for tokens
    const tokenResponse = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )

    const { access_token, expires_in } = tokenResponse.data

    // 2. Set the new google_access_token cookie
    const googleTokenCookie = serialize('google_access_token', access_token, {
      httpOnly: true,
      secure: protocol === 'https',
      maxAge: expires_in,
      path: '/',
      sameSite: 'lax',
    })

    const response = NextResponse.json({ message: 'Token refreshed successfully' })
    response.headers.append('Set-Cookie', googleTokenCookie)

    return response
  } catch (error: any) {
    console.error('Token Refresh Error:', error)
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 })
  }
}
import jwt from 'jsonwebtoken'

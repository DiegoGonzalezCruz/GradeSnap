// app/api/auth/google/refresh/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
import { getPayload } from 'payload'
import config from '@payload-config'

export const GET = async (request: Request) => {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [key, ...v] = cookie.split('=')
      return [key, decodeURIComponent(v.join('='))]
    }),
  )

  const token = cookies['payload-token']
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let userId: string
  try {
    const decoded = jwt.verify(token, process.env.PAYLOAD_SECRET) as { id: string }
    userId = decoded.id
  } catch (e) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  // Retrieve the user from Payload.
  const payload = await getPayload({ config })
  const users = await payload.find({
    collection: 'users',
    where: { id: { equals: userId } },
    limit: 1,
  })
  if (users.docs.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  const userDoc = users.docs[0]

  // Check if the user has a stored refresh token.
  const googleRefreshToken = userDoc.googleRefreshToken
  if (!googleRefreshToken) {
    return NextResponse.json({ error: 'No refresh token available' }, { status: 400 })
  }

  try {
    // Request a new access token from Google.
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: googleRefreshToken,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
    const { access_token, expires_in, refresh_token: newRefreshToken } = response.data

    // Optionally update the stored refresh token if Google returns a new one.
    if (newRefreshToken) {
      await payload.update({
        collection: 'users',
        id: userId,
        data: { googleRefreshToken: newRefreshToken },
        showHiddenFields: true,
      })
    }

    // Set the new access token in the cookie.
    const googleTokenCookie = serialize('google_access_token', access_token, {
      httpOnly: true,
      secure: process.env.PAYLOAD_ENV !== 'development',
      maxAge: expires_in,
      path: '/',
      sameSite: 'lax',
    })

    const res = NextResponse.json({ success: true, access_token })
    res.headers.append('Set-Cookie', googleTokenCookie)
    return res
  } catch (error) {
    console.error('Error refreshing Google access token:', error)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
}

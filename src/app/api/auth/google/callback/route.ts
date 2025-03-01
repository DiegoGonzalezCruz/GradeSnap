import { NextResponse } from 'next/server'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { getPayload } from 'payload'
import config from '@payload-config'

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  refresh_token?: string
  scope: string
  token_type: string
}

interface GoogleUserInfo {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
  locale: string
}

const handler = async (request: Request) => {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')

  // Use NextResponse's cookie handling if available,
  // but here we manually parse the incoming cookie header.
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split('; ').reduce((acc: Record<string, string>, cookie: string) => {
    const [key, value] = cookie.split('=').map((part) => part.trim())
    if (key && value) {
      acc[key] = value
    }
    return acc
  }, {})

  const storedState = cookies['oauth_state'] || null
  const redirectURL = cookies['oauth_redirect'] || '/'

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
  }

  const host = request.headers.get('host')
  const protocol = host?.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )
    const { access_token, expires_in, refresh_token } = tokenResponse.data
    console.log(expires_in, 'expires_in')
    console.log(access_token, 'access_token')
    console.log(refresh_token, 'refresh_token')

    // 2. Retrieve user info
    const userInfoResponse = await axios.get<GoogleUserInfo>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } },
    )
    const userInfo = userInfoResponse.data

    // 3. Find or create the user in Payload.
    const user = await findOrCreateUser(userInfo, refresh_token)

    // 4. Shape and sign the JWT token for Payload authentication.
    const tokenPayload = {
      id: user?.id, // critical: use the Payload user id
      email: user?.email,
      collection: 'users',
    }
    const token = jwt.sign(tokenPayload, process.env.PAYLOAD_SECRET, {
      expiresIn: '7d',
    })

    // Prepare cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: protocol === 'https',
      path: '/',
      sameSite: 'lax' as const,
    }

    // 5. Create a NextResponse and set cookies using the cookie API.
    const response = NextResponse.redirect(
      // Decode and adjust the redirect URL.
      redirectURL.startsWith('http')
        ? decodeURIComponent(redirectURL)
        : `${baseUrl}${decodeURIComponent(redirectURL)}`,
    )

    response.cookies.set('payload-token', token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    response.cookies.set('google_access_token', access_token, {
      ...cookieOptions,
      maxAge: expires_in,
    })
    const expirationDate = new Date(Date.now() + expires_in * 1000)
    response.cookies.set('google_access_token_expiration', expirationDate.getTime().toString(), {
      ...cookieOptions,
      maxAge: expires_in,
    })

    // Clear state and redirect cookies.
    response.cookies.set('oauth_state', '', {
      ...cookieOptions,
      expires: new Date(0),
    })
    response.cookies.set('oauth_redirect', '', {
      ...cookieOptions,
      expires: new Date(0),
    })

    return response
  } catch (error) {
    console.error('OAuth Callback Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

const findOrCreateUser = async (userInfo: GoogleUserInfo, refreshToken?: string) => {
  const payload = await getPayload({ config })

  // 1. Try to find an existing user by googleSub.
  const existingBySub = await payload.find({
    collection: 'users',
    where: { googleSub: { equals: userInfo.sub } },
    limit: 1,
  })
  if (existingBySub.docs.length > 0) {
    const userDoc = existingBySub.docs[0]
    if (refreshToken) {
      return await payload.update({
        collection: 'users',
        id: userDoc?.id ?? '',
        data: { googleRefreshToken: refreshToken, pictureURL: userInfo.picture },
        showHiddenFields: true,
      })
    }
    return userDoc
  }

  // 2. Try to find an existing user by email.
  const existingByEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: userInfo.email } },
    limit: 1,
  })
  if (existingByEmail.docs.length > 0) {
    const userToUpdate = existingByEmail.docs[0]!
    return await payload.update({
      collection: 'users',
      id: userToUpdate.id,
      data: {
        googleSub: userInfo.sub,
        googleRefreshToken: refreshToken,
        pictureURL: userInfo.picture,
      },
      showHiddenFields: true,
    })
  }

  // 3. Otherwise, create a new user.
  const randomPassword = crypto.randomBytes(20).toString('hex')
  return await payload.create({
    collection: 'users',
    data: {
      email: userInfo.email,
      googleSub: userInfo.sub,
      googleRefreshToken: refreshToken,
      name: userInfo.name,
      pictureURL: userInfo.picture,
      password: randomPassword,
      role: 'client',
      status: 'active',
    },
    showHiddenFields: true,
  })
}

export const GET = handler

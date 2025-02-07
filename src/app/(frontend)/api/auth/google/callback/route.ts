// app/api/auth/google/callback/route.ts

import { NextResponse } from 'next/server'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { serialize } from 'cookie'
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

  // get stored state
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split('; ').reduce((acc: Record<string, string>, cookie: string) => {
    const [key, value] = cookie.split('=')
    acc[key] = value
    return acc
  }, {})

  const storedState = cookies['oauth_state'] || null
  const redirectURL = cookies['oauth_redirect'] || '/' // Default to home if no redirect is stored

  if (!state || !storedState || state !== storedState) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
  }

  const protocol = request.headers.get('host')?.startsWith('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${request.headers.get('host')}`

  try {
    // 1. exchange code for tokens
    const tokenResponse = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    )

    const { access_token } = tokenResponse.data

    // 2. retrieve user info
    const userInfoResponse = await axios.get<GoogleUserInfo>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } },
    )
    const userInfo = userInfoResponse.data

    // 3. find or create user in Payload
    const user = await findOrCreateUser(userInfo)

    // 4. shape the token payload so that Payload's admin recognizes it
    // IMPORTANT: 'id' needs to be the actual Payload user id, not the Google sub
    // 'collection' must match the slug of the auth collection
    const tokenPayload = {
      id: user.id, // <-- CRITICAL: user.id or user._id from your newly created doc
      email: user.email,
      collection: 'users',
    }

    // 5. sign the JWT with your same PAYLOAD_SECRET that Payload uses
    const token = jwt.sign(tokenPayload, process.env.PAYLOAD_SECRET, {
      expiresIn: '1h',
    })

    // 6. set the cookie. By default, the admin UI looks for 'payload-token'
    const jwtCookie = serialize('payload-token', token, {
      httpOnly: true,
      secure: protocol === 'https',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    })
    console.log(jwtCookie, 'JWT COOKIE')

    // 7. clear the oauth_state cookie
    const clearStateCookie = serialize('oauth_state', '', {
      httpOnly: true,
      secure: protocol === 'https',
      expires: new Date(0),
      // path: '/api/auth/google/callback',
      path: '/',
      sameSite: 'lax',
    })

    const clearRedirectCookie = serialize('oauth_redirect', '', {
      httpOnly: true,
      secure: protocol === 'https',
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
    })

    // 8. Redirect user to stored URL

    // Decode the redirect URL to remove double encoding
    const decodedRedirectURL = decodeURIComponent(redirectURL)

    // Ensure it is an absolute URL
    const finalRedirectURL = decodedRedirectURL.startsWith('http')
      ? decodedRedirectURL
      : `${baseUrl}${decodedRedirectURL}`

    const response = NextResponse.redirect(finalRedirectURL)

    response.headers.append('Set-Cookie', jwtCookie)
    response.headers.append('Set-Cookie', clearStateCookie)
    response.headers.append('Set-Cookie', clearRedirectCookie)

    return response
  } catch (error) {
    console.error('OAuth Callback Error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

const findOrCreateUser = async (userInfo: GoogleUserInfo) => {
  const payload = await getPayload({ config })

  // 1. If there's already a user with the given googleSub, return it
  const existingBySub = await payload.find({
    collection: 'users',
    where: { googleSub: { equals: userInfo.sub } },
    limit: 1,
  })
  if (existingBySub.docs.length > 0) {
    return existingBySub.docs[0]
  }

  // 2. If not found by googleSub, see if there's a user with the same email
  const existingByEmail = await payload.find({
    collection: 'users',
    where: { email: { equals: userInfo.email } },
    limit: 1,
  })
  if (existingByEmail.docs.length > 0) {
    // 2a. If so, update that existing doc to connect the googleSub
    const userToUpdate = existingByEmail.docs[0]
    return await payload.update({
      collection: 'users',
      id: userToUpdate.id,
      data: {
        googleSub: userInfo.sub,
        // Optionally update name, pictureURL, etc.
        // name: userInfo.name,
        pictureURL: userInfo.picture,
      },
      showHiddenFields: true,
    })
  }

  // 3. Otherwise, no user with that googleSub or email => create new
  const randomPassword = crypto.randomBytes(20).toString('hex')
  return await payload.create({
    collection: 'users',
    data: {
      email: userInfo.email,
      googleSub: userInfo.sub,
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

import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId query parameter.' }, { status: 400 })
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const userResponse = await classroom.userProfiles.get({
      userId,
    })
    return NextResponse.json(userResponse.data, { status: 200 })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Failed to fetch user details.' }, { status: 500 })
  }
}

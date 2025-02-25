// app/api/classroom/coursework/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'

// Dummy helper to retrieve the stored access token (modify this to fit your auth flow)
async function getUserAccessToken(req: NextRequest): Promise<string | null> {
  // For instance, if you stored it in cookies:
  const token = req.cookies.get('google_access_token')?.value
  return token || null
}

export async function GET(req: NextRequest) {
  // This endpoint lists course work for a given course.
  // Expect query params: courseId
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  if (!courseId) {
    return NextResponse.json({ error: 'Missing courseId query parameter.' }, { status: 400 })
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const courseWorkResponse = await classroom.courses.courseWork.list({
      courseId: courseId,
    })
    // The response includes an array of course work.
    return NextResponse.json(courseWorkResponse.data, { status: 200 })
  } catch (error) {
    console.error('Error fetching course work:', error)
    return NextResponse.json({ error: 'Failed to fetch course work.' }, { status: 500 })
  }
}

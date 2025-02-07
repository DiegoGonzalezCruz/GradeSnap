// app/api/classroom/announcement/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Dummy helper to retrieve the stored access token (modify this to fit your auth flow)
async function getUserAccessToken(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('google_access_token')?.value
  return token || null
}

export async function POST(req: NextRequest) {
  // This endpoint sends an announcement.
  // Expects a JSON body with: courseId, text, (optionally materials)
  let body
  try {
    body = await req.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }
  const { courseId, text, materials } = body
  if (!courseId || !text) {
    return NextResponse.json(
      { error: 'Missing required fields: courseId or text.' },
      { status: 400 },
    )
  }

  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }
  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  const classroom = google.classroom({ version: 'v1', auth })

  try {
    // Create an announcement in the course.
    // The "materials" field is optional and can include links, drive files, etc.
    const announcementResponse = await classroom.courses.announcements.create({
      courseId: courseId,
      requestBody: {
        text,
        materials: materials || [],
        state: 'PUBLISHED', // Publish immediately.
      },
    })
    return NextResponse.json(announcementResponse.data, { status: 200 })
  } catch (error) {
    console.error('Error creating announcement:', error)
    return NextResponse.json({ error: 'Failed to create announcement.' }, { status: 500 })
  }
}

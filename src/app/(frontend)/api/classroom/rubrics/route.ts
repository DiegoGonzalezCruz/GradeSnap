// app/api/classroom/rubrics/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'

interface Rubric {
  id?: string
  criteria?: any[] // Customize as needed
  creationTime?: string
  updateTime?: string
  // add additional fields if necessary
}

/**
 * Helper to retrieve the access token from cookies.
 * Adjust this implementation to match how you store the token.
 */
async function getTokenFromCookies(req: NextRequest): Promise<string | null> {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/google_access_token=([^;]+)/)
  return match ? decodeURIComponent(match[1] as string) : null
}

/**
 * Helper to retrieve a query parameter from the request URL.
 */
function getQueryParam(req: NextRequest, key: string): string | null {
  const url = new URL(req.url)
  return url.searchParams.get(key)
}

export async function GET(req: NextRequest) {
  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const courseId = getQueryParam(req, 'courseId')
  const courseWorkId = getQueryParam(req, 'courseWorkId')
  const rubricId = getQueryParam(req, 'rubricId') // optional

  console.log(courseId, courseWorkId, rubricId, '******** QUERY PARAMS **********')

  if (!courseId || !courseWorkId) {
    return NextResponse.json(
      { error: 'Missing required query parameters: courseId and courseWorkId' },
      { status: 400 },
    )
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token as string })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    if (rubricId) {
      // Use bracket notation to bypass missing type info.
      const rubricResponse = await (classroom.courses.courseWork as any).rubrics.get({
        courseId,
        courseWorkId,
        id: rubricId,
      })
      return NextResponse.json(rubricResponse.data)
    } else {
      try {
        const listResponse = await (classroom.courses.courseWork as any).rubrics.list({
          courseId,
          courseWorkId,
          // Optionally, specify fields if you want to limit response size.
        })
        return NextResponse.json(listResponse.data)
      } catch (error: any) {
        console.error('Error fetching rubrics:', error)
        // If no rubrics are found, return an empty array
        return NextResponse.json({ rubrics: [] })
      }
    }
  } catch (error: any) {
    console.error('Error fetching rubrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rubrics', details: error.message },
      { status: 500 },
    )
  }
}

/**
 * POST endpoint to create a new rubric.
 * Required query parameters:
 *   - courseId
 *   - courseWorkId
 * Request body: a JSON object matching the Rubric interface.
 */
export async function POST(req: NextRequest) {
  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = new URL(req.url)
  const courseId = url.searchParams.get('courseId')
  const courseWorkId = url.searchParams.get('courseWorkId')

  if (!courseId || !courseWorkId) {
    return NextResponse.json(
      { error: 'Missing required query parameters: courseId and courseWorkId' },
      { status: 400 },
    )
  }

  let rubricData: Rubric
  try {
    rubricData = await req.json()
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body', details: error.message },
      { status: 400 },
    )
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token as string })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const createResponse = await (classroom.courses.courseWork as any).rubrics.create({
      courseId,
      courseWorkId,
      requestBody: rubricData,
    })
    return NextResponse.json(createResponse.data)
  } catch (error: any) {
    console.error('Error creating rubric:', error)
    return NextResponse.json(
      { error: 'Failed to create rubric', details: error.message },
      { status: 500 },
    )
  }
}

/**
 * PATCH endpoint to update an existing rubric.
 * Required query parameters:
 *   - courseId
 *   - courseWorkId
 *   - rubricId
 *   - updateMask (comma-separated list of fields)
 * Request body: JSON object with the fields to update.
 */
export async function PATCH(req: NextRequest) {
  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const url = new URL(req.url)
  const courseId = url.searchParams.get('courseId')
  const courseWorkId = url.searchParams.get('courseWorkId')
  const rubricId = url.searchParams.get('rubricId')
  const updateMask = url.searchParams.get('updateMask')

  if (!courseId || !courseWorkId || !rubricId || !updateMask) {
    return NextResponse.json(
      {
        error:
          'Missing required query parameters: courseId, courseWorkId, rubricId, and updateMask',
      },
      { status: 400 },
    )
  }

  let rubricData: Rubric
  try {
    rubricData = await req.json()
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Invalid JSON in request body', details: error.message },
      { status: 400 },
    )
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token as string })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    const patchResponse = await (classroom.courses.courseWork as any).rubrics.patch({
      courseId,
      courseWorkId,
      id: rubricId,
      updateMask,
      requestBody: rubricData,
    })
    return NextResponse.json(patchResponse.data)
  } catch (error: any) {
    console.error('Error updating rubric:', error)
    return NextResponse.json(
      { error: 'Failed to update rubric', details: error.message },
      { status: 500 },
    )
  }
}

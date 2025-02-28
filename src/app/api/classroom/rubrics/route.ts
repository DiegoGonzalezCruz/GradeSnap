// app/api/classroom/rubrics/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'
// import { JWT } from 'google-auth-library'

// interface Rubric {
//   id?: string
//   criteria?: any[] // Customize as needed
//   creationTime?: string
//   updateTime?: string
//   // add additional fields if necessary
// }

/**
 * Helper to retrieve a query parameter from the request URL.
 */
function getQueryParam(req: NextRequest, key: string): string | null {
  const url = new URL(req.url)
  return url.searchParams.get(key)
}

async function fetchRubrics(courseId: string, courseWorkId: string, token: string) {
  const url = `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork/${courseWorkId}/rubrics`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      console.error('Error fetching rubrics:', response.status, response.statusText)
      return { rubrics: [] } // Return empty rubrics array
    }

    const data = await response.json()
    console.log('Rubrics Data:', data) // Inspect the data
    return data
  } catch (error: any) {
    console.error('Error fetching rubrics:', error)
    return { rubrics: [] } // Return empty rubrics array
  }
}

export async function GET(req: NextRequest) {
  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const courseId = getQueryParam(req, 'courseId')
  const courseWorkId = getQueryParam(req, 'courseWorkId')

  console.log(courseId, 'course ID from ENDPOINT ****')
  console.log(courseWorkId, ' courseId ID from ENDPOINT ****')

  if (!courseId || !courseWorkId) {
    return NextResponse.json(
      { error: 'Missing required query parameters: courseId and courseWorkId' },
      { status: 400 },
    )
  }

  try {
    const rubricsData = await fetchRubrics(courseId, courseWorkId, token)
    return NextResponse.json(rubricsData)
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
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get('courseId')
  const courseWorkId = searchParams.get('courseWorkId')

  if (!courseId || !courseWorkId) {
    return NextResponse.json(
      { error: 'Missing courseId or courseWorkId query parameters.' },
      { status: 400 },
    )
  }

  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized. No access token available.' }, { status: 401 })
  }

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })

  try {
    const rubricData = await req.json()

    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: token as string })
    const classroom = google.classroom({ version: 'v1', auth })

    // Check user capability before creating the rubric
    const checkCapabilityResponse = await fetch(
      `https://classroom.googleapis.com/v1/userProfiles/me:checkUserCapability?capability=CREATE_RUBRIC`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    console.log('Check capability response:', checkCapabilityResponse)
    if (!checkCapabilityResponse.ok) {
      console.error(
        'Error checking user capability:',
        checkCapabilityResponse.status,
        checkCapabilityResponse.statusText,
      )
      return NextResponse.json({ error: 'Failed to check user capability.' }, { status: 500 })
    }

    const checkCapabilityData = await checkCapabilityResponse.json()

    if (!checkCapabilityData.allowed) {
      return NextResponse.json(
        { error: 'User does not have permission to create rubrics.' },
        { status: 403 },
      )
    }

    const createResponse = await (classroom.courses.courseWork as any).rubrics.create({
      courseId: courseId,
      courseWorkId: courseWorkId,
      requestBody: rubricData,
    })
    return NextResponse.json(createResponse.data, { status: 201 })
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
  return NextResponse.json({ error: 'Method not implemented' }, { status: 501 })
}

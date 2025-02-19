// app/api/classroom/rubrics/route.ts
import { NextResponse, NextRequest } from 'next/server'
import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

interface Rubric {
  id?: string
  criteria?: any[] // Customize as needed
  creationTime?: string
  updateTime?: string
  // add additional fields if necessary
}

async function getTokenFromCookies(req: NextRequest): Promise<string | null> {
  const token = req.cookies.get('google_access_token')?.value
  return token || null
}

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
    return data
  } catch (error: any) {
    console.error('Error fetching rubrics:', error)
    return { rubrics: [] } // Return empty rubrics array
  }
}

export async function GET(req: NextRequest) {
  const token = await getTokenFromCookies(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const courseId = getQueryParam(req, 'courseId')
  const courseWorkId = getQueryParam(req, 'courseWorkId')

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
  return NextResponse.json({ error: 'Method not implemented' }, { status: 501 })
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

import { getQueryParam } from '@/utilities/classroom'
import { google } from 'googleapis'
import { NextRequest, NextResponse } from 'next/server'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

/**
 * GET endpoint to list courses or retrieve a specific course.
 * Query Parameters:
 *   - courseId (optional): If provided, fetch a single course; otherwise, list all courses.
 */
export async function GET(req: NextRequest) {
  const token = await getUserAccessToken(req)
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const courseId = getQueryParam(req, 'courseId')

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: token })
  const classroom = google.classroom({ version: 'v1', auth })

  try {
    if (courseId) {
      // Retrieve a single course
      const courseResponse = await classroom.courses.get({
        id: courseId,
        // Optionally, you can limit fields: e.g., 'id,name,section,description,alternateLink'
        // fields: 'id,name,section,description,alternateLink',
      })

      return NextResponse.json(courseResponse.data)
    } else {
      // List all courses
      const coursesResponse = await classroom.courses.list({
        pageSize: 100,
        // Limit the fields to reduce payload if desired.
        // fields: 'courses(id,name,section,description,alternateLink)',
      })
      // console.log(coursesResponse.data, '****** COURSE DATA **********')
      return NextResponse.json(coursesResponse.data)
    }
  } catch (error: any) {
    console.error('Error retrieving courses:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve courses', details: error.message },
      { status: 500 },
    )
  }
}

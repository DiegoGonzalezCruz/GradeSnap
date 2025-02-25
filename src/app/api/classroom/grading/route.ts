export const runtime = 'nodejs'

import { getTokenFromCookies } from '@/utilities/classroom'
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { OAuth2Client } from 'google-auth-library'

/**
 * Extracts the file ID from a typical Google URL.
 */
function extractFileId(url: string): string | null {
  const match = url.match(/\/d\/([^\/]+)/)
  return match?.[1] ?? null
}

/**
 * Detects the file type based on the URL.
 */
function detectFileType(url: string): 'gdoc' | 'pdf' | 'slides' {
  if (url.includes('docs.google.com/document')) return 'gdoc'
  if (url.includes('docs.google.com/presentation')) return 'slides'
  if (url.includes('drive.google.com/file')) return 'pdf' // Treat generic drive file URLs as PDFs.
  if (url.endsWith('.pdf')) return 'pdf'
  return 'gdoc'
}

/**
 * Returns an authenticated OAuth2 client.
 */
function getOAuthClient(token: string): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = 'postmessage' // or your actual redirect URI

  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)
  oauth2Client.setCredentials({ access_token: token })
  return oauth2Client
}

/**
 * Downloads the file from Drive.
 * If the file is not a PDF (gdoc or slides), export it as PDF.
 */
async function getPdfBuffer(
  fileId: string,
  token: string,
  fileType: 'gdoc' | 'pdf' | 'slides',
): Promise<Buffer> {
  const authClient = getOAuthClient(token)
  const drive = google.drive({ version: 'v3', auth: authClient })

  if (fileType === 'pdf') {
    // Directly download the PDF.
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' })
    return Buffer.from(res.data as ArrayBuffer)
  } else {
    // Export Google Docs or Slides as PDF.
    const res = await drive.files.export(
      { fileId, mimeType: 'application/pdf' },
      { responseType: 'arraybuffer' },
    )
    return Buffer.from(res.data as ArrayBuffer)
  }
}

// Define a JSON schema for the grading result.
const gradingSchema = {
  description: "Grading result for a student's submission",
  type: SchemaType.OBJECT,
  properties: {
    criteria: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          criterionId: {
            type: SchemaType.STRING,
            description: 'ID of the criterion',
            nullable: false,
          },
          criterionTitle: {
            type: SchemaType.STRING,
            description: 'Title of the criterion',
            nullable: false,
          },
          score: {
            type: SchemaType.NUMBER,
            description: 'Score assigned for this criterion',
            nullable: false,
          },
          justification: {
            type: SchemaType.STRING,
            description: 'Justification for the assigned score',
            nullable: false,
          },
        },
        required: ['criterionId', 'criterionTitle', 'score', 'justification'],
      },
    },
    overallFeedback: {
      type: SchemaType.STRING,
      description: 'Overall feedback for the submission',
      nullable: false,
    },
    overallGrade: {
      type: SchemaType.NUMBER,
      description: "Overall grade (sum of each criterion's score)",
      nullable: false,
    },
  },
  required: ['criteria', 'overallFeedback', 'overallGrade'],
}

export async function POST(req: NextRequest) {
  console.log('POST request received')
  try {
    const body = await req.json()
    console.log(body, 'BODY')
    const token = await getTokenFromCookies(req)
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. No access token available.' },
        { status: 401 },
      )
    }

    const { rubric, url } = body
    if (!rubric || !url) {
      return NextResponse.json({ error: 'Both rubric and URL are required.' }, { status: 400 })
    }

    const fileId = extractFileId(url)
    if (!fileId) {
      return NextResponse.json(
        { error: 'Invalid file URL. Unable to extract file ID.' },
        { status: 400 },
      )
    }

    const fileType = detectFileType(url)
    // Download the file (or export it as a PDF) from Google Drive.
    const pdfBuffer = await getPdfBuffer(fileId, token, fileType)
    // Convert PDF binary data to a base64-encoded string.
    const base64Pdf = pdfBuffer.toString('base64')

    // Set up Gemini API.
    const geminiAPIKey = process.env.GOOGLE_GEMINI_APIKEY
    if (!geminiAPIKey) {
      return NextResponse.json({ error: 'Gemini API key not set' }, { status: 500 })
    }
    const genAI = new GoogleGenerativeAI(geminiAPIKey)
    // Provide the JSON schema and force a JSON response.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0,
        topP: 1,
        responseMimeType: 'application/json',
        responseSchema: gradingSchema,
      },
    })

    // Build the request parts.
    const pdfPart = {
      inlineData: {
        data: base64Pdf,
        mimeType: 'application/pdf',
      },
    }

    const textPrompt = `
You are an expert grading assistant. Evaluate the student's submission using the provided rubric. For each rubric criterion, compare the submission to the rubric levels and determine the most appropriate level. Provide the following for each criterion:
- The criterion ID and title.
- The selected level's score.
- A brief justification for your decision.

After evaluating all criteria, provide overall feedback summarizing the submission’s strengths, weaknesses, and suggestions for improvement, and calculate the overall grade as the sum of the criterion scores.

=== Rubric ===
${JSON.stringify(rubric, null, 2)}

=== Student Submission ===
[PDF content from the document]
`

    // Call Gemini API with both the text prompt and the PDF content.
    const result = await model.generateContent([textPrompt, pdfPart])
    const gradeResult = result.response.text()

    return NextResponse.json({ grade: gradeResult })
  } catch (error) {
    console.error('Error processing the grading request:', error)
    return NextResponse.json(
      { error: 'Failed to process the file and generate a grade.' },
      { status: 500 },
    )
  }
}

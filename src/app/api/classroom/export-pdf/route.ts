// /api/classroom/export-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { getUserAccessToken } from '../../auth/google/getUserAccessToken'

function extractFileId(url: string): string | null {
  const match = url.match(/\/d\/([^\/]+)/)
  return match?.[1] ?? null
}

function detectFileType(url: string): 'gdoc' | 'pdf' | 'slides' {
  if (url.includes('docs.google.com/document')) return 'gdoc'
  if (url.includes('docs.google.com/presentation')) return 'slides'
  if (url.includes('drive.google.com/file')) return 'pdf'
  if (url.endsWith('.pdf')) return 'pdf'
  return 'gdoc'
}

function getOAuthClient(token: string): OAuth2Client {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
  const redirectUri = 'postmessage'
  const oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUri)
  oauth2Client.setCredentials({ access_token: token })
  return oauth2Client
}

async function getPdfBuffer(
  fileId: string,
  token: string,
  fileType: 'gdoc' | 'pdf' | 'slides',
): Promise<Buffer> {
  const authClient = getOAuthClient(token)
  const drive = google.drive({ version: 'v3', auth: authClient })

  if (fileType === 'pdf') {
    const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' })
    return Buffer.from(res.data as ArrayBuffer)
  } else {
    const res = await drive.files.export(
      { fileId, mimeType: 'application/pdf' },
      { responseType: 'arraybuffer' },
    )
    return Buffer.from(res.data as ArrayBuffer)
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    if (!url) {
      return NextResponse.json({ error: 'Missing file URL' }, { status: 400 })
    }

    const token = await getUserAccessToken(req)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fileId = extractFileId(url)
    if (!fileId) {
      return NextResponse.json(
        { error: 'Invalid file URL. Cannot extract file ID.' },
        { status: 400 },
      )
    }

    const fileType = detectFileType(url)
    const pdfBuffer = await getPdfBuffer(fileId, token, fileType)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    return NextResponse.json({ error: 'Failed to export PDF' }, { status: 500 })
  }
}

export const runtime = 'nodejs'

import { getTokenFromCookies } from '@/utilities/classroom'
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

import pdfParse from 'pdf-parse'
import { generateGrade } from '@/utilities/gemini'
// Import or implement your OCR/vision utility if needed
// import { runOCR } from '@/utilities/ocr'

function extractFileId(url: string): string | null {
  const match = url.match(/\/d\/([^\/]+)/)
  return match?.[1] ?? null
}

// Detect file type based on URL or file metadata.
// For simplicity, this example checks for known URL patterns or extensions.
function detectFileType(url: string): 'gdoc' | 'pdf' | 'slides' {
  if (url.includes('docs.google.com/document')) return 'gdoc'
  if (url.includes('docs.google.com/presentation')) return 'slides'
  if (url.endsWith('.pdf')) return 'pdf'
  // Fallback to plain text extraction
  return 'gdoc'
}

async function extractContentFromGoogleDoc(fileId: string, token: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: token })
  const res = await drive.files.export(
    { fileId, mimeType: 'text/plain' },
    { responseType: 'stream' },
  )
  const chunks: Uint8Array[] = []
  for await (const chunk of res.data) {
    chunks.push(chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

async function extractContentFromPDF(fileId: string, token: string): Promise<string> {
  const drive = google.drive({ version: 'v3', auth: token })
  // Download the PDF file
  const res = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' })
  const buffer = Buffer.from(res.data as ArrayBuffer)
  const data = await pdfParse(buffer) //TODO: THIS IS CREATING PROBLEMS AGAIN!!!
  let content = 'data.text'

  // Optional: Process images if needed (e.g., OCR)
  // const imagesData = await extractImagesFromPDF(buffer)
  // for (const image of imagesData) {
  //   const caption = await runOCR(image)
  //   content += `\n[Image Caption: ${caption}]`
  // }

  return content
}

async function extractContentFromGoogleSlides(fileId: string, token: string): Promise<string> {
  // Option 1: Use Google Slides API to extract text from each slide.
  const slides = google.slides({ version: 'v1', auth: token })
  const presentation = await slides.presentations.get({ presentationId: fileId })
  const slidesContent =
    presentation.data.slides
      ?.map((slide, index) => {
        const texts =
          slide.pageElements
            ?.map((pe) => {
              if (pe.shape && pe.shape.text) {
                // Concatenate all text elements
                return pe.shape.text.textElements?.map((te) => te.textRun?.content || '').join('')
              }
              return ''
            })
            .join(' ') || ''
        return `Slide ${index + 1}: ${texts.trim()}`
      })
      .join('\n\n') || ''
  return slidesContent
}

export async function POST(req: NextRequest) {
  console.log('POST REACHED ')
  try {
    //     const body = await req.json()
    //     console.log(body, 'BODY')
    //     const token = await getTokenFromCookies(req)
    //     if (!token) {
    //       return NextResponse.json(
    //         { error: 'Unauthorized. No access token available.' },
    //         { status: 401 },
    //       )
    //     }

    //     const { rubric, url } = body
    //     if (!rubric || !url) {
    //       return NextResponse.json({ error: 'Both rubric and URL are required.' }, { status: 400 })
    //     }

    //     const fileId = extractFileId(url)
    //     if (!fileId) {
    //       return NextResponse.json(
    //         { error: 'Invalid file URL. Unable to extract file ID.' },
    //         { status: 400 },
    //       )
    //     }

    //     const fileType = detectFileType(url)
    //     let fileContent = ''

    //     if (fileType === 'gdoc') {
    //       fileContent = await extractContentFromGoogleDoc(fileId, token)
    //     } else if (fileType === 'pdf') {
    //       fileContent = await extractContentFromPDF(fileId, token)
    //     } else if (fileType === 'slides') {
    //       fileContent = await extractContentFromGoogleSlides(fileId, token)
    //     } else {
    //       return NextResponse.json({ error: 'Unsupported file format.' }, { status: 400 })
    //     }

    //     // Build the grading prompt.
    //     const prompt = `
    // You are an expert grading assistant. Your task is to evaluate a student's submission against the provided rubric. Use the content below (which may include extracted text from a document, captions for images, or slide notes) to determine the quality of the submission.

    // === Rubric ===
    // ${JSON.stringify(rubric, null, 2)}

    // === Student Submission ===
    // ${fileContent}

    // Provide a detailed evaluation including scores for each criterion, justifications, and overall feedback.
    //     `

    // const gradeResult = await generateGrade(prompt)

    return NextResponse.json({ grade: 'gradeResult' })
  } catch (error) {
    console.error('Error processing the grading request:', error)
    return NextResponse.json(
      { error: 'Failed to process the file and generate a grade.' },
      { status: 500 },
    )
  }
}

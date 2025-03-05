'use client'

import type React from 'react'

import { useState } from 'react'
import { ChevronDown, Check, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Document, Page, pdfjs } from 'react-pdf'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

export default function GradingInterface() {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<string | null>(null)
  const [grade, setGrade] = useState(90)
  const [feedback, setFeedback] = useState(
    '¡Buen trabajo! Your use of past tense verbs is excellent. Consider expanding your vocabulary with more descriptive adjectives in future essays.',
  )
  const [editingFeedback, setEditingFeedback] = useState(false)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPdfFile(fileUrl)
    }
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel - Grading Interface */}
      <div className="w-full md:w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Final Grade</h1>
            <div className="text-center">
              <span className="text-2xl font-bold">{grade}/100</span>
              <p className="text-sm text-muted-foreground">Using Google Classroom rubric</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setGrade((prev) => Math.min(prev + 1, 100))}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit Grade
          </Button>
        </div>

        <Card className="m-4 border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Feedback for Student</CardTitle>
          </CardHeader>
          <CardContent>
            {editingFeedback ? (
              <div className="space-y-2">
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button size="sm" onClick={() => setEditingFeedback(false)} className="w-full">
                  Save Feedback
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">{feedback}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingFeedback(true)}
                  className="w-full"
                >
                  Edit Feedback
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <div className="px-4 space-y-2">
          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
              <span className="font-medium">Rubric 1</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
              Rubric 1 content would go here...
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="border rounded-md">
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
              <span className="font-medium">Rubric 2</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
              Rubric 2 content would go here...
            </CollapsibleContent>
          </Collapsible>

          <Collapsible className="border rounded-md" defaultOpen>
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
              <span className="font-medium">Rubric 3</span>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">
              <p className="text-sm mb-2">Grade based on:</p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Correct use of past tense verbs (+15)</li>
                <li>Good vocabulary related to travel (+12)</li>
                <li>Clear narrative structure (+10)</li>
                <li>Some accent mark errors (-3)</li>
                <li>Limited use of descriptive adjectives (-2)</li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="p-4 mt-4">
          <Button className="w-full bg-green-500 hover:bg-green-600">
            <Check className="mr-2 h-4 w-4" /> Confirm and Submit Grade
          </Button>
        </div>
      </div>

      {/* Right Panel - PDF Viewer */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Student's Work</h2>
          <div>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
              id="pdf-upload"
            />
            <label htmlFor="pdf-upload">
              <Button
                variant="outline"
                size="sm"
                //   as="span"
                className="cursor-pointer"
              >
                Upload PDF
              </Button>
            </label>
          </div>
        </div>

        <div className="flex-1 border rounded-md bg-white overflow-auto flex items-center justify-center">
          {pdfFile ? (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="w-full h-full"
            >
              <Page
                pageNumber={pageNumber}
                width={Math.min(window.innerWidth * 0.6, 800)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          ) : (
            <div className="text-center text-muted-foreground">
              Student's work would appear here...
              <p className="text-sm mt-2">Upload a PDF using the button above</p>
            </div>
          )}
        </div>

        {pdfFile && numPages && (
          <div className="mt-4 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {pageNumber} of {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages || 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

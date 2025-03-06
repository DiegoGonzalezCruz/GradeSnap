import React, { useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { AiOutlineLoading } from 'react-icons/ai'

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

interface PDFViewerProps {
  selectedFile: any
  pdfUrl: string | null
  pdfFile: File | null
  setPdfUrl: (url: string | null) => void
  setPdfFile: (file: File | null) => void
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void
  numPages: number | null
  pageNumber: number
  setPageNumber: (page: number) => void
}

export default function PDFViewer({
  selectedFile,
  pdfUrl,
  pdfFile,
  setPdfUrl,
  setPdfFile,
  onDocumentLoadSuccess,
  numPages,
  pageNumber,
  setPageNumber,
}: PDFViewerProps) {
  // When a new file is selected, fetch its PDF version from the backend
  useEffect(() => {
    async function fetchPdf() {
      if (selectedFile) {
        try {
          // Call the export endpoint with the file's alternateLink
          const res = await fetch(
            `/api/classroom/export-pdf?url=${encodeURIComponent(
              selectedFile.driveFile.alternateLink,
            )}`,
          )
          if (!res.ok) {
            throw new Error('Failed to fetch PDF preview.')
          }
          const blob = await res.blob()
          // Create an object URL from the Blob and set it as pdfUrl
          const url = URL.createObjectURL(blob)
          setPdfUrl(url)
          // Optionally, create a File object if needed (here we set pdfFile to null)
          setPdfFile(null)
        } catch (error) {
          console.error(error)
        }
      }
    }
    fetchPdf()
    // Cleanup the URL when the component unmounts or when selectedFile changes
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl)
    }
  }, [selectedFile])

  // Helper functions can remain the same
  const getFileIcon = (attachment: any) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()
    return null
  }
  const getFileTypeName = (attachment: any) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()
    return 'Document'
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Student&apos;s Work</h2>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              {selectedFile.driveFile.title} ({getFileTypeName(selectedFile)})
            </p>
          )}
        </div>
        {selectedFile && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={selectedFile.driveFile.alternateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        )}
      </div>
      <div className="flex-1 border rounded-md bg-white overflow-auto flex items-center justify-center">
        {selectedFile ? (
          pdfUrl ? (
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              className="w-full h-full"
              loading={<Loader2 className="h-8 w-8 animate-spin" />}
              error={
                <div className="text-center p-4">
                  <p className="text-red-500 mb-2">Failed to load PDF directly.</p>
                  <Button variant="outline" asChild>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      Open in new tab
                    </a>
                  </Button>
                </div>
              }
            >
              {numPages && (
                <Page
                  pageNumber={pageNumber}
                  width={Math.min(window.innerWidth * 0.6, 800)}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              )}
            </Document>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <p className="text-muted-foreground mb-4 flex flex-row items-center justify-center gap-5">
                <AiOutlineLoading className="animate-spin" /> Loading PDF preview...
              </p>
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground">
            Student&apos;s work would appear here...
            <p className="text-sm mt-2">Select a file from the list or upload a PDF</p>
          </div>
        )}
      </div>
      {pdfUrl && numPages && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
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
            onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
          >
            Next
          </Button>
        </div>
      )}
    </>
  )
}

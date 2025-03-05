import React from 'react'
import { Document, Page } from 'react-pdf'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { Loader2 } from 'lucide-react'

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
  // Functions for file icon and type can be defined here or imported if shared
  const getFileIcon = (attachment: any) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()
    // ... return appropriate icon component
    return null
  }
  const getFileTypeName = (attachment: any) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()
    // ... return appropriate file type string
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
          pdfUrl && pdfFile ? (
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
              {selectedFile.driveFile.thumbnailUrl ? (
                <div className="text-center">
                  <img
                    src={selectedFile.driveFile.thumbnailUrl || '/placeholder.svg'}
                    alt={selectedFile.driveFile.title}
                    className="max-w-md max-h-md object-contain mb-4"
                  />
                  <p className="text-muted-foreground mb-4">
                    This is a {getFileTypeName(selectedFile)} document and cannot be previewed
                    directly.
                  </p>
                  <Button asChild>
                    <a
                      href={selectedFile.driveFile.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google {getFileTypeName(selectedFile).replace('Google ', '')}
                    </a>
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-full mb-4 mx-auto">
                    {getFileIcon(selectedFile)}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{selectedFile.driveFile.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    This {getFileTypeName(selectedFile)} document cannot be previewed directly.
                  </p>
                  <Button asChild>
                    <a
                      href={selectedFile.driveFile.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google {getFileTypeName(selectedFile).replace('Google ', '')}
                    </a>
                  </Button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="text-center text-muted-foreground">
            Student&apos;s work would appear here...
            <p className="text-sm mt-2">Select a file from the list or upload a PDF</p>
          </div>
        )}
      </div>
      {pdfUrl && pdfFile && numPages && (
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

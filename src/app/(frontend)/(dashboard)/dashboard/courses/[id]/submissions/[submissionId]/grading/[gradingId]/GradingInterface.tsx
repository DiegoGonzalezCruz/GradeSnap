'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { ChevronDown, Check, Edit, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Document, Page, pdfjs } from 'react-pdf'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useGetRubrics } from '@/hooks/classroom/useRubrics'
import { useGetSubmissionsFromCourseWork } from '@/hooks/classroom/useSubmissions'
import { useGetSubmissionById } from '@/hooks/classroom/useSubmissionById'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// Rubric type definitions
interface RubricLevel {
  id: string
  title: string
  description: string
  points: number
}

interface RubricCriterion {
  id: string
  title: string
  description: string
  levels: RubricLevel[]
}

interface Rubric {
  courseId: string
  courseWorkId: string
  id: string
  criteria: RubricCriterion[]
}

interface Attachment {
  driveFile: {
    id: string
    title: string
    alternateLink: string
  }
}

interface GradingInterfaceProps {
  courseId?: string
  courseWorkId?: string
  submissionId?: string
  attachments?: Attachment[]
  initialRubric?: Rubric
}

export default function GradingInterface({
  courseId,
  courseWorkId,
  submissionId,
  attachments = [],
}: GradingInterfaceProps) {
  // console.log(courseId, courseWorkId, submissionId, '🚨 **** ****')

  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<string | null>(null)
  const [feedback, setFeedback] = useState(
    '¡Buen trabajo! Your use of past tense verbs is excellent. Consider expanding your vocabulary with more descriptive adjectives in future essays.',
  )
  const [editingFeedback, setEditingFeedback] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [gradingLoading, setGradingLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<string | null>(null)

  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({})
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints, setMaxPoints] = useState(0)

  // Fetch rubric using React Query
  const {
    data: rubric,
    isLoading: rubricLoading,
    error: rubricError,
  } = useGetRubrics(courseId!, courseWorkId!)
  // console.log('******* THIS ¨¨¨*****', courseId, courseWorkId, submissionId)
  const { data: submission } = useGetSubmissionById(courseId!, courseWorkId!, submissionId!)
  // console.log(rubric, 'rubric')
  console.log(submission, 'submission from grading Page')

  // Calculate maximum possible points
  const calculateMaxPoints = (rubricData: Rubric) => {
    const max = rubricData.criteria.reduce((total, criterion) => {
      const maxLevelPoints = Math.max(...criterion.levels.map((level) => level.points))
      return total + maxLevelPoints
    }, 0)
    setMaxPoints(max)
  }

  // Calculate total points based on selected levels
  useEffect(() => {
    if (!rubric) return

    const total = rubric.criteria.reduce((sum: any, criterion: RubricCriterion) => {
      const selectedLevelId = selectedLevels[criterion.id]
      if (!selectedLevelId) return sum

      const level = criterion.levels.find((l: RubricLevel) => l.id === selectedLevelId)
      return sum + (level?.points || 0)
    }, 0)

    setTotalPoints(total)
  }, [selectedLevels, rubric])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const fileUrl = e.target.value
    setSelectedFile(fileUrl)
    setPdfFile(fileUrl)
  }

  // Handle file upload (for local files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPdfFile(fileUrl)
    }
  }

  // Handle level selection for a criterion
  const handleLevelSelect = (criterionId: string, levelId: string) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [criterionId]: levelId,
    }))
  }

  // Handle grading submission
  const handleGradeSubmit = async () => {
    if (!rubric || !selectedFile) {
      toast('Please select a file and complete the rubric evaluation')
      return
    }

    setGradingLoading(true)
    try {
      // This would be your actual API call
      // For demonstration, we'll simulate an API call
      // const res = await fetch(`${getClientSideURL()}/api/classroom/grading`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     rubric,
      //     url: selectedFile,
      //     selectedLevels,
      //     feedback
      //   }),
      // });
      // const data = await res.json();

      // Simulate API response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setGradeResult(
        JSON.stringify(
          {
            totalPoints,
            maxPoints,
            percentage: Math.round((totalPoints / maxPoints) * 100),
            feedback,
            criteriaGrades: Object.entries(selectedLevels).map(([criterionId, levelId]) => {
              const criterion = rubric.criteria.find((c: RubricCriterion) => c.id === criterionId)
              const level = criterion?.levels.find((l: RubricLevel) => l.id === levelId)
              return {
                criterion: criterion?.title,
                level: level?.title,
                points: level?.points,
              }
            }),
          },
          null,
          2,
        ),
      )

      toast('Grading completed successfully')
    } catch (error) {
      console.error(error)
      toast('Failed to submit grade')
    } finally {
      setGradingLoading(false)
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
              <span className="text-2xl font-bold">
                {totalPoints}/{maxPoints}
              </span>
              <p className="text-sm text-muted-foreground">
                {maxPoints > 0 ? `${Math.round((totalPoints / maxPoints) * 100)}%` : '0%'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" /> Edit Grade
          </Button>
        </div>

        {/* File Selection */}
        <div className="p-4 border-b">
          <Label htmlFor="file-select" className="text-sm font-medium mb-2 block">
            Select Student Submission
          </Label>
          <select
            id="file-select"
            className="w-full p-2 border rounded-md"
            value={selectedFile || ''}
            onChange={handleFileChange}
          >
            <option value="" disabled>
              -- Choose a file --
            </option>
            {attachments.map((attachment) => (
              <option key={attachment.driveFile.id} value={attachment.driveFile.alternateLink}>
                {attachment.driveFile.title}
              </option>
            ))}
          </select>
          {attachments.length === 0 && (
            <div className="mt-2">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload">
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  Upload PDF
                </Button>
              </label>
            </div>
          )}
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

        {/* Rubric Criteria */}
        <div className="px-4 space-y-2 mb-4">
          {rubricLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : rubric ? (
            rubric.criteria.map((criterion: RubricCriterion) => (
              <Collapsible key={criterion.id} className="border rounded-md">
                <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{criterion.title}</span>
                    {selectedLevels[criterion.id] && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        {criterion.levels.find((l) => l.id === selectedLevels[criterion.id])?.title}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 border-t">
                  <p className="text-sm text-muted-foreground mb-3">{criterion.description}</p>
                  <RadioGroup
                    value={selectedLevels[criterion.id] || ''}
                    onValueChange={(value) => handleLevelSelect(criterion.id, value)}
                    className="space-y-2"
                  >
                    {criterion.levels.map((level) => (
                      <div
                        key={level.id}
                        className="flex items-start space-x-2 p-2 rounded-md hover:bg-gray-50"
                      >
                        <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                        <div className="grid gap-1">
                          <Label htmlFor={level.id} className="font-medium">
                            {level.title} ({level.points} {level.points === 1 ? 'point' : 'points'})
                          </Label>
                          <p className="text-sm text-muted-foreground">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CollapsibleContent>
              </Collapsible>
            ))
          ) : (
            <p className="text-center p-4 text-muted-foreground">No rubric available</p>
          )}
        </div>

        <div className="p-4 mt-4">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={handleGradeSubmit}
            disabled={
              gradingLoading ||
              !rubric ||
              Object.keys(selectedLevels).length < (rubric?.criteria.length || 0)
            }
          >
            {gradingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Confirm and Submit Grade
              </>
            )}
          </Button>
        </div>

        {/* Display grading result */}
        {gradeResult && (
          <div className="m-4 p-4 border rounded-md bg-gray-50">
            <Label className="font-medium mb-2 block">Grading Result:</Label>
            <pre className="text-xs whitespace-pre-wrap bg-white p-2 rounded border overflow-auto max-h-40">
              {gradeResult}
            </pre>
          </div>
        )}
      </div>

      {/* Right Panel - PDF Viewer */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-medium">Student's Work</h2>
        </div>

        <div className="flex-1 border rounded-md bg-white overflow-auto flex items-center justify-center">
          {pdfFile ? (
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              className="w-full h-full"
              loading={<Loader2 className="h-8 w-8 animate-spin" />}
              error={<p className="text-red-500">Failed to load PDF. Please check the file.</p>}
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
              <p className="text-sm mt-2">Select a file from the dropdown or upload a PDF</p>
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

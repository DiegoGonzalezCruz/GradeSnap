'use client'

import React, { useState, useEffect } from 'react'
import { Loader2, Rocket, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import StudentInfoCard from '@/components/Grading/StudentInfoCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { pdfjs } from 'react-pdf'
import { useGetRubrics } from '@/hooks/classroom/useRubrics'
import { useGetSubmissionById } from '@/hooks/classroom/useSubmissionById'
import { GradingInterfaceProps, RubricCriterion, Attachment } from '@/types/courses'
import { getClientSideURL } from '@/utilities/getURL'

import FileSelector from '@/components/Courses/Grading/FileSelector'
import RubricPanel from '@/components/Courses/Grading/RubricPanel'
import FeedbackPanel from '@/components/Courses/Grading/FeedbackPanel'
import HistoryPanel from '@/components/Courses/Grading/HistoryPanel'
import PDFViewer from '@/components/Courses/Grading/PDFViewer'
import GradingSkeleton from './GradingSkeleton'
import RubricMissingDialog from '@/components/Courses/Grading/RubricMissingDialog'
import { useCourseInfo } from '@/hooks/classroom/useCourseInfo'

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

// Define a type for the grade result returned by the LLM
type GradeResult = {
  criteria: {
    criterionId: string
    criterionTitle: string
    justification: string
    score: number
  }[]
  overallFeedback: string
  overallGrade: number
}

export default function GradingInterface({
  courseId,
  courseWorkId,
  submissionId,
  attachments = [],
}: GradingInterfaceProps) {
  // Local state
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [feedback, setFeedback] = useState('')
  const [editingFeedback, setEditingFeedback] = useState(false)
  const [gradingLoading, setGradingLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({})
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints, setMaxPoints] = useState(0)
  const [activeTab, setActiveTab] = useState('rubric')
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null)
  const [showRubricMissingDialog, setShowRubricMissingDialog] = useState(false)

  // Fetch rubric and submission data
  const {
    data: rubric,
    isLoading: rubricLoading,
    isSuccess: isSuccessRubric,
  } = useGetRubrics(courseId!, courseWorkId!)
  // console.log(rubric, 'rubric ***')
  const { data: submissionData, isSuccess: isSuccessSubmissionData } = useGetSubmissionById(
    courseId!,
    courseWorkId!,
    submissionId!,
  )

  // Use attachments from submission if available
  const submissionAttachments = submissionData?.assignmentSubmission.attachments || attachments

  useEffect(() => {
    // Check if rubric is empty or missing criteria
    if (isSuccessRubric && (!rubric || !rubric.criteria || Object.keys(rubric).length === 0)) {
      setShowRubricMissingDialog(true)
    } else if (rubric && rubric.criteria) {
      calculateMaxPoints(rubric)
    }
  }, [rubric, isSuccessRubric])

  // Set default file if none selected
  useEffect(() => {
    if (submissionAttachments.length > 0 && !selectedFile) {
      setSelectedFile(submissionAttachments[0])
    }
  }, [submissionAttachments, selectedFile])

  // Calculate maximum possible points from the rubric
  const calculateMaxPoints = (rubricData: any) => {
    // Check if rubricData and criteria exist before using reduce
    if (!rubricData || !rubricData.criteria || !Array.isArray(rubricData.criteria)) {
      setMaxPoints(0)
      return
    }

    const max = rubricData.criteria.reduce((total: number, criterion: RubricCriterion) => {
      const maxLevelPoints = Math.max(...criterion.levels.map((level) => level.points))
      return total + maxLevelPoints
    }, 0)
    setMaxPoints(max)
  }

  // Calculate total points based on selected levels (if using manual grading)
  useEffect(() => {
    if (!rubric || !rubric.criteria || !Array.isArray(rubric.criteria)) return

    const total = rubric.criteria.reduce((sum: number, criterion: RubricCriterion) => {
      const selectedLevelId = selectedLevels[criterion.id]
      if (!selectedLevelId) return sum
      const level = criterion.levels.find((l) => l.id === selectedLevelId)
      return sum + (level?.points || 0)
    }, 0)
    setTotalPoints(total)
  }, [selectedLevels, rubric])

  // Update PDF document pages when loaded
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // API-based grading submission using the LLM
  const handleGradeClick = async (rubric: any, fileUrl: string) => {
    if (!rubric || !rubric.criteria || Object.keys(rubric).length === 0) {
      setShowRubricMissingDialog(true)
      return
    }

    setGradingLoading(true)
    setGradeResult(null)
    try {
      const res = await fetch(`${getClientSideURL()}/api/classroom/grading`, {
        method: 'POST',
        body: JSON.stringify({ rubric, url: fileUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to grade submission.')
      }
      // Parse the stringified JSON from the API response
      const gradeParsed = JSON.parse(data.grade)
      console.log('Parsed Grade:', gradeParsed)

      setGradeResult(gradeParsed)
      // Update overall feedback with the LLM response
      if (gradeParsed.overallFeedback) {
        setFeedback(gradeParsed.overallFeedback)
      }
      toast('Grading completed successfully.')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to grade submission.')
    } finally {
      setGradingLoading(false)
    }
  }

  // Format dates for history display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Level selection handler (for manual selection, if needed)
  const handleLevelSelect = (criterionId: string, levelId: string) => {
    setSelectedLevels((prev) => ({
      ...prev,
      [criterionId]: levelId,
    }))
  }

  const handleSave = async () => {
    console.log('handleSave called')
  }

  const isSuccess = isSuccessRubric && isSuccessSubmissionData
  if (!isSuccess) return <GradingSkeleton />

  // Check if rubric is empty or missing criteria
  const isRubricMissing = !rubric || !rubric.criteria || Object.keys(rubric).length === 0

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Rubric Missing Dialog */}
      <RubricMissingDialog
        open={showRubricMissingDialog}
        onOpenChange={setShowRubricMissingDialog}
        courseId={courseId!}
        courseWorkId={courseWorkId!}
      />

      {/* Left Panel: Grading Controls */}
      <div className="w-full md:w-1/3 border-r overflow-y-auto">
        <StudentInfoCard submissionData={submissionData} />
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-xl font-bold">Final Grade</h1>
              <div className="text-center">
                <span className="text-2xl font-bold">
                  {gradeResult ? gradeResult.overallGrade : totalPoints}/{maxPoints}
                </span>
                <p className="text-sm text-muted-foreground">
                  {maxPoints > 0
                    ? `${gradeResult ? Math.round((gradeResult.overallGrade / maxPoints) * 100) : Math.round((totalPoints / maxPoints) * 100)}%`
                    : '0%'}
                </p>
              </div>
            </div>

            {/* Grading Button */}
            <Button
              size="sm"
              onClick={() => {
                if (isRubricMissing) {
                  setShowRubricMissingDialog(true)
                } else if (selectedFile) {
                  handleGradeClick(rubric, selectedFile.driveFile.alternateLink)
                }
              }}
              disabled={gradingLoading || !selectedFile}
            >
              {gradingLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-1" /> Grade
                </>
              )}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="rubric">Rubric</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="rubric" className="mt-0">
                {isRubricMissing ? (
                  <div className="p-4 border rounded-md bg-amber-50 text-amber-800">
                    <h3 className="font-medium mb-2">Rubric Required</h3>
                    <p className="text-sm mb-4">
                      A rubric is required to grade this submission. Please open this assignment in
                      Google Classroom to create or attach a rubric.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRubricMissingDialog(true)}
                      className=""
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open in Google Classroom
                    </Button>
                  </div>
                ) : (
                  <RubricPanel
                    rubric={rubric}
                    rubricLoading={rubricLoading}
                    selectedLevels={selectedLevels}
                    onLevelSelect={handleLevelSelect}
                    gradeResult={gradeResult || undefined}
                  />
                )}
              </TabsContent>

              <TabsContent value="feedback" className="mt-0">
                <FeedbackPanel
                  feedback={feedback}
                  editingFeedback={editingFeedback}
                  onFeedbackChange={setFeedback}
                  onToggleEdit={() => setEditingFeedback((prev) => !prev)}
                  gradeResult={gradeResult || undefined}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <HistoryPanel
                  history={submissionData.submissionHistory}
                  user={submissionData.user}
                  formatDate={formatDate}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="p-4 mt-4">
          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => {
              if (isRubricMissing) {
                setShowRubricMissingDialog(true)
              } else if (selectedFile) {
                handleGradeClick(rubric, selectedFile.driveFile.alternateLink)
              }
            }}
            disabled={gradingLoading || !selectedFile}
          >
            {gradingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <Check onClick={handleSave} className="mr-2 h-4 w-4" /> Save into GradeSnap
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel: Document Viewer */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 flex flex-col gap-5 h-[85vh]">
        <FileSelector
          attachments={submissionAttachments}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
        <PDFViewer
          selectedFile={selectedFile}
          pdfUrl={pdfUrl}
          pdfFile={pdfFile}
          setPdfUrl={setPdfUrl}
          setPdfFile={setPdfFile}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      </div>
    </div>
  )
}

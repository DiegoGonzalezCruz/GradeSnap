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
// Optionally, you could import your custom GradingButton here if you want to use it instead
// import GradingButton from '@/components/Courses/CourseWork/GradingButton'

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
  const [feedback, setFeedback] = useState(
    '¡Buen trabajo! Your use of past tense verbs is excellent. Consider expanding your vocabulary with more descriptive adjectives in future essays.',
  )
  const [editingFeedback, setEditingFeedback] = useState(false)
  const [gradingLoading, setGradingLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null)
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({})
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints, setMaxPoints] = useState(0)
  const [activeTab, setActiveTab] = useState('rubric')
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null)

  // Fetch rubric and submission data
  const {
    data: rubric,
    isLoading: rubricLoading,
    isSuccess: isSuccessRubric,
  } = useGetRubrics(courseId!, courseWorkId!)
  const { data: submissionData, isSuccess: isSuccessSubmissionData } = useGetSubmissionById(
    courseId!,
    courseWorkId!,
    submissionId!,
  )

  // Use attachments from submission if available
  const submissionAttachments = submissionData?.assignmentSubmission.attachments || attachments

  useEffect(() => {
    if (rubric) {
      calculateMaxPoints(rubric)
    }
  }, [rubric])

  // Set default file if none selected
  useEffect(() => {
    if (submissionAttachments.length > 0 && !selectedFile) {
      setSelectedFile(submissionAttachments[0])
    }
  }, [submissionAttachments, selectedFile])

  // Calculate maximum possible points from the rubric
  const calculateMaxPoints = (rubricData: any) => {
    const max = rubricData.criteria.reduce((total: number, criterion: RubricCriterion) => {
      const maxLevelPoints = Math.max(...criterion.levels.map((level) => level.points))
      return total + maxLevelPoints
    }, 0)
    setMaxPoints(max)
  }

  // Calculate total points based on selected levels (if using manual grading)
  useEffect(() => {
    if (!rubric) return
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

  const isSuccess = isSuccessRubric && isSuccessSubmissionData
  if (!isSuccess) return <p>Loading...</p>

  return (
    <div className="flex flex-col md:flex-row h-screen">
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

            {/* Grading Button – note: we removed the manual rubric selection check */}
            <Button
              size="sm"
              onClick={() =>
                selectedFile && handleGradeClick(rubric, selectedFile.driveFile.alternateLink)
              }
              disabled={gradingLoading || !rubric || !selectedFile}
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
                <RubricPanel
                  rubric={rubric}
                  rubricLoading={rubricLoading}
                  selectedLevels={selectedLevels}
                  onLevelSelect={handleLevelSelect}
                  gradeResult={gradeResult || undefined} // Pass the grading result to show stars & LLM justification
                />
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
            onClick={() =>
              selectedFile && handleGradeClick(rubric, selectedFile.driveFile.alternateLink)
            }
            disabled={gradingLoading || !rubric || !selectedFile}
          >
            {gradingLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Grading...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Confirm and Submit Grade
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

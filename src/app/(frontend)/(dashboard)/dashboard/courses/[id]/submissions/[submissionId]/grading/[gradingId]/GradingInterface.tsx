'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import {
  ChevronDown,
  Check,
  Edit,
  Loader2,
  Calendar,
  ExternalLink,
  FileText,
  FileIcon as FilePresentation,
  FileSpreadsheet,
  FileTextIcon as FileText2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Document, Page, pdfjs } from 'react-pdf'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

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
    thumbnailUrl?: string
  }
}

interface SubmissionHistory {
  stateHistory: {
    state: string
    stateTimestamp: string
    actorUserId: string
  }
}

interface Submission {
  courseId: string
  courseWorkId: string
  id: string
  userId: string
  creationTime: string
  updateTime: string
  state: string
  alternateLink: string
  courseWorkType: string
  assignmentSubmission: {
    attachments: Attachment[]
  }
  submissionHistory: SubmissionHistory[]
  user: {
    id: string
    name: {
      givenName: string
      familyName: string
      fullName: string
    }
  }
  attachments: Attachment[]
}

interface GradingInterfaceProps {
  courseId?: string
  courseWorkId?: string
  submissionId?: string
  attachments?: Attachment[]
  initialRubric?: Rubric
  submission?: Submission
}

export default function GradingInterface({
  courseId,
  courseWorkId,
  submissionId,
  attachments = [],
  initialRubric,
  submission,
}: GradingInterfaceProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [feedback, setFeedback] = useState(
    '¡Buen trabajo! Your use of past tense verbs is excellent. Consider expanding your vocabulary with more descriptive adjectives in future essays.',
  )
  const [editingFeedback, setEditingFeedback] = useState(false)
  const [selectedFile, setSelectedFile] = useState<Attachment | null>(null)
  const [gradingLoading, setGradingLoading] = useState(false)
  const [gradeResult, setGradeResult] = useState<string | null>(null)
  const [rubric, setRubric] = useState<Rubric | null>(initialRubric || null)
  const [rubricLoading, setRubricLoading] = useState(false)
  const [selectedLevels, setSelectedLevels] = useState<Record<string, string>>({})
  const [totalPoints, setTotalPoints] = useState(0)
  const [maxPoints, setMaxPoints] = useState(0)
  const [activeTab, setActiveTab] = useState('rubric')

  // Use the submission data if provided
  const submissionData = submission || {
    courseId: '713211569729',
    courseWorkId: '749908255179',
    id: 'Cg4I4YPI6tIEEMvDj9DpFQ',
    userId: '100057186155858642152',
    creationTime: '2025-02-11T17:57:44.852Z',
    updateTime: '2025-02-24T13:52:52.152Z',
    state: 'TURNED_IN',
    alternateLink:
      'https://classroom.google.com/c/NzEzMjExNTY5NzI5/a/NzQ5OTA4MjU1MTc5/submissions/by-status/and-sort-last-name/student/MTU5Njc0MTM5MTA1',
    courseWorkType: 'ASSIGNMENT',
    assignmentSubmission: {
      attachments: [
        {
          driveFile: {
            id: '1e0E5KyEhIw-5nHfEhY7qfDzzXaUHVNa2dCqUe2BkHRY',
            title: 'Chile slides!',
            alternateLink:
              'https://docs.google.com/presentation/d/1e0E5KyEhIw-5nHfEhY7qfDzzXaUHVNa2dCqUe2BkHRY/edit?usp=drive_web',
            thumbnailUrl:
              'https://lh3.google.com/drive-storage/AJQWtBOjTG1eP8yF8ehtH-UC8sUJNk8tIw1HnUq-Ps5wca-_Xi-HNo_jz168sWQ_QABbFN9n9DgOq3BJGcg_eYkwQOAxZQQhPP2-eNat4mnwKeSJuNDP_3D7ASeWsGdoZ2hM-e60QM0=s200',
          },
        },
      ],
    },
    submissionHistory: [
      {
        stateHistory: {
          state: 'CREATED',
          stateTimestamp: '2025-02-11T17:57:44.847Z',
          actorUserId: '100057186155858642152',
        },
      },
      {
        stateHistory: {
          state: 'TURNED_IN',
          stateTimestamp: '2025-02-24T13:52:52.152Z',
          actorUserId: '100057186155858642152',
        },
      },
    ],
    user: {
      id: '100057186155858642152',
      name: {
        givenName: 'Arianna',
        familyName: 'Owens',
        fullName: 'Arianna Owens',
      },
    },
    attachments: [
      {
        driveFile: {
          id: '1e0E5KyEhIw-5nHfEhY7qfDzzXaUHVNa2dCqUe2BkHRY',
          title: 'Chile slides!',
          alternateLink:
            'https://docs.google.com/presentation/d/1e0E5KyEhIw-5nHfEhY7qfDzzXaUHVNa2dCqUe2BkHRY/edit?usp=drive_web',
          thumbnailUrl:
            'https://lh3.google.com/drive-storage/AJQWtBOjTG1eP8yF8ehtH-UC8sUJNk8tIw1HnUq-Ps5wca-_Xi-HNo_jz168sWQ_QABbFN9n9DgOq3BJGcg_eYkwQOAxZQQhPP2-eNat4mnwKeSJuNDP_3D7ASeWsGdoZ2hM-e60QM0=s200',
        },
      },
    ],
  }

  // Use the attachments from the submission if available
  const submissionAttachments = submissionData?.attachments || attachments

  // Load rubric data if not provided
  useEffect(() => {
    if (initialRubric) {
      setRubric(initialRubric)
      calculateMaxPoints(initialRubric)
      return
    }

    // If no initialRubric, we would fetch it here
    // For now, we'll use a placeholder
    setRubricLoading(true)

    // Simulate fetching rubric
    setTimeout(() => {
      const rubricData = {
        courseId: '713211569729',
        courseWorkId: '749908255179',
        id: '755518487387',
        criteria: [
          {
            id: 'NzU1NTE4NDg3Mzg4',
            title: 'Country Information',
            description:
              'Evaluate how thoroughly the student presents information about the country—including weather, capital, flag, and dish—using correct Spanish grammar and appropriate verb forms.',
            levels: [
              {
                id: 'NzU1NTE4NDg3Mzg5',
                title: 'Exemplary',
                description:
                  'Comprehensive details about weather, capital, flag, and dish using correct Spanish grammar and verb forms',
                points: 3,
              },
              {
                id: 'NzU1NTE4NDg3Mzkw',
                title: 'Satisfactory',
                description: 'Partial information with some grammatical errors',
                points: 2,
              },
              {
                id: 'NzU1NTE4NDg3Mzkx',
                title: 'Needs Improvement',
                description: 'Minimal or incorrect country information',
                points: 1,
              },
            ],
          },
          {
            id: 'NzU1NTE4NDg3Mzky',
            title: 'Famous People/Places',
            description:
              'Assess the student\'s ability to describe famous people or places, ensuring that at least three examples are provided with accurate information using the verb "ser" and an engaging presentation.',
            levels: [
              {
                id: 'NzU1NTE4NDg3Mzkz',
                title: 'Exemplary',
                description:
                  "3 detailed descriptions using 'ser' with accurate information and engaging presentation",
                points: 3,
              },
              {
                id: 'NzU1NTE4NDg3Mzk0',
                title: 'Satisfactory',
                description: '2 people/places described with some depth',
                points: 2,
              },
              {
                id: 'NzU1NTE4NDg3Mzk1',
                title: 'Needs Improvement',
                description: 'Incomplete or vague descriptions',
                points: 1,
              },
            ],
          },
          {
            id: 'NzU1NTE4NDg3Mzk2',
            title: 'Cultural Activity Demonstration',
            description:
              'Evaluate the clarity and thoroughness of the demonstration of a cultural activity, including step-by-step instructions, visual aids, and the use of relevant Spanish vocabulary.',
            levels: [
              {
                id: 'NzU1NTE4NDg3Mzk3',
                title: 'Exemplary',
                description:
                  'Clear, step-by-step instructions with effective visual aids and relevant Spanish vocabulary.',
                points: 3,
              },
              {
                id: 'NzU1NTE4NDg3Mzk4',
                title: 'Satisfactory',
                description:
                  'Somewhat clear instructions with limited vocabulary and visual support.',
                points: 2,
              },
              {
                id: 'NzU1NTE4NDg3Mzk5',
                title: 'Needs Improvement',
                description: 'Confusing or incomplete demonstration.',
                points: 1,
              },
            ],
          },
          {
            id: 'NzU1NTE4NDg3NDAw',
            title: 'Slide Design & Organization',
            description:
              'Assess the visual appeal and overall organization of the presentation slides, ensuring all specified slide requirements are met.',
            levels: [
              {
                id: 'NzU1NTE4NDg3NDAx',
                title: 'Exemplary',
                description:
                  'Visually appealing, well-organized slides that meet all specified requirements.',
                points: 3,
              },
              {
                id: 'NzU1NTE4NDg3NDAy',
                title: 'Satisfactory',
                description: 'Mostly organized slides with minor design issues.',
                points: 2,
              },
              {
                id: 'NzU1NTE4NDg3NDAz',
                title: 'Needs Improvement',
                description: 'Disorganized slides or missing required content.',
                points: 1,
              },
            ],
          },
          {
            id: 'NzU1NTE4NDg3NDA0',
            title: 'Presentation Delivery',
            description:
              'Assess the overall delivery of the presentation, focusing on confidence, clarity of pronunciation, creativity, and engagement.',
            levels: [
              {
                id: 'NzU1NTE4NDg3NDA1',
                title: 'Exemplary',
                description:
                  'Confident, engaging delivery with clear pronunciation, creativity, and enthusiasm.',
                points: 3,
              },
              {
                id: 'NzU1NTE4NDg3NDA2',
                title: 'Satisfactory',
                description: 'Somewhat hesitant but understandable presentation.',
                points: 2,
              },
              {
                id: 'NzU1NTE4NDg3NDA3',
                title: 'Needs Improvement',
                description: 'Difficult to understand or lacking confidence.',
                points: 1,
              },
            ],
          },
        ],
      } as Rubric

      setRubric(rubricData)
      calculateMaxPoints(rubricData)
      setRubricLoading(false)
    }, 1000)
  }, [initialRubric])

  // Set default selected file from submission
  useEffect(() => {
    if (submissionAttachments.length > 0 && !selectedFile) {
      const firstAttachment = submissionAttachments[0]
      setSelectedFile(firstAttachment)
    }
  }, [submissionAttachments, selectedFile])

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

    const total = rubric.criteria.reduce((sum, criterion) => {
      const selectedLevelId = selectedLevels[criterion.id]
      if (!selectedLevelId) return sum

      const level = criterion.levels.find((l) => l.id === selectedLevelId)
      return sum + (level?.points || 0)
    }, 0)

    setTotalPoints(total)
  }, [selectedLevels, rubric])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  // Get file type icon based on file extension or URL
  const getFileIcon = (attachment: Attachment) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()

    if (url.includes('presentation') || url.includes('.ppt')) {
      return <FilePresentation className="h-5 w-5" />
    } else if (url.includes('spreadsheets') || url.includes('.xls')) {
      return <FileSpreadsheet className="h-5 w-5" />
    } else if (url.includes('document') || url.includes('.doc')) {
      return <FileText2 className="h-5 w-5" />
    } else if (url.includes('.pdf')) {
      return <FileText className="h-5 w-5" />
    } else {
      return <FileText className="h-5 w-5" />
    }
  }

  // Get file type name
  const getFileTypeName = (attachment: Attachment) => {
    const url = attachment.driveFile.alternateLink.toLowerCase()

    if (url.includes('presentation')) {
      return 'Google Slides'
    } else if (url.includes('spreadsheets')) {
      return 'Google Sheets'
    } else if (url.includes('document')) {
      return 'Google Docs'
    } else if (url.includes('.pdf')) {
      return 'PDF'
    } else {
      return 'Document'
    }
  }

  // Handle file selection
  const handleFileSelect = (attachment: Attachment) => {
    setSelectedFile(attachment)

    // Reset PDF state
    setPdfUrl(null)
    setPdfFile(null)
    setNumPages(null)
    setPageNumber(1)
  }

  // Handle file upload (for local files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPdfFile(file)
      setPdfUrl(URL.createObjectURL(file))

      // Create a mock attachment for the uploaded file
      const uploadedAttachment: Attachment = {
        driveFile: {
          id: 'local-upload',
          title: file.name,
          alternateLink: URL.createObjectURL(file),
        },
      }

      setSelectedFile(uploadedAttachment)
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
              const criterion = rubric.criteria.find((c) => c.id === criterionId)
              const level = criterion?.levels.find((l) => l.id === levelId)
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

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TURNED_IN':
        return 'bg-green-100 text-green-800'
      case 'CREATED':
        return 'bg-blue-100 text-blue-800'
      case 'RETURNED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  // Check if file is a PDF
  const isPdfFile = (file: File | null) => {
    return file?.type === 'application/pdf'
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Panel - Grading Interface */}
      <div className="w-full md:w-1/3 border-r overflow-y-auto">
        {/* Student Info Card */}
        <Card className="m-4 border shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${submissionData.user.name.fullName.replace(/ /g, '+')}&background=random`}
                />
                <AvatarFallback>{getInitials(submissionData.user.name.fullName)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{submissionData.user.name.fullName}</CardTitle>
                <CardDescription>
                  <Badge className={getStatusColor(submissionData.state)}>
                    {submissionData.state.replace(/_/g, ' ')}
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={submissionData.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View in Google Classroom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="flex items-center text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>Submitted: {formatDate(submissionData.updateTime)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <FileText className="h-3.5 w-3.5 mr-1" />
              <span>
                {submissionAttachments.length} attachment
                {submissionAttachments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Grade and Tabs */}
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="rubric">Rubric</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <div className="p-4">
              <TabsContent value="rubric" className="mt-0">
                {/* File Selection */}
                <div className="mb-4">
                  <Label htmlFor="file-select" className="text-sm font-medium mb-2 block">
                    Select Student Submission
                  </Label>
                  <div className="grid gap-2">
                    {submissionAttachments.map((attachment) => (
                      <div
                        key={attachment.driveFile.id}
                        className={`flex items-center p-2 border rounded-md cursor-pointer hover:bg-gray-50 ${selectedFile?.driveFile.id === attachment.driveFile.id ? 'bg-gray-50 border-primary' : ''}`}
                        onClick={() => handleFileSelect(attachment)}
                      >
                        {attachment.driveFile.thumbnailUrl ? (
                          <img
                            src={attachment.driveFile.thumbnailUrl || '/placeholder.svg'}
                            alt={attachment.driveFile.title}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded mr-3">
                            {getFileIcon(attachment)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {attachment.driveFile.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getFileTypeName(attachment)}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={attachment.driveFile.alternateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}

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
                  </div>
                </div>

                {/* Rubric Criteria */}
                <div className="space-y-2 mb-4">
                  <h3 className="text-sm font-medium mb-2">Grading Rubric</h3>
                  {rubricLoading ? (
                    <div className="flex justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : rubric ? (
                    rubric.criteria.map((criterion) => (
                      <Collapsible key={criterion.id} className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full justify-between items-center p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{criterion.title}</span>
                            {selectedLevels[criterion.id] && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                {
                                  criterion.levels.find(
                                    (l) => l.id === selectedLevels[criterion.id],
                                  )?.title
                                }
                              </span>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-4 pt-0 border-t">
                          <p className="text-sm text-muted-foreground mb-3">
                            {criterion.description}
                          </p>
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
                                    {level.title} ({level.points}{' '}
                                    {level.points === 1 ? 'point' : 'points'})
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {level.description}
                                  </p>
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
              </TabsContent>

              <TabsContent value="feedback" className="mt-0">
                <Card className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">AI Feedback for Student</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {editingFeedback ? (
                      <div className="space-y-2">
                        <Textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          className="min-h-[200px]"
                        />
                        <Button
                          size="sm"
                          onClick={() => setEditingFeedback(false)}
                          className="w-full"
                        >
                          Save Feedback
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm mb-2">{feedback}</p>
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
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Submission History</h3>
                  <div className="space-y-3">
                    {submissionData.submissionHistory.map((entry, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={getStatusColor(entry.stateHistory.state)}>
                            {entry.stateHistory.state.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.stateHistory.stateTimestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          By: {submissionData.user.name.fullName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
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

      {/* Right Panel - Document Viewer */}
      <div className="w-full md:w-2/3 p-4 bg-gray-50 flex flex-col">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Student's Work</h2>
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
              // Only render PDF viewer for actual PDF files
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
              // For Google Drive files, show a preview with iframe or thumbnail
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
              Student's work would appear here...
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

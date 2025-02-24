import { useState } from 'react'
import { generateGrade } from '@/utilities/gemini/index'

const useGradeAssignment = () => {
  const [loading, setLoading] = useState(false)
  const [grade, setGrade] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const gradeAssignment = async (fileContent: string, rubric: any) => {
    setLoading(true)
    try {
      const prompt = `You are a teacher grading student submissions. Grade the following assignment based on the rubric provided.
        Assignment: ${fileContent}
        Rubric: ${JSON.stringify(rubric)}
        Provide a grade and feedback.`

      const result = await generateGrade(prompt)
      // Parse the result to extract the grade and feedback
      const parsedResult = JSON.parse(result)
      setGrade(parsedResult.grade)
      setFeedback(parsedResult.feedback)
    } catch (error) {
      console.error('Failed to grade assignment', error)
      setFeedback('Failed to grade assignment')
    } finally {
      setLoading(false)
    }
  }

  return { loading, grade, feedback, gradeAssignment }
}

export default useGradeAssignment

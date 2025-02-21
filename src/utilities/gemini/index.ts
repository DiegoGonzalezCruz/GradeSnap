import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_APIKEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export const generateGrade = async (prompt: string) => {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export const generateSummary = async (data: any) => {
  //   console.log('generate Summary Fn starting')
  const prompt = `
    You are a friendly and empathetic assistant for a teacher, here to provide a clear glance at the status of their Google Classroom courses and assignments.
    Using the provided JSON data, craft a concise summary that covers key statistics like student engagement, course activity, and assignment progress.
    Emphasize a supportive tone that reassures the teacher, highlights areas of success, and offers insights in a positive and encouraging manner.
    Remember: you're more than a grading tool—your insights help the teacher understand the classroom dynamics and motivate them to keep doing great work.
  `

  //   console.log(prompt, 'PROMPT')

  const result = await model.generateContent([prompt, JSON.stringify(data)])
  //   console.log(result.response.text(), 'RESULT')
  return result.response.text()
}

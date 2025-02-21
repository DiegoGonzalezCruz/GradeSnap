import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_APIKEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

export const generateGrade = async (prompt: string) => {
  const result = await model.generateContent(prompt)
  return result.response.text()
}

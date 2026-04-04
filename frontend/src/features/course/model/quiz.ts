import type { QuizQuestion } from '@/entities/content/model/types'

export interface QuizResult {
  correctCount: number
  totalCount: number
  score: number
  correctnessById: Record<string, boolean>
}

export function normalizeAnswer(value: string | boolean) {
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }

  return value.trim().toLowerCase()
}

export function evaluateQuiz(questions: QuizQuestion[], answers: Record<string, string>): QuizResult {
  const correctnessById: Record<string, boolean> = {}

  let correctCount = 0

  questions.forEach((question) => {
    const actual = normalizeAnswer(question.answer)
    const submitted = normalizeAnswer(answers[question.id] ?? '')
    const isCorrect = actual === submitted
    correctnessById[question.id] = isCorrect

    if (isCorrect) {
      correctCount += 1
    }
  })

  const totalCount = questions.length
  const score = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100)

  return {
    correctCount,
    totalCount,
    score,
    correctnessById,
  }
}

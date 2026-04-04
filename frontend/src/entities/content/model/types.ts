export type SectionType = 'intro' | 'explanation' | 'example' | 'tip' | 'warning' | 'recap'
export type QuizQuestionType = 'single_choice' | 'true_false' | 'fill_blank'

export interface CourseChapterSummary {
  slug: string
  order: number
  title: string
  summary: string
  estimatedMinutes: number
  difficultyLabel: string
  prerequisiteSlug: string | null
  tags: string[]
}

export interface CourseOverview {
  slug: string
  title: string
  subtitle: string
  description: string
  version: string
  chapters: CourseChapterSummary[]
}

export interface ChapterSection {
  id: string
  type: SectionType
  title: string
  content: string
  bullets?: string[]
  exampleCode?: string
  exampleTitle?: string
}

export interface QuizQuestion {
  id: string
  type: QuizQuestionType
  prompt: string
  options?: string[]
  answer: string | boolean
  explanation: string
  knowledgePoint: string
}

export interface ChapterDetail extends CourseChapterSummary {
  learningGoals: string[]
  summaryPoints: string[]
  sections: ChapterSection[]
  quiz: QuizQuestion[]
}

export interface LearningRecord {
  chapterSlug: string
  completed: boolean
  score: number
  answers: Record<string, string>
  lastVisitedAt: string
  completedAt: string | null
}

export interface LearningProgress {
  version: string
  currentChapterSlug: string | null
  chapterRecords: Record<string, LearningRecord>
}

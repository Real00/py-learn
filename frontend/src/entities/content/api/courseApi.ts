import type { ChapterDetail, CourseOverview } from '@/entities/content/model/types'
import { API_BASE_URL } from '@/shared/config/env'

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`)

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function fetchCourseOverview() {
  return fetchJson<CourseOverview>('/course')
}

export function fetchChapterDetail(slug: string) {
  return fetchJson<ChapterDetail>(`/course/chapters/${slug}`)
}

export function fetchChapterQuiz(slug: string) {
  return fetchJson<Pick<ChapterDetail, 'slug' | 'quiz'>>(`/course/chapters/${slug}/quiz`)
}

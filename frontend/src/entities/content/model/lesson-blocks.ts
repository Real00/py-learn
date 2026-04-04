import type { SectionType } from '@/entities/content/model/types'

export type LessonBlockTone = 'default' | 'primary' | 'success' | 'warning'

const lessonBlockMeta: Record<SectionType, { label: string; tone: LessonBlockTone }> = {
  intro: { label: '导入', tone: 'default' },
  explanation: { label: '讲解', tone: 'default' },
  example: { label: '代码示例', tone: 'primary' },
  tip: { label: '学习提示', tone: 'success' },
  warning: { label: '注意', tone: 'warning' },
  recap: { label: '小结', tone: 'default' },
  concept: { label: '核心概念', tone: 'primary' },
  analogy: { label: '生活类比', tone: 'success' },
  pitfall: { label: '常见误区', tone: 'warning' },
}

export function getLessonBlockMeta(type: SectionType) {
  return lessonBlockMeta[type]
}

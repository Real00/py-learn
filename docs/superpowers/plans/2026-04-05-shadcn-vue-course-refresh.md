# Shadcn-vue 界面迁移与课程内容扩充实施计划

> **给代理执行者：** 必须使用子技能 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans` 按任务逐项执行。以下步骤使用复选框 `- [ ]` 语法追踪。

**目标：** 在保持 8 章学习路径不变的前提下，把前端迁到真正的 `shadcn-vue` 风格组件体系，并把每章扩成适合零基础成年人的完整入门课单元。

**架构：** 后端继续保留现有 Flask API 入口，只扩展章节内容 schema；前端继续保留 Vue + Pinia + Router 结构，但把页面 UI 改成由 `shadcn-vue` 风格基础组件和课程域组件组合而成。章节内容仍由 JSON 驱动，新增 `practiceTasks` 和 `reviewChecklist` 顶层字段，`sections` 负责主线教学叙事。

**技术栈：** Flask、pytest、Vue 3、Pinia、Vue Router、Vitest、Tailwind CSS v4、shadcn-vue、reka-ui

---

## 文件结构

### 后端

- 修改：`backend/app/schemas/course_schema.py`
  负责章节详情 schema 校验，新增 `practiceTasks`、`reviewChecklist` 和更丰富的 section type 校验。
- 修改：`tests/backend/test_api.py`
  负责 API 层回归测试，验证扩容后的章节字段与题量。
- 新建：`tests/backend/test_content_schema.py`
  负责纯 schema 校验测试，避免只有 API 层才发现内容格式错误。

### 前端数据与测试基础

- 修改：`frontend/src/entities/content/model/types.ts`
  扩展章节类型、练习任务类型、复习清单类型。
- 新建：`frontend/src/entities/content/model/lesson-blocks.ts`
  负责 section type 到课程块文案与视觉语义的映射。
- 新建：`frontend/src/entities/content/model/lesson-blocks.test.ts`
  验证课程块映射逻辑。
- 修改：`frontend/vitest.config.ts`
  为后续页面级测试接入 Vue SFC 支持。

### 前端 UI 基础层

- 修改：`frontend/src/style.css`
  调整主题变量、字体、背景和课程产品感视觉基调。
- 修改：`frontend/src/shared/ui/button/Button.vue`
- 修改：`frontend/src/shared/ui/badge/PillBadge.vue`
- 修改：`frontend/src/shared/ui/card/CardSurface.vue`
- 修改：`frontend/src/shared/ui/progress/ProgressMeter.vue`
  将现有自定义基础组件改成更贴近 `shadcn-vue` 的实现与 API。
- 新建：`frontend/src/shared/ui/separator/Separator.vue`
- 新建：`frontend/src/shared/ui/accordion/Accordion.vue`
- 新建：`frontend/src/shared/ui/input/Input.vue`
- 新建：`frontend/src/shared/ui/textarea/Textarea.vue`
- 新建：`frontend/src/shared/ui/radio-group/RadioGroup.vue`
  补齐章节页、测验页需要的基础交互组件。

### 前端课程域组件与页面

- 新建：`frontend/src/components/course/ChapterHero.vue`
- 新建：`frontend/src/components/course/LearningGoalsCard.vue`
- 新建：`frontend/src/components/course/LessonBlock.vue`
- 新建：`frontend/src/components/course/PracticeTaskCard.vue`
- 新建：`frontend/src/components/course/ReviewChecklistCard.vue`
- 修改：`frontend/src/components/course/ChapterCard.vue`
- 修改：`frontend/src/components/course/LessonSectionCard.vue`
- 修改：`frontend/src/components/course/QuizQuestionCard.vue`
- 修改：`frontend/src/app/pages/HomePage.vue`
- 修改：`frontend/src/app/pages/CoursePage.vue`
- 修改：`frontend/src/app/pages/ChapterPage.vue`
- 修改：`frontend/src/app/pages/ReviewPage.vue`
- 修改：`frontend/src/app/pages/ProgressPage.vue`

### 前端页面模型测试

- 新建：`frontend/src/app/pages/home-page.model.ts`
- 新建：`frontend/src/app/pages/home-page.model.test.ts`
- 新建：`frontend/src/app/pages/chapter-page.model.ts`
- 新建：`frontend/src/app/pages/chapter-page.model.test.ts`
  把页面组合逻辑从 SFC 中抽出来，降低页面测试复杂度。

### 内容与文档

- 修改：`backend/content/course.json`
  更新章节时长与摘要，使其反映扩容后的课程密度。
- 修改：`backend/content/chapters/python-overview.json`
- 修改：`backend/content/chapters/variables-and-types.json`
- 修改：`backend/content/chapters/input-and-output.json`
- 修改：`backend/content/chapters/conditions.json`
- 修改：`backend/content/chapters/loops.json`
- 修改：`backend/content/chapters/functions.json`
- 修改：`backend/content/chapters/lists-and-dicts.json`
- 修改：`backend/content/chapters/mini-project.json`
  为每章补齐更丰富的 sections、practiceTasks、reviewChecklist、quiz。
- 修改：`docs/content-model.md`
  用中文更新内容模型说明。

## 任务 1：扩展后端章节 schema 并补纯校验测试

**Files:**
- Modify: `backend/app/schemas/course_schema.py`
- Create: `tests/backend/test_content_schema.py`
- Test: `tests/backend/test_content_schema.py`

- [ ] **Step 1: 先写失败的 schema 测试**

```python
import pytest

from app.schemas.course_schema import ContentValidationError, validate_chapter_detail


def build_valid_chapter() -> dict:
    return {
        "slug": "python-overview",
        "order": 1,
        "title": "Python 到底是什么",
        "summary": "测试章节",
        "estimatedMinutes": 18,
        "difficultyLabel": "轻松入门",
        "prerequisiteSlug": None,
        "tags": ["认识 Python"],
        "learningGoals": ["知道 Python 是什么"],
        "summaryPoints": ["Python 是编程语言"],
        "sections": [
            {
                "id": "overview-concept",
                "type": "concept",
                "title": "什么是编程语言",
                "content": "编程语言是告诉电脑做事的规则。",
            }
        ],
        "practiceTasks": [
            {
                "id": "practice-1",
                "title": "说出 print 的作用",
                "prompt": "用一句话解释 print() 用来做什么。",
                "hints": ["想想代码把什么显示到了屏幕上"],
                "expectedOutcome": "能说出 print() 用来输出内容。",
            }
        ],
        "reviewChecklist": [
            {"id": "review-1", "text": "我知道 Python 是编程语言，不是软件名称。"},
        ],
        "quiz": [
            {
                "id": "q1",
                "type": "single_choice",
                "prompt": "Python 是什么？",
                "options": ["编程语言", "数据库"],
                "answer": "编程语言",
                "explanation": "Python 是编程语言。",
                "knowledgePoint": "编程语言",
            }
        ],
    }


def test_chapter_detail_requires_practice_tasks_and_review_checklist():
    chapter = build_valid_chapter()
    del chapter["practiceTasks"]

    with pytest.raises(ContentValidationError, match="practiceTasks"):
        validate_chapter_detail(chapter)


def test_chapter_detail_rejects_unknown_section_type():
    chapter = build_valid_chapter()
    chapter["sections"][0]["type"] = "story"

    with pytest.raises(ContentValidationError, match="unknown section type"):
        validate_chapter_detail(chapter)
```

- [ ] **Step 2: 运行测试，确认它失败**

Run: `backend\.venv\Scripts\pytest.exe tests/backend/test_content_schema.py -v`

Expected: FAIL，报错指出 `validate_chapter_detail()` 还没有要求 `practiceTasks` / `reviewChecklist`，且没有校验 section type。

- [ ] **Step 3: 实现最小 schema 扩展**

```python
from typing import Any


SECTION_TYPES = {
    "intro",
    "explanation",
    "example",
    "tip",
    "warning",
    "recap",
    "concept",
    "analogy",
    "pitfall",
}


def require_non_empty_list(value: Any, *, context: str) -> list[Any]:
    if not isinstance(value, list) or not value:
        raise ContentValidationError(f"{context} must be a non-empty list")
    return value


def validate_section(section: dict[str, Any], *, slug: str) -> None:
    require_keys(section, ["id", "type", "title", "content"], context=f"chapter {slug} section")
    if section["type"] not in SECTION_TYPES:
        raise ContentValidationError(f"chapter {slug} has unknown section type: {section['type']}")


def validate_practice_task(task: dict[str, Any], *, slug: str) -> None:
    require_keys(task, ["id", "title", "prompt", "hints", "expectedOutcome"], context=f"chapter {slug} practice task")
    require_non_empty_list(task["hints"], context=f"chapter {slug} practice task hints")


def validate_review_item(item: dict[str, Any], *, slug: str) -> None:
    require_keys(item, ["id", "text"], context=f"chapter {slug} review checklist item")


def validate_chapter_detail(data: dict[str, Any]) -> dict[str, Any]:
    require_keys(
        data,
        [
            "slug",
            "order",
            "title",
            "summary",
            "estimatedMinutes",
            "difficultyLabel",
            "prerequisiteSlug",
            "tags",
            "learningGoals",
            "summaryPoints",
            "sections",
            "practiceTasks",
            "reviewChecklist",
            "quiz",
        ],
        context="chapter detail",
    )

    sections = require_non_empty_list(data["sections"], context=f"chapter {data['slug']} sections")
    for section in sections:
        validate_section(section, slug=data["slug"])

    for task in require_non_empty_list(data["practiceTasks"], context=f"chapter {data['slug']} practiceTasks"):
        validate_practice_task(task, slug=data["slug"])

    for item in require_non_empty_list(data["reviewChecklist"], context=f"chapter {data['slug']} reviewChecklist"):
        validate_review_item(item, slug=data["slug"])

    require_non_empty_list(data["quiz"], context=f"chapter {data['slug']} quiz")
    return data
```

- [ ] **Step 4: 再跑一遍后端 schema 测试**

Run: `backend\.venv\Scripts\pytest.exe tests/backend/test_content_schema.py -v`

Expected: PASS，两个新增测试均通过。

- [ ] **Step 5: 提交这一小步**

```bash
git add backend/app/schemas/course_schema.py tests/backend/test_content_schema.py
git commit -m "test: cover expanded chapter content schema"
```

## 任务 2：更新前端内容类型与课程块映射

**Files:**
- Modify: `frontend/src/entities/content/model/types.ts`
- Create: `frontend/src/entities/content/model/lesson-blocks.ts`
- Create: `frontend/src/entities/content/model/lesson-blocks.test.ts`
- Modify: `frontend/vitest.config.ts`
- Test: `frontend/src/entities/content/model/lesson-blocks.test.ts`

- [ ] **Step 1: 先写失败的前端模型测试**

```ts
import { describe, expect, it } from 'vitest'

import { getLessonBlockMeta } from '@/entities/content/model/lesson-blocks'

describe('lesson block meta', () => {
  it('maps concept blocks to a readable label', () => {
    expect(getLessonBlockMeta('concept')).toEqual({
      label: '核心概念',
      tone: 'primary',
    })
  })

  it('maps pitfall blocks to a warning tone', () => {
    expect(getLessonBlockMeta('pitfall')).toEqual({
      label: '常见误区',
      tone: 'warning',
    })
  })
})
```

- [ ] **Step 2: 运行测试，确认它失败**

Run: `pnpm --dir frontend test -- src/entities/content/model/lesson-blocks.test.ts`

Expected: FAIL，提示 `lesson-blocks.ts` 不存在。

- [ ] **Step 3: 扩展类型与映射实现**

```ts
export type SectionType =
  | 'intro'
  | 'explanation'
  | 'example'
  | 'tip'
  | 'warning'
  | 'recap'
  | 'concept'
  | 'analogy'
  | 'pitfall'

export interface PracticeTask {
  id: string
  title: string
  prompt: string
  hints: string[]
  expectedOutcome: string
}

export interface ReviewChecklistItem {
  id: string
  text: string
}

export interface ChapterDetail extends CourseChapterSummary {
  learningGoals: string[]
  summaryPoints: string[]
  sections: ChapterSection[]
  practiceTasks: PracticeTask[]
  reviewChecklist: ReviewChecklistItem[]
  quiz: QuizQuestion[]
}
```

```ts
import type { SectionType } from '@/entities/content/model/types'

const lessonBlockMeta: Record<SectionType, { label: string; tone: 'default' | 'primary' | 'success' | 'warning' }> = {
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
```

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
  },
})
```

- [ ] **Step 4: 再跑一遍前端模型测试**

Run: `pnpm --dir frontend test -- src/entities/content/model/lesson-blocks.test.ts`

Expected: PASS，映射文案和 tone 都正确。

- [ ] **Step 5: 提交这一小步**

```bash
git add frontend/src/entities/content/model/types.ts frontend/src/entities/content/model/lesson-blocks.ts frontend/src/entities/content/model/lesson-blocks.test.ts frontend/vitest.config.ts
git commit -m "feat: add lesson block metadata model"
```

## 任务 3：把基础 UI 层改成 shadcn-vue 风格底座

**Files:**
- Modify: `frontend/src/style.css`
- Modify: `frontend/src/shared/ui/button/Button.vue`
- Modify: `frontend/src/shared/ui/badge/PillBadge.vue`
- Modify: `frontend/src/shared/ui/card/CardSurface.vue`
- Modify: `frontend/src/shared/ui/progress/ProgressMeter.vue`
- Create: `frontend/src/shared/ui/separator/Separator.vue`
- Create: `frontend/src/shared/ui/accordion/Accordion.vue`
- Create: `frontend/src/shared/ui/input/Input.vue`
- Create: `frontend/src/shared/ui/textarea/Textarea.vue`
- Create: `frontend/src/shared/ui/radio-group/RadioGroup.vue`
- Test: `frontend/src/shared/ui/button/Button.test.ts`

- [ ] **Step 1: 先写一个失败的基础组件测试**

```ts
import { describe, expect, it } from 'vitest'

import { buttonVariants } from '@/shared/ui/button/Button.vue'

describe('button variants', () => {
  it('builds secondary button classes', () => {
    expect(buttonVariants({ variant: 'secondary' })).toContain('border')
  })
})
```

- [ ] **Step 2: 运行测试，确认它失败**

Run: `pnpm --dir frontend test -- src/shared/ui/button/Button.test.ts`

Expected: FAIL，提示 `buttonVariants` 没有导出，说明现在组件仍是封闭式实现。

- [ ] **Step 3: 重写基础组件和主题变量**

```vue
<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/shared/lib/utils'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] shadow-sm hover:brightness-105',
        secondary: 'border border-[color:var(--color-border)] bg-white text-[color:var(--color-foreground)] hover:bg-[color:var(--color-secondary)]',
        ghost: 'bg-transparent text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-secondary)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface Props extends VariantProps<typeof buttonVariants> {
  as?: string
  class?: string
}
</script>
```

```css
@theme {
  --font-display: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --font-body: "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  --color-background: #f8fbff;
  --color-foreground: #17324d;
  --color-primary: #0f7bff;
  --color-primary-foreground: #f8fbff;
  --color-secondary: #eaf4ff;
  --color-secondary-foreground: #20405d;
  --color-muted: #d9e8f7;
  --color-muted-foreground: #59748f;
  --color-border: rgba(84, 128, 173, 0.22);
  --color-ring: rgba(15, 123, 255, 0.22);
  --shadow-soft: 0 24px 50px rgba(15, 123, 255, 0.08);
}
```

```vue
<template>
  <input
    v-bind="$attrs"
    :class="cn('flex h-10 w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm outline-none placeholder:text-[color:var(--color-muted-foreground)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]', $attrs.class)"
  />
</template>
```

- [ ] **Step 4: 再跑一遍基础组件测试**

Run: `pnpm --dir frontend test -- src/shared/ui/button/Button.test.ts`

Expected: PASS，`buttonVariants` 可导出且 secondary 变体包含边框类名。

- [ ] **Step 5: 提交这一小步**

```bash
git add frontend/src/style.css frontend/src/shared/ui/button/Button.vue frontend/src/shared/ui/badge/PillBadge.vue frontend/src/shared/ui/card/CardSurface.vue frontend/src/shared/ui/progress/ProgressMeter.vue frontend/src/shared/ui/separator/Separator.vue frontend/src/shared/ui/accordion/Accordion.vue frontend/src/shared/ui/input/Input.vue frontend/src/shared/ui/textarea/Textarea.vue frontend/src/shared/ui/radio-group/RadioGroup.vue frontend/src/shared/ui/button/Button.test.ts
git commit -m "feat: migrate base ui primitives to shadcn style"
```

## 任务 4：重做页面模型与课程页面结构

**Files:**
- Create: `frontend/src/app/pages/home-page.model.ts`
- Create: `frontend/src/app/pages/home-page.model.test.ts`
- Create: `frontend/src/app/pages/chapter-page.model.ts`
- Create: `frontend/src/app/pages/chapter-page.model.test.ts`
- Create: `frontend/src/components/course/ChapterHero.vue`
- Create: `frontend/src/components/course/LearningGoalsCard.vue`
- Create: `frontend/src/components/course/LessonBlock.vue`
- Create: `frontend/src/components/course/PracticeTaskCard.vue`
- Create: `frontend/src/components/course/ReviewChecklistCard.vue`
- Modify: `frontend/src/components/course/ChapterCard.vue`
- Modify: `frontend/src/components/course/LessonSectionCard.vue`
- Modify: `frontend/src/components/course/QuizQuestionCard.vue`
- Modify: `frontend/src/app/pages/HomePage.vue`
- Modify: `frontend/src/app/pages/CoursePage.vue`
- Modify: `frontend/src/app/pages/ChapterPage.vue`
- Modify: `frontend/src/app/pages/ReviewPage.vue`
- Modify: `frontend/src/app/pages/ProgressPage.vue`
- Test: `frontend/src/app/pages/home-page.model.test.ts`
- Test: `frontend/src/app/pages/chapter-page.model.test.ts`

- [ ] **Step 1: 先写两个失败的页面模型测试**

```ts
import { describe, expect, it } from 'vitest'

import { buildHomePageState } from '@/app/pages/home-page.model'

describe('buildHomePageState', () => {
  it('prefers the current chapter for the continue CTA', () => {
    const state = buildHomePageState(
      [{ slug: 'intro', order: 1, title: 'Intro', summary: '从零开始认识编程', estimatedMinutes: 10, difficultyLabel: '轻松', prerequisiteSlug: null, tags: [] }],
      { currentChapterSlug: 'intro', chapterRecords: {}, version: 'v1' },
    )

    expect(state.continueLabel).toBe('继续上次学习')
    expect(state.continueLink).toBe('/course/intro')
  })
})
```

```ts
import { describe, expect, it } from 'vitest'

import { buildChapterPageState } from '@/app/pages/chapter-page.model'

describe('buildChapterPageState', () => {
  it('splits chapter detail into lesson, practice, and review surfaces', () => {
    const state = buildChapterPageState({
      slug: 'python-overview',
      order: 1,
      title: 'Python 到底是什么',
      summary: '先认识 Python 是做什么的。',
      estimatedMinutes: 18,
      difficultyLabel: '轻松入门',
      prerequisiteSlug: null,
      tags: ['认识 Python'],
      learningGoals: ['知道 Python 是编程语言'],
      summaryPoints: ['Python 是编程语言'],
      sections: [{ id: 's1', type: 'concept', title: '概念', content: '编程语言是告诉电脑做事的规则。' }],
      practiceTasks: [{ id: 'p1', title: '练习', prompt: '用自己的话解释 Python 是什么。', hints: ['先说它是不是软件'], expectedOutcome: '能说出 Python 是编程语言。' }],
      reviewChecklist: [{ id: 'r1', text: '我能解释 Python 的作用。' }],
      quiz: [],
    })

    expect(state.lessonBlocks).toHaveLength(1)
    expect(state.practiceTasks).toHaveLength(1)
    expect(state.reviewChecklist).toHaveLength(1)
  })
})
```

- [ ] **Step 2: 运行测试，确认它失败**

Run: `pnpm --dir frontend test -- src/app/pages/home-page.model.test.ts src/app/pages/chapter-page.model.test.ts`

Expected: FAIL，提示页面模型文件不存在。

- [ ] **Step 3: 实现页面模型和页面迁移**

```ts
import type { CourseChapterSummary, ChapterDetail, LearningProgress } from '@/entities/content/model/types'

export function buildHomePageState(chapters: CourseChapterSummary[], progress: LearningProgress) {
  const totalChapters = chapters.length
  const completedCount = Object.values(progress.chapterRecords).filter((record) => record.completed).length

  return {
    totalChapters,
    completedCount,
    progressRatio: totalChapters === 0 ? 0 : completedCount / totalChapters,
    highlightedChapters: chapters.slice(0, 4),
    continueLink: progress.currentChapterSlug ? `/course/${progress.currentChapterSlug}` : '/course',
    continueLabel: progress.currentChapterSlug ? '继续上次学习' : '从第一章开始',
  }
}

export function buildChapterPageState(chapter: ChapterDetail) {
  return {
    hero: {
      title: chapter.title,
      summary: chapter.summary,
      estimatedMinutes: chapter.estimatedMinutes,
      difficultyLabel: chapter.difficultyLabel,
      tags: chapter.tags,
    },
    lessonBlocks: chapter.sections,
    practiceTasks: chapter.practiceTasks,
    reviewChecklist: chapter.reviewChecklist,
    summaryPoints: chapter.summaryPoints,
  }
}
```

```vue
<template>
  <CardSurface class="p-6">
    <div class="flex items-center gap-2">
      <PillBadge>{{ hero.difficultyLabel }}</PillBadge>
      <PillBadge tone="success">预计 {{ hero.estimatedMinutes }} 分钟</PillBadge>
    </div>
    <h1 class="mt-4 text-3xl font-semibold text-[color:var(--color-foreground)]">{{ hero.title }}</h1>
    <p class="mt-3 text-sm leading-7 text-[color:var(--color-muted-foreground)]">{{ hero.summary }}</p>
  </CardSurface>
</template>
```

```vue
<template>
  <div class="space-y-6">
    <ChapterHero :hero="pageState.hero" />
    <LearningGoalsCard :goals="chapter.learningGoals" />
    <LessonBlock v-for="section in pageState.lessonBlocks" :key="section.id" :section="section" />
    <PracticeTaskCard v-for="task in pageState.practiceTasks" :key="task.id" :task="task" />
    <ReviewChecklistCard :items="pageState.reviewChecklist" />
    <CardSurface class="p-5">
      <Button as="a" :href="`/review/${chapter.slug}`" class="w-full">进入本章测验</Button>
    </CardSurface>
  </div>
</template>
```

- [ ] **Step 4: 运行页面模型测试**

Run: `pnpm --dir frontend test -- src/app/pages/home-page.model.test.ts src/app/pages/chapter-page.model.test.ts`

Expected: PASS，模型输出和页面组合边界正确。

- [ ] **Step 5: 提交这一小步**

```bash
git add frontend/src/app/pages/home-page.model.ts frontend/src/app/pages/home-page.model.test.ts frontend/src/app/pages/chapter-page.model.ts frontend/src/app/pages/chapter-page.model.test.ts frontend/src/components/course/ChapterHero.vue frontend/src/components/course/LearningGoalsCard.vue frontend/src/components/course/LessonBlock.vue frontend/src/components/course/PracticeTaskCard.vue frontend/src/components/course/ReviewChecklistCard.vue frontend/src/components/course/ChapterCard.vue frontend/src/components/course/LessonSectionCard.vue frontend/src/components/course/QuizQuestionCard.vue frontend/src/app/pages/HomePage.vue frontend/src/app/pages/CoursePage.vue frontend/src/app/pages/ChapterPage.vue frontend/src/app/pages/ReviewPage.vue frontend/src/app/pages/ProgressPage.vue
git commit -m "feat: redesign course pages around lesson blocks"
```

## 任务 5：扩充 8 章内容、更新 API 断言并完成全量验证

**Files:**
- Modify: `backend/content/course.json`
- Modify: `backend/content/chapters/python-overview.json`
- Modify: `backend/content/chapters/variables-and-types.json`
- Modify: `backend/content/chapters/input-and-output.json`
- Modify: `backend/content/chapters/conditions.json`
- Modify: `backend/content/chapters/loops.json`
- Modify: `backend/content/chapters/functions.json`
- Modify: `backend/content/chapters/lists-and-dicts.json`
- Modify: `backend/content/chapters/mini-project.json`
- Modify: `tests/backend/test_api.py`
- Modify: `docs/content-model.md`
- Test: `tests/backend/test_api.py`
- Test: `frontend/src/features/progress/model/storage.test.ts`

- [ ] **Step 1: 先写失败的 API 断言**

```python
def test_chapter_quiz_endpoint_returns_richer_questions():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/functions/quiz")
    data = response.get_json()

    assert response.status_code == 200
    assert data["slug"] == "functions"
    assert len(data["quiz"]) >= 6


def test_chapter_detail_contains_practice_and_review_fields():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/python-overview")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data["practiceTasks"]) >= 2
    assert len(data["reviewChecklist"]) >= 3
```

- [ ] **Step 2: 运行后端 API 测试，确认它失败**

Run: `backend\.venv\Scripts\pytest.exe tests/backend/test_api.py -v`

Expected: FAIL，原因是现有 JSON 仍只有 3 道题，且没有 `practiceTasks` / `reviewChecklist`。

- [ ] **Step 3: 按统一模板扩写 8 章内容并更新中文文档**

```json
{
  "slug": "python-overview",
  "order": 1,
  "title": "Python 到底是什么",
  "summary": "先认识 Python 是做什么的，以及你为什么适合从它开始学。",
  "estimatedMinutes": 18,
  "difficultyLabel": "轻松入门",
  "prerequisiteSlug": null,
  "tags": ["认识 Python", "建立信心"],
  "learningGoals": [
    "知道 Python 是一种编程语言",
    "理解编程语言的作用是告诉电脑做事",
    "建立“我也能学会”的第一层信心"
  ],
  "summaryPoints": [
    "Python 是一种让人比较容易读懂的编程语言。",
    "学习 Python，本质上是在学习如何把步骤说清楚。",
    "先理解主线，再通过例子和练习逐步加深。"
  ],
  "sections": [
    { "id": "overview-concept", "type": "concept", "title": "编程语言到底是什么", "content": "编程语言是一套把人类想法翻译成电脑可执行步骤的规则。" },
    { "id": "overview-analogy", "type": "analogy", "title": "把电脑当成听指令的助手", "content": "电脑像一个执行力很强但不会猜意思的助手，你必须把步骤说清楚，它才会照做。" },
    { "id": "overview-example", "type": "example", "title": "第一段 Python 代码", "content": "通过 print()，你可以让程序把一句话直接显示在屏幕上。", "exampleTitle": "最简单的输出", "exampleCode": "print(\"你好，Python\")" },
    { "id": "overview-pitfall", "type": "pitfall", "title": "新手最容易误会的地方", "content": "很多人误以为学编程就是背术语，其实入门阶段更重要的是先看懂“代码是在让电脑做什么”。" },
    { "id": "overview-recap", "type": "recap", "title": "这一章先记住什么", "content": "先记住 Python 是一种编程语言，学习它是在训练自己把步骤表达清楚。" }
  ],
  "practiceTasks": [
    { "id": "practice-1", "title": "用自己的话解释 Python", "prompt": "用一句话向朋友解释 Python 是什么，不要只说它很厉害。", "hints": ["先说它是不是软件"], "expectedOutcome": "能用一句话解释 Python 是编程语言。" },
    { "id": "practice-2", "title": "读懂第一段输出代码", "prompt": "读 `print(\"你好，Python\")` 这段代码，并说出它运行后屏幕会出现什么。", "hints": ["观察 print() 里的内容"], "expectedOutcome": "知道代码会把文字显示出来。" }
  ],
  "reviewChecklist": [
    { "id": "review-1", "text": "我知道 Python 是编程语言，不是某个应用软件。" },
    { "id": "review-2", "text": "我知道学习编程是在学怎样把步骤说清楚。" },
    { "id": "review-3", "text": "我知道入门阶段不需要一次懂完所有术语。" }
  ],
  "quiz": [
    { "id": "q1", "type": "single_choice", "prompt": "Python 更接近下面哪种东西？", "options": ["一种告诉电脑做事的语言", "一台新的电脑", "只能做表格的软件"], "answer": "一种告诉电脑做事的语言", "explanation": "Python 是编程语言，不是硬件，也不是单一用途软件。", "knowledgePoint": "编程语言" },
    { "id": "q2", "type": "true_false", "prompt": "学习 Python 的第一天就必须把所有专业术语全部背下来。", "answer": false, "explanation": "入门阶段更重要的是先理解大意和例子，再逐步掌握术语。", "knowledgePoint": "学习节奏" },
    { "id": "q3", "type": "fill_blank", "prompt": "代码 `print(\"你好\")` 的作用，是把内容 ______ 到屏幕上。", "answer": "输出", "explanation": "print() 最常见的作用就是把内容输出到屏幕。", "knowledgePoint": "print" },
    { "id": "q4", "type": "single_choice", "prompt": "下面哪一项不是常见的 Python 学习应用方向？", "options": ["自动化脚本", "网站后端", "给冰箱通电"], "answer": "给冰箱通电", "explanation": "Python 常用于自动化、后端和数据处理，但“给冰箱通电”不是编程应用方向。", "knowledgePoint": "应用场景" },
    { "id": "q5", "type": "true_false", "prompt": "闹钟响铃、计算器出结果，都可以理解成程序按规则工作。", "answer": true, "explanation": "这些都属于程序按照规则接收输入并给出结果的例子。", "knowledgePoint": "程序" },
    { "id": "q6", "type": "fill_blank", "prompt": "电脑不会猜你真正想表达什么，它只会按照你写下的 ______ 执行。", "answer": "规则", "explanation": "编程的核心之一，就是把规则写清楚给电脑执行。", "knowledgePoint": "计算机执行方式" }
  ]
}
```

```markdown
# 内容模型说明

## 课程总览

`backend/content/course.json` 保存课程级别信息与章节目录。

- `slug`
- `title`
- `subtitle`
- `description`
- `version`
- `chapters[]`

## 章节详情

每个章节一个 JSON 文件，保存在 `backend/content/chapters/`。

- `learningGoals`
- `summaryPoints`
- `sections[]`
- `practiceTasks[]`
- `reviewChecklist[]`
- `quiz[]`
```

这一任务执行时要对 8 个章节全部做同档扩充，遵循同一模板：

- 每章 `sections` 扩到 8 至 10 个
- 每章 `practiceTasks` 至少 2 个
- 每章 `reviewChecklist` 至少 3 条
- 每章 `quiz` 扩到 6 至 8 题
- `course.json` 中所有 `estimatedMinutes` 按新密度上调

- [ ] **Step 4: 跑完整验证**

Run: `backend\.venv\Scripts\pytest.exe tests/backend -v`

Expected: PASS，后端 API 和 schema 测试全部通过。

Run: `pnpm --dir frontend test`

Expected: PASS，前端模型测试和既有 store 测试全部通过。

Run: `pnpm --dir frontend build`

Expected: PASS，输出 `dist/` 构建结果且无类型错误。

- [ ] **Step 5: 提交这一小步**

```bash
git add backend/content/course.json backend/content/chapters/python-overview.json backend/content/chapters/variables-and-types.json backend/content/chapters/input-and-output.json backend/content/chapters/conditions.json backend/content/chapters/loops.json backend/content/chapters/functions.json backend/content/chapters/lists-and-dicts.json backend/content/chapters/mini-project.json tests/backend/test_api.py docs/content-model.md
git commit -m "feat: expand beginner python course content"
```

## 自检

### Spec 覆盖检查

- `shadcn-vue` UI 迁移：由任务 3 和任务 4 覆盖。
- 页面重做：首页、目录页、章节页、测验页、进度页由任务 4 覆盖。
- 内容模型扩充：任务 1、任务 2、任务 5 覆盖。
- 8 章全部扩容：任务 5 覆盖。
- 中文文档更新：任务 5 覆盖。
- 测试与构建验证：任务 1、2、3、4、5 的运行步骤覆盖。

### 占位检查

- 没有保留 `TODO` / `TBD` / “之后再补” 类占位词。
- 每个任务都有明确文件路径、测试命令、期望结果和提交命令。
- 章节内容扩写任务给出了统一 JSON 模板和明确的数量约束，避免实现时随意发挥。

### 类型一致性检查

- 后端与前端统一使用 `practiceTasks` 和 `reviewChecklist` 作为新增顶层字段。
- `sections` 保持主线教学块，新增 `concept`、`analogy`、`pitfall` 三种类型。
- 页面模型、课程块映射和后端 schema 使用同一套字段命名。

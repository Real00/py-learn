# UI 细节优化与第一章内容扩充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把课程站点收敛到更专业的冷静学院风，修复首页和进度页的关键交互问题，并扩充第一章中“Python 可以做什么”的内容。

**Architecture:** 本轮不改接口和路由，只在现有 Vue 页面与后端 JSON 内容上做增量优化。前端通过主题变量、首页页面模型和局部页面布局修正视觉与交互；后端继续沿用现有 schema，只更新第一章内容数据并靠现有 API / schema 测试回归。

**Tech Stack:** Flask、pytest、Vue 3、Pinia、Vue Router、Vitest、Tailwind CSS v4

---

## 文件结构

- 修改：`frontend/src/style.css`
  负责全局色板、背景、卡片层级和整体视觉基调。
- 修改：`frontend/src/shared/ui/badge/PillBadge.vue`
  负责状态标签的单行显示、不可压缩和 tone 视觉统一。
- 修改：`frontend/src/app/pages/home-page.model.ts`
  负责首页学习路线的数据结构，增加“是否已解锁”和链接信息。
- 修改：`frontend/src/app/pages/home-page.model.test.ts`
  负责首页学习路线卡片的交互规则测试。
- 修改：`frontend/src/app/pages/HomePage.vue`
  负责学习路线整卡点击与未解锁态展示。
- 修改：`frontend/src/app/pages/ProgressPage.vue`
  负责进度页章节卡的稳定布局与状态标签位置。
- 修改：`backend/content/chapters/python-overview.json`
  负责第一章新增“Python 可以做什么”的解释、练习、复习项和测验题。
- 修改：`tests/backend/test_api.py`
  负责断言第一章扩容后的字段和题量。

## Task 1: 首页学习路线建模与点击规则

**Files:**
- Modify: `frontend/src/app/pages/home-page.model.ts`
- Modify: `frontend/src/app/pages/home-page.model.test.ts`
- Test: `frontend/src/app/pages/home-page.model.test.ts`

- [ ] **Step 1: 先写失败的模型测试**

```ts
import { describe, expect, it } from 'vitest'

import { buildHomePageState } from '@/app/pages/home-page.model'

describe('buildHomePageState', () => {
  it('marks unlocked highlighted chapters with direct links', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python 是什么',
          estimatedMinutes: 18,
          difficultyLabel: '轻松入门',
          prerequisiteSlug: null,
          tags: ['认识 Python'],
        },
        {
          slug: 'variables-and-types',
          order: 2,
          title: '变量和数据类型',
          summary: '学会保存数据',
          estimatedMinutes: 20,
          difficultyLabel: '逐步上手',
          prerequisiteSlug: 'python-overview',
          tags: ['变量'],
        },
      ],
      {
        version: '1.1.0',
        currentChapterSlug: 'variables-and-types',
        chapterRecords: {
          'python-overview': {
            chapterSlug: 'python-overview',
            completed: true,
            score: 100,
            answers: {},
            lastVisitedAt: '2026-04-05T09:00:00.000Z',
            completedAt: '2026-04-05T09:05:00.000Z',
          },
        },
      },
    )

    expect(state.highlightedChapters[0]).toMatchObject({
      slug: 'python-overview',
      unlocked: true,
      link: '/course/python-overview',
    })
    expect(state.highlightedChapters[1]).toMatchObject({
      slug: 'variables-and-types',
      unlocked: true,
      link: '/course/variables-and-types',
    })
  })

  it('keeps locked highlighted chapters non-clickable', () => {
    const state = buildHomePageState(
      [
        {
          slug: 'python-overview',
          order: 1,
          title: 'Python 到底是什么',
          summary: '认识 Python 是什么',
          estimatedMinutes: 18,
          difficultyLabel: '轻松入门',
          prerequisiteSlug: null,
          tags: ['认识 Python'],
        },
        {
          slug: 'variables-and-types',
          order: 2,
          title: '变量和数据类型',
          summary: '学会保存数据',
          estimatedMinutes: 20,
          difficultyLabel: '逐步上手',
          prerequisiteSlug: 'python-overview',
          tags: ['变量'],
        },
      ],
      {
        version: '1.1.0',
        currentChapterSlug: null,
        chapterRecords: {},
      },
    )

    expect(state.highlightedChapters[1]).toMatchObject({
      unlocked: false,
      link: '/course',
    })
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm --dir frontend test -- src/app/pages/home-page.model.test.ts`
Expected: FAIL，提示 `highlightedChapters` 还没有 `unlocked` 和 `link` 字段。

- [ ] **Step 3: 实现最小页面模型**

```ts
import type { CourseChapterSummary, LearningProgress } from '@/entities/content/model/types'

interface HomeHighlightedChapter extends CourseChapterSummary {
  unlocked: boolean
  link: string
}

function isChapterUnlocked(chapter: CourseChapterSummary, progress: LearningProgress) {
  if (!chapter.prerequisiteSlug) {
    return true
  }

  return Boolean(progress.chapterRecords[chapter.prerequisiteSlug]?.completed)
}

export function buildHomePageState(chapters: CourseChapterSummary[], progress: LearningProgress) {
  const totalChapters = chapters.length
  const completedCount = Object.values(progress.chapterRecords).filter((record) => record.completed).length

  const highlightedChapters: HomeHighlightedChapter[] = chapters.slice(0, 4).map((chapter) => {
    const unlocked = isChapterUnlocked(chapter, progress)

    return {
      ...chapter,
      unlocked,
      link: unlocked ? `/course/${chapter.slug}` : '/course',
    }
  })

  return {
    totalChapters,
    completedCount,
    progressRatio: totalChapters === 0 ? 0 : completedCount / totalChapters,
    highlightedChapters,
    continueLink: progress.currentChapterSlug ? `/course/${progress.currentChapterSlug}` : '/course',
    continueLabel: progress.currentChapterSlug ? '继续上次学习' : '从第一章开始',
  }
}
```

- [ ] **Step 4: 再跑一遍测试确认通过**

Run: `pnpm --dir frontend test -- src/app/pages/home-page.model.test.ts`
Expected: PASS。

## Task 2: 主题、徽章和页面布局优化

**Files:**
- Modify: `frontend/src/style.css`
- Modify: `frontend/src/shared/ui/badge/PillBadge.vue`
- Modify: `frontend/src/app/pages/HomePage.vue`
- Modify: `frontend/src/app/pages/ProgressPage.vue`
- Test: `pnpm --dir frontend test`

- [ ] **Step 1: 先补上会失败的标签类名测试**

```ts
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PillBadge from '@/shared/ui/badge/PillBadge.vue'

describe('PillBadge', () => {
  it('keeps badges on a single line', () => {
    const wrapper = mount(PillBadge, {
      props: { tone: 'warning' },
      slots: { default: '进行中' },
    })

    expect(wrapper.classes()).toContain('whitespace-nowrap')
    expect(wrapper.classes()).toContain('shrink-0')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `pnpm --dir frontend test -- src/shared/ui/badge/PillBadge.test.ts`
Expected: FAIL，因为徽章组件还没有这些防挤压类。

- [ ] **Step 3: 实现主题和页面改造**

```vue
const badgeVariants = cva(
  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      tone: {
        default: 'border-[color:var(--color-border-strong)] bg-[color:var(--color-secondary)] text-[color:var(--color-secondary-foreground)]',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        warning: 'border-amber-200 bg-amber-50 text-amber-700',
      },
    },
    defaultVariants: {
      tone: 'default',
    },
  },
)
```

```css
@theme {
  --color-background: #f3f6fb;
  --color-foreground: #1f2f43;
  --color-card: rgba(255, 255, 255, 0.9);
  --color-card-foreground: #1f2f43;
  --color-primary: #315f8f;
  --color-primary-foreground: #f8fbff;
  --color-secondary: #e4edf6;
  --color-secondary-foreground: #28415c;
  --color-muted: #d7e2ee;
  --color-muted-foreground: #62758b;
  --color-border: rgba(92, 116, 145, 0.18);
  --color-border-strong: rgba(92, 116, 145, 0.28);
  --color-ring: rgba(49, 95, 143, 0.24);
  --shadow-soft: 0 22px 48px rgba(31, 47, 67, 0.08);
}
```

```vue
<RouterLink
  v-for="chapter in pageState.highlightedChapters"
  :key="chapter.slug"
  :to="chapter.link"
  class="block"
  :class="chapter.unlocked ? 'cursor-pointer' : 'pointer-events-none'"
>
  <CardSurface
    class="flex items-start gap-4 p-4 transition-all duration-200"
    :class="
      chapter.unlocked
        ? 'border-[color:var(--color-border-strong)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(31,47,67,0.10)]'
        : 'bg-white/65 opacity-75'
    "
  >
    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[color:var(--color-secondary)] text-lg font-semibold text-[color:var(--color-primary)]">
      {{ chapter.order }}
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-start justify-between gap-3">
        <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
        <PillBadge :tone="chapter.unlocked ? 'default' : 'warning'">
          {{ chapter.unlocked ? '可进入' : '待解锁' }}
        </PillBadge>
      </div>
      <p class="mt-1 text-sm leading-6 text-[color:var(--color-muted-foreground)]">{{ chapter.summary }}</p>
    </div>
  </CardSurface>
</RouterLink>
```

```vue
<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
  <div class="min-w-0 flex-1">
    <p class="font-semibold text-[color:var(--color-foreground)]">{{ chapter.title }}</p>
    <p class="mt-1 text-sm text-[color:var(--color-muted-foreground)]">{{ chapter.summary }}</p>
  </div>
  <div class="flex shrink-0 justify-start sm:justify-end">
    <PillBadge :tone="records[chapter.slug]?.completed ? 'success' : 'warning'">
      {{ records[chapter.slug]?.completed ? '已完成' : '进行中' }}
    </PillBadge>
  </div>
</div>
```

- [ ] **Step 4: 跑前端测试确认全部通过**

Run: `pnpm --dir frontend test`
Expected: PASS。

## Task 3: 扩充第一章内容并验证 API 输出

**Files:**
- Modify: `backend/content/chapters/python-overview.json`
- Modify: `tests/backend/test_api.py`
- Test: `backend\.venv\Scripts\pytest.exe tests/backend -v`

- [ ] **Step 1: 先写失败的后端断言**

```python
def test_python_overview_chapter_explains_real_world_python_usage():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/python-overview")
    data = response.get_json()

    assert response.status_code == 200
    assert any(section["id"] == "overview-usage-map" for section in data["sections"])
    assert any("批量整理文件" in section["content"] for section in data["sections"])
    assert any(task["id"] == "overview-practice-3" for task in data["practiceTasks"])
    assert len(data["quiz"]) >= 7
```

- [ ] **Step 2: 运行测试确认失败**

Run: `backend\.venv\Scripts\pytest.exe tests/backend/test_api.py -v`
Expected: FAIL，因为第一章当前还没有新增应用场景块、第三个练习和更高题量。

- [ ] **Step 3: 更新第一章 JSON**

```json
{
  "sections": [
    {
      "id": "overview-usage-map",
      "type": "concept",
      "title": "Python 可以用来做什么",
      "content": "你可以把 Python 理解成一把很通用的工具：有人用它批量整理文件和文件夹，有人用它自动处理重复性的表格工作，有人用它编写网站后端和服务端逻辑，也有人用它做数据清洗、统计、图表和 AI 工具调用。入门时不需要立刻会完这些方向，但知道它们真实存在，会更容易理解你现在学的基础并不是孤立的。",
      "bullets": [
        "自动化：把重复、机械的电脑操作交给程序。",
        "网站后端：处理注册、登录、数据保存和接口响应。",
        "数据处理：清洗数据、统计结果、生成图表。",
        "AI 应用：调用模型、整理输入输出、串起自动流程。"
      ]
    }
  ],
  "practiceTasks": [
    {
      "id": "overview-practice-3",
      "title": "判断哪些事情适合交给 Python",
      "prompt": "看下面几个场景：批量重命名文件、每天复制同一份表格数据、做一个简单网站、给水壶烧水。请说出哪些更适合用 Python 处理，并简单解释原因。",
      "hints": [
        "Python 更适合规则清楚、重复性强、需要电脑自动执行的事情。",
        "不是所有现实问题都靠写代码解决。"
      ],
      "expectedOutcome": "能区分适合编程处理的任务与不属于 Python 使用场景的事情。"
    }
  ]
}
```

- [ ] **Step 4: 跑后端测试确认通过**

Run: `backend\.venv\Scripts\pytest.exe tests/backend -v`
Expected: PASS。

## Self-Review

### Spec coverage

- 视觉收敛：Task 2 覆盖。
- 首页卡片可点击且遵守解锁规则：Task 1 和 Task 2 覆盖。
- 进度页标签防挤压：Task 2 覆盖。
- 第一章扩写 Python 应用场景：Task 3 覆盖。
- 前后端验证：Task 2 与 Task 3 覆盖。

### Placeholder scan

- 没有 `TODO`、`TBD` 或“之后补上”式占位。
- 每个任务都有明确文件、测试命令和预期结果。

### Type consistency

- 首页卡片统一使用 `unlocked` 和 `link`。
- 后端第一章新增内容仍沿用现有 `sections`、`practiceTasks`、`quiz` 结构，没有引入新字段名。

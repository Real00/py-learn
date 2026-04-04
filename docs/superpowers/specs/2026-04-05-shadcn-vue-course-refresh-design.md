# Shadcn-vue UI Migration And Course Content Refresh Design

## Summary

This design upgrades the project from a lightweight prototype into a mobile-first beginner Python course for adults. The work has two tightly coupled goals:

- migrate the frontend UI layer to a real `shadcn-vue`-based component system
- expand the existing 8 chapters into denser learning units without changing chapter count or course order

The target visual direction is bright, light, and mobile-oriented, but not childish. The target learner is a complete beginner adult with no prior programming experience.

## Goals

- Keep the current 8-chapter learning path and route structure.
- Replace the current mostly custom `shared/ui/*` layer with `shadcn-vue`-style components and composition patterns.
- Redesign the core learning pages so they can comfortably hold longer lesson content.
- Expand every chapter from a short overview into a small but complete lesson unit with explanation, examples, practice, review, and quiz.
- Preserve the existing API shape where practical so the upgrade stays incremental.

## Non-Goals

- No CMS, admin editor, or Markdown authoring system.
- No authentication, user accounts, or cloud sync.
- No change to the chapter count or chapter order.
- No conversion into a full desktop-first documentation site.

## Existing State

### Frontend

- The project already includes `shadcn-vue`, `reka-ui`, Tailwind CSS, and a `components.json` file.
- The current UI is still primarily built on custom components under `frontend/src/shared/ui/`.
- Core pages exist for home, course list, chapter detail, review, and progress.
- Current lesson pages are structurally too shallow for long-form learning content.

### Content

- The course currently contains 8 chapters.
- Each chapter detail is JSON-backed and includes `learningGoals`, `summaryPoints`, `sections`, and `quiz`.
- Current content density is too low: chapters are mostly 4 short sections with 3 quiz questions.
- Current frontend types already support richer `sections` fields such as `bullets`, `exampleCode`, and `exampleTitle`.

## Recommended Approach

Use an incremental structural upgrade:

1. keep the current app architecture, routes, and API endpoints
2. migrate the presentation layer to `shadcn-vue` composition
3. extend chapter content shape and rendering so each chapter becomes a complete lesson unit
4. expand all 8 chapters to a consistent higher-density learning format

This avoids a platform rewrite while creating a much better foundation for both the UI and the curriculum.

## Information Architecture

### Course Scope

The course remains an 8-chapter beginner sequence:

1. Python overview
2. Variables and types
3. Input and output
4. Conditions
5. Loops
6. Functions
7. Lists and dictionaries
8. Mini project

### Chapter Density

Each chapter should be upgraded from a short reading into a compact lesson unit for adult beginners. Target density per chapter:

- 8 to 10 content blocks
- 2 to 3 practice tasks
- 1 review checklist
- 6 to 8 quiz questions

Estimated chapter duration in course metadata should be adjusted upward to reflect the denser material.

## UX And Visual Direction

### Visual Tone

- Bright and lightweight, with clear separation between cards and sections.
- Mobile-first educational product feel.
- Friendly and calm rather than playful or childish.
- Strong CTA clarity for continue learning, start quiz, and review progress.

### Layout Principles

- Prioritize narrow-screen readability and thumb-friendly interaction.
- Break long lessons into visually distinct blocks with spacing and hierarchy.
- Keep actions close to the relevant content instead of pushing all controls to the bottom.
- Use summary surfaces, badges, separators, progress indicators, and accordions to reduce visual fatigue.

## Page Design

### Home Page

The home page becomes a true learning entry page instead of a brief overview.

It should include:

- course hero with value proposition
- continue-learning CTA
- progress snapshot
- highlighted lesson path or recommended next chapter
- concise course benefits for anxious beginners

### Course Page

The course page becomes a learning path view.

Each chapter card should communicate:

- chapter order and title
- learning outcome summary
- estimated time
- difficulty label
- completion or unlock state
- number of lesson blocks or practice items

Completed, in-progress, and locked states must be visually distinct without overwhelming the screen.

### Chapter Page

This is the primary upgrade target. The chapter page should be redesigned as a structured lesson reader.

Top section:

- chapter title and summary
- difficulty and duration
- learning goals
- current progress state

Lesson flow:

- concept explanation blocks
- code example blocks
- tips and common-mistake blocks
- practice task blocks
- recap/review section

Bottom section:

- review checklist
- start quiz CTA
- return to course CTA

### Review Page

The review page should feel like a guided checkpoint, not just a form.

It should include:

- clear quiz header and learner context
- question cards with strong answer affordances
- submission validation
- score summary
- brief answer explanations or review cues
- next-step CTA to continue the learning path

### Progress Page

The progress page becomes a lightweight learner dashboard.

It should highlight:

- completed chapter count
- average score
- most recent learning activity
- chapter-by-chapter progress state
- suggested next step

## Component Strategy

### Base Components

Adopt `shadcn-vue` primitives and patterns as the UI foundation, with project-specific composition on top.

Core building blocks:

- button
- card
- badge
- progress
- separator
- accordion
- tabs
- input
- textarea
- radio-group
- skeleton
- alert

### Project-Specific Components

Create course-oriented composed components rather than styling each page inline.

Planned components:

- `ChapterHero`
- `LearningGoalsCard`
- `LessonBlock`
- `CodeExampleCard`
- `PracticeTaskCard`
- `ReviewChecklistCard`
- `QuizPanel`
- `ChapterProgressCard`

These components should live above the base UI layer and reflect the existing app domain instead of becoming a generic design-system fork.

### Shared UI Migration

Current custom components under `frontend/src/shared/ui/` should be evaluated one by one:

- replace directly where an equivalent `shadcn-vue` implementation exists
- keep only thin wrappers when a project-specific API is still useful
- remove duplicated presentational abstractions that no longer add value

The result should be fewer bespoke primitives and more consistent composition.

## Content Model Design

### Principle

Keep JSON as the single content source, but make each chapter detail expressive enough to render a denser lesson.

### Chapter Detail Evolution

The chapter detail model should evolve without abandoning current fields. The design should preserve compatibility where practical while introducing richer structure for the new UI.

Recommended lesson block model for `sections`:

- `concept`: explains a core idea
- `example`: provides code plus explanation
- `analogy`: uses a real-life comparison for beginners
- `tip`: gives practical advice or memory aids
- `pitfall`: highlights common mistakes
- `practice`: provides a small hands-on task
- `recap`: summarizes what matters

Final decision:

- extend `SectionType` to include `concept`, `analogy`, and `pitfall`
- keep `sections` as the ordered main lesson flow
- add `practiceTasks` as a new top-level array
- add `reviewChecklist` as a new top-level array

This keeps the main narrative reading flow separate from hands-on tasks and final review, which makes both authoring and rendering clearer. The current `ChapterSection` shape already supports titles, bullets, and example code, so extending it is lower risk than replacing it wholesale.

### Required Chapter Parts

Each chapter should contain:

- updated `learningGoals`
- expanded `sections`
- updated `summaryPoints`
- `practiceTasks`
- `reviewChecklist`
- expanded `quiz`

`practiceTasks` and `reviewChecklist` are required new top-level fields. Backend schema and frontend types should be updated to validate and render them explicitly.

### Content Writing Rules

All chapters should follow these editorial rules:

- write for complete beginner adults
- use plain Chinese with low jargon density
- explain why a concept matters before going into syntax
- use everyday analogies without sounding childish
- keep code examples short and readable
- include common mistakes that beginners are likely to make
- include quick wins so learners feel momentum

## Backend Design

### API

Preserve the existing API endpoints:

- `GET /api/course`
- `GET /api/course/chapters/<slug>`
- `GET /api/course/chapters/<slug>/quiz`

The course overview endpoint can remain structurally similar, with possible metadata additions such as content density or updated time estimates.

The chapter detail endpoint should return the richer chapter structure needed by the new chapter page.

### Validation

Backend schema validation should be strengthened to cover the expanded content model.

Validation requirements:

- every chapter in `course.json` must still map to a matching JSON file
- required lesson arrays must not be empty
- richer section types must be validated
- practice and review structures must be validated when added
- quiz count should satisfy the new expected range for authored content

Validation should fail early on malformed content rather than letting the frontend discover missing fields at runtime.

## Frontend Data Handling

### Type Updates

Update frontend content types so the new chapter structure is explicit and type-safe.

Likely changes:

- broaden `SectionType`
- extend `ChapterSection`
- add a `PracticeTask` type
- add a `ReviewChecklistItem` type
- update `ChapterDetail`

### Rendering Strategy

The chapter page should render lesson content as a sequence of blocks using a block-to-component mapping. This avoids one-off templates and keeps longer lessons maintainable.

Recommended pattern:

- normalize chapter detail in typed domain objects
- map block type to dedicated Vue components
- keep page-level logic focused on sequencing, progress state, and navigation

## Error Handling

The upgraded app must gracefully handle both network and content-shape problems.

Frontend:

- loading states for course and chapter views
- empty/error states with retry actions
- quiz submission guard when answers are incomplete
- robust rendering when optional fields are missing

Backend:

- clearer schema validation failures
- consistent 404 behavior for missing chapter slugs
- early failures on content mismatch between overview and detail files

## Testing Strategy

### Backend

Add or expand tests to cover:

- all 8 chapters still validate
- chapter detail structure after schema expansion
- quiz payload completeness
- failure cases for malformed content

### Frontend

Run existing build and test suite, and add targeted tests for:

- course page rendering key chapter states
- chapter page rendering richer lesson blocks
- quiz interaction and submission behavior
- progress page rendering with the updated summary surfaces

### Manual Verification

Manual checks should confirm:

- mobile layout remains readable for long chapters
- CTAs remain visible and understandable
- lesson blocks have consistent hierarchy
- visual migration feels cohesive across all pages

## Implementation Boundaries

- Keep the course at 8 chapters.
- Do not add unrelated platform capabilities.
- Do not introduce a separate content-authoring stack.
- Prefer incremental schema evolution over replacing the JSON model.
- Preserve the current learning flow: browse course, open chapter, complete review, inspect progress.

## Risks And Mitigations

### Risk: UI migration without enough content structure

If the app only swaps components without redesigning the lesson layout, the result will still feel shallow.

Mitigation:

redesign chapter rendering and content model together.

### Risk: Content expansion becomes inconsistent chapter to chapter

If some chapters are expanded heavily and others remain thin, the course will feel uneven.

Mitigation:

use a shared chapter template and target density across all 8 chapters.

### Risk: Overusing `shadcn-vue` demos mechanically

If components are copied without adapting them to the learning domain, the app may look generic.

Mitigation:

use `shadcn-vue` as a foundation, but build domain-specific lesson components on top.

### Risk: Schema changes break authored content

Mitigation:

update backend validation and adjust content incrementally with test coverage.

## Rollout Sequence

1. add or generate the required `shadcn-vue` base components
2. redesign shared layout and page scaffolding
3. update content types and backend schema
4. implement new chapter rendering model
5. expand all 8 chapter JSON files
6. update quiz rendering if needed for denser content
7. run backend tests, frontend tests, and production build

## Open Decisions Resolved In This Design

- UI migration scope: full major UI layer migration, not partial replacement
- visual direction: bright, light, mobile-first education product
- content scope: enrich all current chapters instead of adding new ones
- audience: complete beginner adults
- chapter structure: keep current 8-chapter path, deepen each chapter substantially

## Success Criteria

This work is successful when:

- the frontend visibly uses a `shadcn-vue`-based component system rather than mostly custom primitives
- the course pages feel like a coherent mobile-first learning product
- every existing chapter contains significantly more instructional depth
- chapter pages include examples, practice, review, and richer quiz content
- backend validation and tests cover the richer course model
- the full app still builds and the core learning flow remains intact

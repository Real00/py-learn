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

- `learningGoals[]`
- `summaryPoints[]`
- `sections[]`
- `practiceTasks[]`
- `reviewChecklist[]`
- `quiz[]`

## 章节内容块

`sections[]` 用来承载主线教学内容，目前支持这些类型：

- `intro`
- `explanation`
- `example`
- `tip`
- `warning`
- `recap`
- `concept`
- `analogy`
- `pitfall`

每个 section 至少包含：

- `id`
- `type`
- `title`
- `content`

可选字段：

- `bullets[]`
- `exampleTitle`
- `exampleCode`

## 练习与复习

`practiceTasks[]` 用来承载动手练习：

- `id`
- `title`
- `prompt`
- `hints[]`
- `expectedOutcome`

`reviewChecklist[]` 用来承载本章复习清单：

- `id`
- `text`

## 题型

- `single_choice`
- `true_false`
- `fill_blank`

## 约束

- 当前版本所有内容统一使用 JSON。
- 章节 slug 必须唯一，并且文件名与 slug 保持一致。
- 每章必须至少包含一个 section、一个 practice task、一条复习清单和一道 quiz。

## 推荐密度

- 第 1 章建议至少提供 8 个内容块、2 个练习任务、3 条复习项和 6 道测验题。
- 第 2 到第 8 章建议至少提供 9 到 12 个内容块、3 个练习任务、4 条复习项和 7 到 8 道测验题。
- 当前课程第 2 到第 8 章的 authored 内容也按这条基线做回归测试校验，用来锁定最低内容密度。
- 每章至少包含一个短代码例子，优先用“先看代码，再解释语法”的方式组织内容。
- 在代码例子附近尽量加入“逐行解释代码”的说明块，帮助初学者把语法和执行结果对应起来。

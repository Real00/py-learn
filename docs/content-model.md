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
- `quiz[]`

## 题型

- `single_choice`
- `true_false`
- `fill_blank`

## 约束

- 首版所有内容统一使用 JSON。
- 章节 slug 必须唯一，并且文件名与 slug 保持一致。
- 每章必须至少包含一个 section 和一个 quiz。

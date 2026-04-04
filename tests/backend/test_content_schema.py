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

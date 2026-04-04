from __future__ import annotations

from typing import Any


class ContentValidationError(ValueError):
    """Raised when the course content files do not match the expected schema."""


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


def require_keys(data: dict[str, Any], keys: list[str], *, context: str) -> None:
    missing = [key for key in keys if key not in data]
    if missing:
        raise ContentValidationError(f"{context} is missing required keys: {', '.join(missing)}")


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


def validate_course_overview(data: dict[str, Any]) -> dict[str, Any]:
    require_keys(data, ["slug", "title", "subtitle", "description", "version", "chapters"], context="course overview")

    chapters = data["chapters"]
    if not isinstance(chapters, list) or not chapters:
        raise ContentValidationError("course overview must include at least one chapter")

    seen_slugs: set[str] = set()
    for chapter in chapters:
        require_keys(
            chapter,
            ["slug", "order", "title", "summary", "estimatedMinutes", "difficultyLabel", "prerequisiteSlug", "tags"],
            context="chapter summary",
        )
        slug = chapter["slug"]
        if slug in seen_slugs:
            raise ContentValidationError(f"duplicate chapter slug found in overview: {slug}")
        seen_slugs.add(slug)

    return data


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

    practice_tasks = require_non_empty_list(data["practiceTasks"], context=f"chapter {data['slug']} practiceTasks")
    for task in practice_tasks:
        validate_practice_task(task, slug=data["slug"])

    review_items = require_non_empty_list(data["reviewChecklist"], context=f"chapter {data['slug']} reviewChecklist")
    for item in review_items:
        validate_review_item(item, slug=data["slug"])

    require_non_empty_list(data["quiz"], context=f"chapter {data['slug']} quiz")

    return data

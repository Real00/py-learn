from __future__ import annotations

from typing import Any


class ContentValidationError(ValueError):
    """Raised when the course content files do not match the expected schema."""


def require_keys(data: dict[str, Any], keys: list[str], *, context: str) -> None:
    missing = [key for key in keys if key not in data]
    if missing:
        raise ContentValidationError(f"{context} is missing required keys: {', '.join(missing)}")


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
            "quiz",
        ],
        context="chapter detail",
    )

    if not data["sections"]:
        raise ContentValidationError(f"chapter {data['slug']} must include at least one section")

    if not data["quiz"]:
        raise ContentValidationError(f"chapter {data['slug']} must include at least one quiz question")

    return data

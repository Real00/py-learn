from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.schemas.course_schema import ContentValidationError, validate_chapter_detail, validate_course_overview


class CourseRepository:
    def __init__(self, content_dir: Path) -> None:
        self.content_dir = content_dir
        self.chapters_dir = content_dir / "chapters"
        self.overview_path = content_dir / "course.json"

    def get_course_overview(self) -> dict[str, Any]:
        data = self._read_json(self.overview_path)
        return validate_course_overview(data)

    def get_chapter_detail(self, slug: str) -> dict[str, Any]:
        chapter_path = self.chapters_dir / f"{slug}.json"
        if not chapter_path.exists():
            raise FileNotFoundError(f"chapter content not found: {slug}")

        data = self._read_json(chapter_path)
        validated = validate_chapter_detail(data)
        if validated["slug"] != slug:
            raise ContentValidationError(f"chapter slug mismatch: expected {slug}, found {validated['slug']}")
        return validated

    def _read_json(self, path: Path) -> dict[str, Any]:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)

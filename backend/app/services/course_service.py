from __future__ import annotations

from functools import cached_property
from typing import Any

from app.repositories.course_repository import CourseRepository


class CourseService:
    def __init__(self, repository: CourseRepository) -> None:
        self.repository = repository

    @cached_property
    def overview(self) -> dict[str, Any]:
        overview = self.repository.get_course_overview()
        chapter_slugs = {chapter["slug"] for chapter in overview["chapters"]}

        for slug in chapter_slugs:
            self.repository.get_chapter_detail(slug)

        return overview

    def get_course_overview(self) -> dict[str, Any]:
        return self.overview

    def get_chapter_detail(self, slug: str) -> dict[str, Any]:
        detail = self.repository.get_chapter_detail(slug)
        return detail

    def get_chapter_quiz(self, slug: str) -> dict[str, Any]:
        detail = self.get_chapter_detail(slug)
        return {
            "slug": detail["slug"],
            "quiz": detail["quiz"],
        }

    def get_version(self) -> dict[str, str]:
        overview = self.get_course_overview()
        return {
            "version": overview["version"],
        }

from __future__ import annotations

from flask import current_app, jsonify

from app.api import api_bp


@api_bp.get("/health")
def healthcheck():
    return jsonify({"status": "ok"})


@api_bp.get("/course")
def get_course():
    return jsonify(current_app.extensions["course_service"].get_course_overview())


@api_bp.get("/course/chapters/<slug>")
def get_chapter(slug: str):
    return jsonify(current_app.extensions["course_service"].get_chapter_detail(slug))


@api_bp.get("/course/chapters/<slug>/quiz")
def get_chapter_quiz(slug: str):
    return jsonify(current_app.extensions["course_service"].get_chapter_quiz(slug))


@api_bp.get("/meta/version")
def get_version():
    return jsonify(current_app.extensions["course_service"].get_version())

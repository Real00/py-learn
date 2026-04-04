from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, send_from_directory

from app.api import api_bp
from app.config import Settings
from app.repositories.course_repository import CourseRepository
from app.schemas.course_schema import ContentValidationError
from app.services.course_service import CourseService


def create_app() -> Flask:
    backend_root = Path(__file__).resolve().parents[1]
    settings = Settings.from_root(backend_root)

    app = Flask(
        __name__,
        static_folder=None,
    )
    app.config["SETTINGS"] = settings
    app.extensions["course_service"] = CourseService(CourseRepository(settings.content_dir))
    app.register_blueprint(api_bp)

    @app.errorhandler(FileNotFoundError)
    def handle_missing_content(error: FileNotFoundError):
        return jsonify({"error": str(error)}), 404

    @app.errorhandler(ContentValidationError)
    def handle_invalid_content(error: ContentValidationError):
        return jsonify({"error": str(error)}), 500

    @app.get("/")
    @app.get("/<path:path>")
    def spa(path: str = ""):
        dist_dir = settings.frontend_dist_dir

        if not dist_dir.exists():
            return jsonify(
                {
                    "message": "Frontend build not found. Run pnpm build inside the frontend directory.",
                }
            )

        asset_path = dist_dir / path
        if path and asset_path.exists() and asset_path.is_file():
            return send_from_directory(dist_dir, path)

        return send_from_directory(dist_dir, "index.html")

    return app

from app import create_app


def test_healthcheck():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


def test_course_overview_contains_eight_chapters():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course")
    data = response.get_json()

    assert response.status_code == 200
    assert data["version"] == "1.1.0"
    assert len(data["chapters"]) == 8


def test_chapter_quiz_endpoint_returns_questions():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/functions/quiz")
    data = response.get_json()

    assert response.status_code == 200
    assert data["slug"] == "functions"
    assert len(data["quiz"]) >= 6


def test_chapter_detail_contains_practice_and_review_fields():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/python-overview")
    data = response.get_json()

    assert response.status_code == 200
    assert len(data["practiceTasks"]) >= 2
    assert len(data["reviewChecklist"]) >= 3
    assert any("Python 常见用途" in item["text"] for item in data["reviewChecklist"])


def test_python_overview_chapter_explains_real_world_python_usage():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/python-overview")
    data = response.get_json()

    assert response.status_code == 200
    usage_section = next((section for section in data["sections"] if section["id"] == "overview-usage-map"), None)
    assert usage_section is not None
    assert any("自动化" in bullet for bullet in usage_section.get("bullets", []))
    assert any(task["id"] == "overview-practice-3" for task in data["practiceTasks"])
    assert len(data["quiz"]) >= 7
    assert any(question["knowledgePoint"] == "Python 应用场景" for question in data["quiz"])


def test_missing_chapter_returns_404():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/course/chapters/not-found")

    assert response.status_code == 404


def test_spa_route_falls_back_to_index_when_dist_exists():
    app = create_app()
    client = app.test_client()

    response = client.get("/course/functions")

    assert response.status_code == 200
    assert "text/html" in response.content_type

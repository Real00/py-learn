import pytest

from app import create_app


CHAPTERS_TWO_THROUGH_EIGHT = [
    "variables-and-types",
    "input-and-output",
    "conditions",
    "loops",
    "functions",
    "lists-and-dicts",
    "mini-project",
]


def get_chapter_detail(client, slug):
    response = client.get(f"/api/course/chapters/{slug}")
    assert response.status_code == 200
    return response.get_json()


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


@pytest.mark.parametrize("slug", CHAPTERS_TWO_THROUGH_EIGHT)
def test_chapters_two_through_eight_meet_new_density_requirements(slug):
    app = create_app()
    client = app.test_client()

    data = get_chapter_detail(client, slug)

    assert len(data["sections"]) >= 9, f"{slug} should include at least 9 sections"
    assert len(data["practiceTasks"]) >= 3, f"{slug} should include at least 3 practice tasks"
    assert len(data["reviewChecklist"]) >= 4, f"{slug} should include at least 4 review checklist items"
    assert len(data["quiz"]) >= 7, f"{slug} should include at least 7 quiz questions"


def test_code_example_driven_chapters_include_required_syntax_examples():
    app = create_app()
    client = app.test_client()

    io_chapter = get_chapter_detail(client, "input-and-output")
    io_section_ids = {section["id"] for section in io_chapter["sections"]}

    assert "io-example-convert" in io_section_ids
    assert any("input()" in section.get("exampleCode", "") for section in io_chapter["sections"])

    functions_chapter = get_chapter_detail(client, "functions")
    functions_section_ids = {section["id"] for section in functions_chapter["sections"]}

    assert "functions-example-refactor" in functions_section_ids
    assert any("return" in section.get("exampleCode", "") for section in functions_chapter["sections"])


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

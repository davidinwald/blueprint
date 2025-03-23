from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

# Test cases with different scenarios
TEST_CASES = [
    {
        "name": "test_all_zeros",
        "payload": {
            "answers": [
                {"value": 0, "question_id": f"question_{q}"} 
                for q in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
            ]
        },
        "expected_scores": {
            "depression": 0,
            "mania": 0,
            "anxiety": 0,
            "substance_use": 0
        },
        "expected_results": []
    },
    {
        "name": "test_high_depression",
        "payload": {
            "answers": [
                {"value": 3, "question_id": "question_a"},  # depression
                {"value": 3, "question_id": "question_b"},  # depression
                {"value": 0, "question_id": "question_c"},  # mania
                {"value": 0, "question_id": "question_d"},  # mania
                {"value": 0, "question_id": "question_e"},  # anxiety
                {"value": 0, "question_id": "question_f"},  # anxiety
                {"value": 0, "question_id": "question_g"},  # anxiety
                {"value": 0, "question_id": "question_h"},  # substance_use
            ]
        },
        "expected_scores": {
            "depression": 6,
            "mania": 0,
            "anxiety": 0,
            "substance_use": 0
        },
        "expected_results": ["PHQ-9"]
    },
    {
        "name": "test_all_domains_triggered",
        "payload": {
            "answers": [
                {"value": 2, "question_id": "question_a"},  # depression
                {"value": 1, "question_id": "question_b"},  # depression
                {"value": 1, "question_id": "question_c"},  # mania
                {"value": 2, "question_id": "question_d"},  # mania
                {"value": 1, "question_id": "question_e"},  # anxiety
                {"value": 1, "question_id": "question_f"},  # anxiety
                {"value": 1, "question_id": "question_g"},  # anxiety
                {"value": 1, "question_id": "question_h"},  # substance_use
            ]
        },
        "expected_scores": {
            "depression": 3,
            "mania": 3,
            "anxiety": 3,
            "substance_use": 1
        },
        "expected_results": ["ASRM", "ASSIST", "PHQ-9"]
    },
    {
        "name": "test_example_from_requirements",
        "payload": {
            "answers": [
                {"value": 1, "question_id": "question_a"},
                {"value": 0, "question_id": "question_b"},
                {"value": 2, "question_id": "question_c"},
                {"value": 3, "question_id": "question_d"},
                {"value": 1, "question_id": "question_e"},
                {"value": 0, "question_id": "question_f"},
                {"value": 1, "question_id": "question_g"},
                {"value": 0, "question_id": "question_h"}
            ]
        },
        "expected_scores": {
            "depression": 1,
            "mania": 5,
            "anxiety": 2,
            "substance_use": 0
        },
        "expected_results": ["ASRM", "PHQ-9"]
    }
]

@pytest.mark.parametrize("test_case", TEST_CASES, ids=lambda x: x["name"])
def test_screener_submission(test_case):
    response = client.post("/api/screener/submit", json=test_case["payload"])
    assert response.status_code == 200
    
    data = response.json()
    assert data["status"] == "success"
    assert data["domain_scores"] == test_case["expected_scores"]
    assert data["results"] == test_case["expected_results"]

def test_get_form():
    response = client.get("/api/screener/")
    assert response.status_code == 200
    data = response.json()
    
    # Verify top-level structure
    assert "id" in data
    assert "name" in data
    assert "disorder" in data
    assert "content" in data
    assert "full_name" in data
    
    # Verify content structure
    content = data["content"]
    assert "sections" in content
    assert "display_name" in content
    
    # Verify sections
    sections = content["sections"]
    assert len(sections) == 1
    section = sections[0]
    
    # Verify section structure
    assert "type" in section
    assert section["type"] == "standard"
    assert "title" in section
    assert "answers" in section
    assert "questions" in section
    
    # Verify answers structure
    answers = section["answers"]
    assert len(answers) == 5
    for answer in answers:
        assert "title" in answer
        assert "value" in answer
        assert isinstance(answer["value"], int)
    
    # Verify specific answer values and titles
    expected_answers = [
        {"title": "Not at all", "value": 0},
        {"title": "Rare, less than a day or two", "value": 1},
        {"title": "Several days", "value": 2},
        {"title": "More than half the days", "value": 3},
        {"title": "Nearly every day", "value": 4}
    ]
    assert answers == expected_answers
    
    # Verify questions structure
    questions = section["questions"]
    assert len(questions) == 8
    for question in questions:
        assert "question_id" in question
        assert "title" in question
        assert question["question_id"].startswith("question_")
    
    # Verify specific question IDs are present
    question_ids = [q["question_id"] for q in questions]
    expected_ids = [f"question_{c}" for c in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']]
    assert sorted(question_ids) == sorted(expected_ids)

def test_invalid_question_id():
    payload = {
        "answers": [
            {"value": 1, "question_id": "invalid_question"}
        ]
    }
    response = client.post("/api/screener/submit", json=payload)
    assert response.status_code == 200
    assert response.json()["domain_scores"] == {}
    assert response.json()["results"] == []

def test_invalid_value():
    payload = {
        "answers": [
            {"value": 4, "question_id": "question_a"}  # value > 3
        ]
    }
    response = client.post("/api/screener/submit", json=payload)
    assert response.status_code == 200  # Currently accepting any value 
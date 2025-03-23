from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Set, Tuple
import json
import os
from collections import defaultdict

router = APIRouter(
    prefix="/api/screener",
    tags=["screener"],
    responses={404: {"description": "Not found"}},
)

class Answer(BaseModel):
    value: int
    question_id: str

class ScreenerSubmission(BaseModel):
    answers: List[Answer]

def load_file(filename: str) -> Dict:
    """Load a JSON file from the data directory."""
    file_path = os.path.join(os.path.dirname(__file__), '..', 'data', filename)
    try:
        with open(file_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to load {filename}: {str(e)}"
        )

def load_domain_data() -> Tuple[List[Dict], Dict]:
    """Load domain mapping and assessment rules from separate JSON files."""
    domain_mapping = load_file('domain_mapping.json')
    assessment_rules = load_file('assessment_rules.json')
    
    return domain_mapping, assessment_rules

def load_form() -> Dict:
    """Load the form from the form.json file."""
    return load_file('form.json')

def calculate_domain_scores(answers: List[Answer], domain_mapping: List[Dict]) -> Dict[str, int]:
    """Calculate total score for each domain based on answers."""
    # Create mapping of question_id to domain
    question_domain_map = {item['question_id']: item['domain'] for item in domain_mapping}
    
    # Initialize domain scores
    domain_scores = defaultdict(int)
    
    # Calculate scores for each domain
    for answer in answers:
        domain = question_domain_map.get(answer.question_id)
        if domain:
            domain_scores[domain] += answer.value
    
    return dict(domain_scores)

def determine_assessments(domain_scores: Dict[str, int], assessment_rules: Dict) -> List[str]:
    """Determine which Level-2 Assessments should be assigned based on domain scores."""
    recommended_assessments = set()
    
    for domain, score in domain_scores.items():
        rule = assessment_rules.get(domain)
        if rule and score >= rule['threshold']:
            recommended_assessments.add(rule['assessment'])
    
    return sorted(list(recommended_assessments))

@router.post("/submit")
async def submit_screener(submission: ScreenerSubmission):
    """
    Submit answers to the screener questionnaire and determine needed assessments.
    Each answer has a value (0-3) and a question_id.
    Returns recommended Level-2 Assessments based on domain scores.
    """
    try:
        # Load domain mapping and rules
        domain_mapping, assessment_rules = load_domain_data()
        
        # Calculate scores for each domain
        domain_scores = calculate_domain_scores(submission.answers, domain_mapping)
        
        # Determine which assessments are needed
        recommended_assessments = determine_assessments(domain_scores, assessment_rules)
        
        return {
            "status": "success",
            "domain_scores": domain_scores,
            "results": recommended_assessments
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/")
async def get_questions():
    """
    Get an obj representing the screener form
    """
    form = load_form()
    return form
   
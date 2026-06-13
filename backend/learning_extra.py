import re
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from database import get_db
from models import User, LearningPath
from auth.dependencies import get_current_user
from learning.router import call_groq

router = APIRouter(prefix="/learning", tags=["Learning Extra"])


# ── Schemas  

class QuizGenerateRequest(BaseModel):
    week_number: int

class QuizAnswer(BaseModel):
    question_index: int
    selected_option: int

class QuizSubmitRequest(BaseModel):
    week_number: int
    answers: List[QuizAnswer]
    questions: List[dict]

class ExplainRequest(BaseModel):
    week_number: int
    topic: str
    quiz_history: List[dict] = []


# ── Helpers 

def _get_path_for_user(path_id: int, user: User, db: Session) -> LearningPath:
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    return path


# ── Routes 

@router.post("/{path_id}/quiz/generate")
def generate_quiz(
    path_id: int,
    body: QuizGenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = _get_path_for_user(path_id, current_user, db)
    weeks = path.path_json.get("weeks", [])
    week = next((w for w in weeks if w["week"] == body.week_number), None)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    topics = ", ".join(week.get("topics", []))
    prompt = f"""
You are a quiz generator for a learning platform.

Generate exactly 3 multiple-choice questions to test understanding of:
Week {body.week_number}: {week['title']}
Topics covered: {topics}

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {{
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }}
]

"correct" is the 0-based index of the correct option.
Make questions practical and concept-testing, not trivial.
""".strip()

    raw = call_groq(prompt, max_tokens=800)
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        questions = json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Groq returned invalid JSON for quiz")

    return {"week": body.week_number, "questions": questions}


@router.post("/{path_id}/quiz/submit")
def submit_quiz(
    path_id: int,
    body: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = _get_path_for_user(path_id, current_user, db)
    weeks = path.path_json.get("weeks", [])

    score = 0
    weak_topics = []
    for ans in body.answers:
        q = body.questions[ans.question_index]
        if ans.selected_option == q["correct"]:
            score += 1
        else:
            weak_topics.append(q["question"])

    score_pct = round((score / len(body.questions)) * 100)

    completed_weeks = [w for w in weeks if w["week"] <= body.week_number]
    remaining_weeks = [w for w in weeks if w["week"] > body.week_number]

    if not remaining_weeks:
        return {
            "score": score,
            "score_pct": score_pct,
            "weak_topics": weak_topics,
            "reshuffled": False,
            "path_json": path.path_json,
            "message": "You've completed all weeks! 🎉"
        }

    weak_str = "\n".join(f"- {t}" for t in weak_topics) if weak_topics else "None — learner performed well!"
    remaining_str = json.dumps(remaining_weeks, indent=2)

    prompt = f"""
You are an adaptive learning path optimizer.

A learner completed Week {body.week_number} with a score of {score_pct}%.

Weak areas:
{weak_str}

Remaining weeks:
{remaining_str}

{"Strengthen upcoming weeks by adding more foundational content for the weak areas." if score_pct < 70 else "Learner is doing well. Slightly accelerate by introducing more advanced topics."}

Return ONLY a valid JSON array of updated remaining weeks (same structure, same week numbers). No markdown.
""".strip()

    raw = call_groq(prompt, max_tokens=2000)
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()

    try:
        updated_remaining = json.loads(clean)
    except json.JSONDecodeError:
        updated_remaining = remaining_weeks

    new_weeks = completed_weeks + updated_remaining
    new_path_json = {**path.path_json, "weeks": new_weeks}

    path.path_json = new_path_json
    db.commit()
    db.refresh(path)

    return {
        "score": score,
        "score_pct": score_pct,
        "weak_topics": weak_topics,
        "reshuffled": True,
        "path_json": new_path_json,
        "message": (
            f"Score: {score_pct}% — Your path has been strengthened! 💪"
            if score_pct < 70
            else f"Score: {score_pct}% — Great job! Path accelerated. 🚀"
        )
    }


@router.post("/{path_id}/explain")
def explain_topic(
    path_id: int,
    body: ExplainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = _get_path_for_user(path_id, current_user, db)

    weak_context = ""
    if body.quiz_history:
        weak_areas = []
        for q in body.quiz_history:
            if q.get("weak_topics"):
                weak_areas.extend(q["weak_topics"])
        if weak_areas:
            weak_context = f"\nThis learner has previously struggled with: {', '.join(set(weak_areas[:5]))}"

    prompt = f"""
You are a patient, brilliant tutor helping {current_user.name} who is stuck.

They are learning: {path.path_json.get('goal', 'a new skill')}
They are stuck on: {body.topic} (Week {body.week_number})
{weak_context}

Give a personalized micro-lesson that:
1. Starts with a simple real-world analogy to make it click
2. Explains the concept clearly in 3-4 short paragraphs
3. Gives one tiny hands-on exercise they can do RIGHT NOW
4. Ends with one encouraging sentence

Keep it conversational, warm, and under 300 words.
Do NOT use markdown headers. Use plain paragraphs.
""".strip()

    explanation = call_groq(prompt, max_tokens=600)
    return {"topic": body.topic, "explanation": explanation}
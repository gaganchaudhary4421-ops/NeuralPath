from fastapi import APIRouter, Depends, HTTPException, status,UploadFile, File

from sqlalchemy.orm import Session
from typing import List
from dotenv import load_dotenv
from pathlib import Path
import fitz   
import os, json, re
import urllib.parse
from groq import Groq
from datetime import datetime, timezone
from database import get_db
from models import User, LearningPath
from schemas import GenerateRequest, LearningPathResponse
from auth.dependencies import get_current_user

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
print(f"[router] GROQ KEY loaded: {'YES' if GROQ_API_KEY else 'NOT FOUND'}")

groq_client = Groq(api_key=GROQ_API_KEY)

router = APIRouter(tags=["Learning Paths"])


 
def call_groq(prompt: str, max_tokens: int = 8000) -> str:
    try:
        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq API error: {str(e)}"
        )
 
def build_prompt(name: str, goal: str, focus: str) -> str:
    focus_line = f"Additional context / focus area: {focus}" if focus else ""
    return f"""
You are a world-class learning path designer and career coach.

Create a DETAILED, COMPREHENSIVE 8-week learning path for:
- Learner Name: {name}
- Goal: {goal}
{focus_line}

CRITICAL RULES FOR RESOURCES — FOLLOW EXACTLY:
- Only 2 types allowed: "video" and "article"
- NEVER use "course" type
- For "video": ALWAYS use this exact format: https://www.youtube.com/results?search_query=TOPIC+tutorial
  Replace spaces with + in the search query. Example: https://www.youtube.com/results?search_query=python+functions+tutorial
- For "article": ALWAYS use one of these search URL formats:
  * MDN: https://developer.mozilla.org/en-US/search?q=TOPIC
  * freeCodeCamp: https://www.freecodecamp.org/news/search/?query=TOPIC
  * Google: https://www.google.com/search?q=TOPIC+tutorial+site:freecodecamp.org
- Replace spaces with + in all search queries
- NEVER use direct article URLs — always use search URLs
- NEVER use Udemy, Coursera, Pluralsight, LinkedIn Learning
- These search URLs always work and never 404

Each week must have:
- A clear, descriptive title
- 5-6 specific topics
- Exactly 3 resources: 1 video (YouTube search) + 2 articles (MDN or freeCodeCamp search)
- A concrete, measurable milestone

Return your response in this EXACT format:

---JSON---
{{
  "title": "Specific and inspiring learning path title",
  "goal": "{goal}",
  "duration_weeks": 8,
  "weeks": [
    {{
      "week": 1,
      "title": "Descriptive week title",
      "topics": [
        "Specific topic 1 with detail",
        "Specific topic 2 with detail",
        "Specific topic 3 with detail",
        "Specific topic 4 with detail",
        "Specific topic 5 with detail"
      ],
      "resources": [
        {{"type": "video", "title": "Week 1 topics on YouTube", "url": "https://www.youtube.com/results?search_query=WEEK1+TOPIC+tutorial"}},
        {{"type": "article", "title": "MDN Docs: Week 1 topic", "url": "https://developer.mozilla.org/en-US/search?q=WEEK1+TOPIC"}},
        {{"type": "course", "title": "freeCodeCamp: Week 1 topic", "url": "https://www.freecodecamp.org/news/search/?query=WEEK1+TOPIC"}}
      ],
      "milestone": "Concrete, measurable achievement for this week"
    }}
  ]
}}
---MARKDOWN---
# {goal} — 8-Week Learning Path for {name}

## Overview
[2-3 sentences describing the overall journey and what they'll achieve]

## Week-by-Week Breakdown

### Week 1: [Title]
**Topics:** [list]
**Milestone:** [milestone]
**Tips:** [1-2 practical tips for this week]

[Repeat for all 8 weeks]

## Final Outcome
[What the learner will be able to do after completing this path]
""".strip()
def build_video_script_prompt(goal: str, path_json: dict) -> str:
    weeks_summary = "\n".join(
        f"Week {w['week']}: {w['title']} — {w.get('milestone', '')}"
        for w in path_json.get("weeks", [])
    )
    return f"""
You are a professional YouTube script writer for an educational channel.

Write an engaging, motivational video script introducing this learning path:
- Goal: {goal}
- Title: {path_json.get('title', goal)}
- Duration: {path_json.get('duration_weeks', 8)} weeks

Weekly breakdown:
{weeks_summary}

Write the script in this format:

[HOOK - 15 seconds]
An attention-grabbing opening for someone who wants to: {goal}

[INTRO - 30 seconds]
Introduce the learning path, what it covers, and why it works.

[WEEK BY WEEK - 60 seconds]
A quick exciting overview of each week's transformation.

[CALL TO ACTION - 15 seconds]
Motivate the viewer to start today.

Keep it conversational, energetic, and under 400 words total.
""".strip()


 
def parse_groq_response(text: str) -> tuple[dict, str]:
    path_json = {}
    markdown = text

    json_match = re.search(r"---JSON---\s*([\s\S]*?)\s*---MARKDOWN---", text)
    md_match = re.search(r"---MARKDOWN---\s*([\s\S]*)", text)

    if json_match:
        raw_json = json_match.group(1).strip()
        raw_json = re.sub(r"```(?:json)?|```", "", raw_json).strip()
        try:
            path_json = json.loads(raw_json)
        except json.JSONDecodeError:
            path_json = {}

    if md_match:
        markdown = md_match.group(1).strip()

    return path_json, markdown

import urllib.parse
DOMAIN_RESOURCES = {
    "medical": {
        "keywords": ["doctor", "medical", "medicine", "mbbs", "nursing", "anatomy", "pharmacology", "surgery", "clinical", "health", "physiology", "pathology", "biochemistry"],
        "resources": [
            ("article", "PubMed",        "https://pubmed.ncbi.nlm.nih.gov/?term={q}"),
            ("article", "MedlinePlus",   "https://medlineplus.gov/search/?query={q}"),
            ("article", "WHO",           "https://www.who.int/search?indexCatalogue=genericsearchindex1&searchQuery={q}"),
            ("article", "Google Search", "https://www.google.com/search?q={q}+medical"), 
            ("video",   "YouTube Medical", "https://www.youtube.com/results?search_query={q}+medical+lecture"),
            ("video",   "NPTEL Medical", "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "law": {
        "keywords": ["law", "lawyer", "legal", "judiciary", "llb", "advocate", "constitution", "criminal", "civil law", "litigation"],
        "resources": [
            ("article", "Indian Kanoon",      "https://indiankanoon.org/search/?formInput={q}"),
            ("article", "Legal Service India", "https://www.legalserviceindia.com/search/search.php?query={q}"),
            ("article", "Wikipedia Law",      "https://en.wikipedia.org/wiki/Special:Search?search={q}+law"),
            ("article", "Google Search",      "https://www.google.com/search?q={q}+law"),  
            ("video",   "YouTube Law",        "https://www.youtube.com/results?search_query={q}+law+explained"),
            ("video",   "NPTEL Law",          "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "finance": {
        "keywords": ["finance", "accounting", "ca", "cfa", "investment", "stock", "trading", "banking", "economics", "financial", "audit", "tax"],
        "resources": [
            ("article", "Investopedia",       "https://www.investopedia.com/search?q={q}"),
            ("article", "Wikipedia Finance",  "https://en.wikipedia.org/wiki/Special:Search?search={q}+finance"),
            ("article", "Google Search",      "https://www.google.com/search?q={q}+finance"),  
            ("video",   "YouTube Finance",    "https://www.youtube.com/results?search_query={q}+finance+tutorial"),
            ("video",   "NPTEL Finance",      "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "data_science": {
        "keywords": ["data science", "machine learning", "ai", "artificial intelligence", "deep learning", "nlp", "neural network", "data analyst", "data engineer", "python", "statistics"],
        "resources": [
            ("article", "Towards Data Science", "https://www.google.com/search?q={q}+site:towardsdatascience.com"),
            ("article", "Kaggle",               "https://www.kaggle.com/search?q={q}"),
            ("article", "Papers With Code",     "https://paperswithcode.com/search?q_meta=&q_type=&q={q}"),
            ("article", "Google Search",        "https://www.google.com/search?q={q}+data+science"), 
            ("video",   "YouTube ML/AI",        "https://www.youtube.com/results?search_query={q}+tutorial"),
            ("video",   "NPTEL DS",             "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "web_dev": {
        "keywords": ["web", "frontend", "backend", "fullstack", "javascript", "react", "node", "html", "css", "developer", "software engineer", "programming"],
        "resources": [
            ("article", "MDN Docs",      "https://developer.mozilla.org/en-US/search?q={q}"),
            ("article", "freeCodeCamp", "https://www.freecodecamp.org/news/search/?query={q}"),
            ("article", "GeeksforGeeks", "https://www.geeksforgeeks.org/search/?q={q}"),
            ("article", "Google Search", "https://www.google.com/search?q={q}+programming"), 
            ("video",   "YouTube Dev",   "https://www.youtube.com/results?search_query={q}+tutorial"),
            ("video",   "NPTEL CS",      "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "design": {
        "keywords": ["design", "ui", "ux", "graphic", "figma", "illustrator", "photoshop", "branding", "typography", "product design"],
        "resources": [
            ("article", "Smashing Magazine", "https://www.smashingmagazine.com/search/?q={q}"),
            ("article", "Nielsen Norman",    "https://www.nngroup.com/search/?q={q}"),
            ("article", "UX Planet",         "https://www.google.com/search?q={q}+site:uxplanet.org"),
            ("article", "Google Search",     "https://www.google.com/search?q={q}+design"),  
            ("video",   "YouTube Design",    "https://www.youtube.com/results?search_query={q}+design+tutorial"),
            ("video",   "NPTEL Design",      "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "science": {
        "keywords": ["physics", "chemistry", "biology", "engineering", "mechanical", "electrical", "civil", "research", "science", "bsc", "msc"],
        "resources": [
            ("article", "Khan Academy", "https://www.khanacademy.org/search?page_search_query={q}"),
            ("article", "Wikipedia",    "https://en.wikipedia.org/wiki/Special:Search?search={q}"),
            ("article", "NCBI",         "https://www.ncbi.nlm.nih.gov/search/research-articles/?term={q}"),
            ("article", "Google Search", "https://www.google.com/search?q={q}+science"),  
            ("video",   "YouTube Science", "https://www.youtube.com/results?search_query={q}+explained"),
            ("video",   "NPTEL",        "https://nptel.ac.in/search?q={q}"),
        ]
    },
    "general": {
        "keywords": [],
        "resources": [
            ("article", "Wikipedia",    "https://en.wikipedia.org/wiki/Special:Search?search={q}"),
            ("article", "Khan Academy", "https://www.khanacademy.org/search?page_search_query={q}"),
            ("article", "Google Search", "https://www.google.com/search?q={q}"),  
            ("video",   "YouTube",      "https://www.youtube.com/results?search_query={q}+tutorial"),
            ("video",   "NPTEL",        "https://nptel.ac.in/search?q={q}"),
        ]
    },
}


def detect_domain(goal: str, focus: str = "") -> str:
    """Detect the learning domain from goal and focus text."""
    text = (goal + " " + (focus or "")).lower()
    for domain, config in DOMAIN_RESOURCES.items():
        if domain == "general":
            continue
        if any(kw in text for kw in config["keywords"]):
            return domain
    return "general"


def fix_resources(path_json: dict, goal: str = "", focus: str = "") -> dict:
    domain = detect_domain(goal, focus)
    domain_config = DOMAIN_RESOURCES[domain]

    for week in path_json.get("weeks", []):
        search_query = week.get("title", "")
        encoded = urllib.parse.quote_plus(search_query)

        week["resources"] = [
            {
                "type": rtype,
                "title": f"{label}: {search_query}",
                "url": url_template.replace("{q}", encoded),
            }
            for rtype, label, url_template in domain_config["resources"]
        ]

    return path_json
# ── Routes  

@router.post("/generate", response_model=LearningPathResponse, status_code=status.HTTP_201_CREATED)
def generate_path(
    body: GenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prompt = build_prompt(current_user.name, body.goal, body.focus or "")
    raw_text = call_groq(prompt)
    path_json, markdown = parse_groq_response(raw_text)

    path_json = fix_resources(path_json, goal=body.goal, focus=body.focus or "")

    learning_path = LearningPath(
        user_id=current_user.id,
        goal=body.goal,
        focus=body.focus,
        markdown=markdown,
        path_json=path_json,
    )
    db.add(learning_path)
    db.commit()
    db.refresh(learning_path)

    return learning_path
@router.post("/generate-video-script/{path_id}")
def generate_video_script(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    prompt = build_video_script_prompt(path.goal, path.path_json or {})
    script = call_groq(prompt, max_tokens=1000)

    return {"path_id": path_id, "script": script}


@router.get("/dashboard", response_model=List[LearningPathResponse])
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paths = (
        db.query(LearningPath)
        .filter(LearningPath.user_id == current_user.id)
        .order_by(LearningPath.created_at.desc())
        .all()
    )

    
    for path in paths:
        if path.path_json:
            path.path_json = fix_resources(
                path.path_json,
                goal=path.goal or "",
                focus=path.focus or ""
            )

    return paths
from fastapi import UploadFile, File
import fitz   

@router.post("/analyze-resume")
async def analyze_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    contents = await file.read()

    try:
        if file.content_type == "application/pdf":
            doc = fitz.open(stream=contents, filetype="pdf")
            text = "\n".join(page.get_text() for page in doc)
        else:
            raise HTTPException(status_code=400, detail="Only PDF supported with Groq. Please upload a PDF.")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read file.")

    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from PDF.")

    prompt = f"""
Analyze this resume text and extract key information.
Respond ONLY with valid JSON, no markdown, no explanation:
{{
  "name": "full name",
  "currentRole": "current or most recent job title or student status",
  "goal": "suggested next career/academic goal based on their background",
  "skills": ["skill1", "skill2", "skill3"],
  "domain": "best matching domain from their background",
  "level": "one of: complete beginner, beginner with basics, intermediate, advanced",
  "summary": "2-sentence summary of their background and what learning path would suit them"
}}

Resume text:
{text[:3000]}
""".strip()

    raw = call_groq(prompt, max_tokens=500)
    clean = raw.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse resume analysis")
@router.get("/progress/stats")
def get_progress_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paths = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id
    ).all()

    total_weeks = sum(len((p.path_json or {}).get("weeks", [])) for p in paths)
    completed_weeks = sum(len(p.completed_weeks or []) for p in paths)
    all_quiz_history = []
    for p in paths:
        all_quiz_history.extend(p.quiz_history or [])

    avg_score = (
        round(sum(q["score_pct"] for q in all_quiz_history) / len(all_quiz_history))
        if all_quiz_history else 0
    )

    recent = all_quiz_history[-6:] if len(all_quiz_history) >= 6 else all_quiz_history
    weekly_scores = [
        {"week": f"W{i+1}", "score": q["score_pct"], "target": 80}
        for i, q in enumerate(recent)
    ]

    topic_completion = []
    for p in paths:
        weeks = (p.path_json or {}).get("weeks", [])
        total = len(weeks)
        done = len(p.completed_weeks or [])
        if total > 0:
            topic_completion.append({
                "topic": (p.path_json or {}).get("title", p.goal)[:30],
                "pct": round((done / total) * 100)
            })

    return {
        "avg_score": avg_score,
        "lessons_done": completed_weeks,
        "total_lessons": total_weeks,
        "weekly_scores": weekly_scores,
        "topic_completion": topic_completion,
    }
    
@router.get("/path/{path_id}", response_model=LearningPathResponse)
def get_path(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    if path.path_json:
        path.path_json = fix_resources(
            path.path_json,
            goal=path.goal or "",
            focus=path.focus or ""
        )

    return path


@router.get("/resources")
def get_all_resources(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paths = db.query(LearningPath).filter(
        LearningPath.user_id == current_user.id
    ).all()

    resources = []
    for p in paths:
         path_json = fix_resources(
            p.path_json or {},
            goal=p.goal or "",
            focus=p.focus or ""
        )
         weeks = path_json.get("weeks", [])
         for week in weeks:
            for r in week.get("resources", []):
                resources.append({
                    **r,
                    "week": week["week"],
                    "week_title": week["title"],
                    "path_title": path_json.get("title", p.goal),
                    "path_id": p.id,
                })

    return {"resources": resources}
@router.get("/path/{path_id}/progress")
def get_progress(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    return {
        "completed_weeks": path.completed_weeks or [],
        "quiz_history": path.quiz_history or [],
    }


@router.post("/{path_id}/quiz/generate")
def generate_quiz(
    path_id: int,
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    week_number = body.get("week_number", 1)
    weeks = (path.path_json or {}).get("weeks", [])
    week = next((w for w in weeks if w["week"] == week_number), None)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    prompt = f"""
Generate exactly 3 multiple choice quiz questions for this learning week.
Week title: {week['title']}
Topics covered: {', '.join(week.get('topics', []))}

Return ONLY valid JSON, no markdown, no explanation:
{{
  "questions": [
    {{
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0
    }}
  ]
}}
""".strip()

    raw = call_groq(prompt, max_tokens=1000)
    raw = re.sub(r"```(?:json)?|```", "", raw).strip()
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="Failed to parse quiz from AI")

    return {"questions": data["questions"]}


@router.post("/{path_id}/quiz/submit")
def submit_quiz(
    path_id: int,
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    week_number = body.get("week_number")
    answers = body.get("answers", [])      
    questions = body.get("questions", [])   

    correct = sum(
        1 for a in answers
        if a["selected_option"] == questions[a["question_index"]]["correct"]
    )
    total = len(questions)
    score_pct = round((correct / total) * 100) if total else 0

    weak_topics = [
        questions[a["question_index"]].get("question", "")
        for a in answers
        if a["selected_option"] != questions[a["question_index"]]["correct"]
    ]

    passed = score_pct >= 70
    result = {
        "week_number": week_number,
        "score": correct,
        "score_pct": score_pct,
        "message": "Great job! Week marked as complete." if passed else "Keep practicing — review the weak topics below.",
        "weak_topics": weak_topics,
        "reshuffled": False,
    }

    quiz_history = path.quiz_history or []
    quiz_history.append(result)
    path.quiz_history = quiz_history

    
    if passed:
        completed = path.completed_weeks or []
        if week_number not in completed:
            completed = completed + [week_number]
        path.completed_weeks = completed

    path.last_activity = datetime.now(timezone.utc)
    db.commit()

    return result

@router.post("/path/{path_id}/progress")
def save_progress(
    path_id: int,
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")

    path.completed_weeks = body.get("completed_weeks", path.completed_weeks or [])
    path.quiz_history = body.get("quiz_history", path.quiz_history or [])
    path.last_activity = datetime.now(timezone.utc)
    db.commit()
    return {"ok": True}

@router.delete("/path/{path_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_path(
    path_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    path = db.query(LearningPath).filter(
        LearningPath.id == path_id,
        LearningPath.user_id == current_user.id
    ).first()
    if not path:
        raise HTTPException(status_code=404, detail="Path not found")
    db.delete(path)
    db.commit()
 


from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from learning_extra import router as extra_router
import models   
from sqlalchemy import text
from auth.router import router as auth_router
from auth.reset import router as reset_router 
from learning.router import router as learning_router
 

 
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LearnPath API",
    description="AI-powered learning path generator backend",
    version="1.0.0",
)
@app.on_event("startup")
async def show_routes():
    for route in app.routes:
        path =  getattr(route, "path", None)
        methods = getattr(route, "methods", "---")
        print(f"{methods} {path}")
         
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE learning_paths ADD COLUMN completed_weeks JSON"))
        conn.execute(text("ALTER TABLE learning_paths ADD COLUMN quiz_history JSON"))
        conn.execute(text("ALTER TABLE learning_paths ADD COLUMN last_activity DATETIME"))
        conn.commit()
    except:
        pass   
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(reset_router) 
app.include_router(learning_router, prefix="/api/learning", tags=["Learning"])
app.include_router(extra_router)

print("\n=== REGISTERED ROUTES ===")
for route in app.routes:
    if hasattr(route, "methods"):
        print(f"{route.methods} {route.path}")
print("=========================\n")

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "LearnPath API is running"}
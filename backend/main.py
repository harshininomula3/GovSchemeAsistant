import sys
import os

# Add backend directory to path
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, get_scheme_count
from seed_data import seed_schemes
from routers import analyze, schemes, explain, draft, autofill

app = FastAPI(
    title="AI Legal & Government Scheme Assistant",
    description="AI-powered assistant helping Indian citizens discover government schemes, understand eligibility, and generate applications.",
    version="1.0.0"
)

# CORS - allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(analyze.router, prefix="/api", tags=["Analysis"])
app.include_router(schemes.router, prefix="/api", tags=["Schemes"])
app.include_router(explain.router, prefix="/api", tags=["Explanation"])
app.include_router(draft.router, prefix="/api", tags=["Draft"])
app.include_router(autofill.router, prefix="/api", tags=["Autofill"])

@app.on_event("startup")
def startup():
    init_db()
    seed_schemes()
    count = get_scheme_count()
    print(f"[OK] Database initialized with {count} government schemes.")

@app.get("/")
def root():
    return {
        "message": "AI Legal & Government Scheme Assistant API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "schemes_count": get_scheme_count()}

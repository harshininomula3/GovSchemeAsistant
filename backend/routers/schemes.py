from fastapi import APIRouter, HTTPException
from models import SchemeSearchRequest, SchemeResponse
from services.scheme_service import find_matching_schemes
from database import get_all_schemes, get_scheme_by_id
from typing import List

router = APIRouter()

@router.post("/schemes", response_model=List[SchemeResponse])
async def search_schemes(request: SchemeSearchRequest):
    """Find matching government schemes based on user criteria."""
    try:
        results = await find_matching_schemes(
            persona=request.persona,
            keywords=request.keywords,
            category=request.category,
            state=request.state,
            target_group=request.target_group,
            context=request.keywords or request.persona
        )
        return [SchemeResponse(**s) for s in results[:15]]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scheme search failed: {str(e)}")

@router.get("/schemes", response_model=List[SchemeResponse])
async def list_all_schemes(category: str = None):
    """List all schemes, optionally filtered by category."""
    schemes = get_all_schemes()
    if category:
        schemes = [s for s in schemes if s.get("category", "").lower() == category.lower()]
    return [SchemeResponse(**s) for s in schemes]

@router.get("/schemes/{scheme_id}", response_model=SchemeResponse)
async def get_scheme(scheme_id: int):
    """Get a single scheme by ID."""
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return SchemeResponse(**scheme)

@router.get("/categories")
async def list_categories():
    """List all unique scheme categories."""
    schemes = get_all_schemes()
    categories = sorted(set(s.get("category", "Other") for s in schemes))
    return {"categories": categories}

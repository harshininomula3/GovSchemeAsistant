from fastapi import APIRouter, HTTPException
from models import ExplainResponse
from services.llm_service import explain_scheme
from database import get_scheme_by_id

router = APIRouter()

@router.get("/explain/{scheme_id}", response_model=ExplainResponse)
async def explain_scheme_endpoint(scheme_id: int):
    """Get a plain-English explanation of a government scheme."""
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    try:
        result = await explain_scheme(scheme)
        return ExplainResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation failed: {str(e)}")

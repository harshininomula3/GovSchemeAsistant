from fastapi import APIRouter, HTTPException
from models import AnalyzeRequest, AnalyzeResponse
from services.llm_service import analyze_persona

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_user_input(request: AnalyzeRequest):
    """Analyze user input to determine persona, context, and needs."""
    if not request.text or not request.text.strip():
        raise HTTPException(status_code=400, detail="Please enter some text describing your situation.")
    
    try:
        result = await analyze_persona(request.text)
        return AnalyzeResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

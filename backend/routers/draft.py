from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from models import DraftRequest, DraftResponse
from services.llm_service import generate_draft
from services.pdf_service import generate_application_pdf
from database import get_scheme_by_id

router = APIRouter()

@router.post("/draft", response_model=DraftResponse)
async def generate_application_draft(request: DraftRequest):
    """Generate an application draft letter for a scheme."""
    scheme = get_scheme_by_id(request.scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    try:
        draft_text = await generate_draft(
            user_name=request.user_name,
            user_details=request.user_details,
            scheme_data=scheme,
            additional_info=request.additional_info or ""
        )
        return DraftResponse(
            draft_text=draft_text,
            scheme_name=scheme["name"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Draft generation failed: {str(e)}")

@router.post("/draft/pdf")
async def generate_draft_pdf(request: DraftRequest):
    """Generate a PDF of the application draft."""
    scheme = get_scheme_by_id(request.scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    
    try:
        draft_text = await generate_draft(
            user_name=request.user_name,
            user_details=request.user_details,
            scheme_data=scheme,
            additional_info=request.additional_info or ""
        )
        pdf_bytes = generate_application_pdf(draft_text, request.user_name, scheme["name"])
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="application_{scheme["id"]}.pdf"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from models import AutofillRequest, AutofillResponse
from services.pdf_service import generate_autofill_pdf

router = APIRouter()

@router.post("/autofill", response_model=AutofillResponse)
async def autofill_form(request: AutofillRequest):
    """Auto-fill form fields with user data."""
    try:
        filled = {}
        for field in request.form_fields:
            field_lower = field.lower().replace(" ", "_")
            # Try to match user data keys to form fields
            matched = False
            for key, value in request.user_data.items():
                key_lower = key.lower().replace(" ", "_")
                if key_lower == field_lower or key_lower in field_lower or field_lower in key_lower:
                    filled[field] = value
                    matched = True
                    break
            if not matched:
                filled[field] = None
        
        return AutofillResponse(
            filled_fields=filled,
            pdf_available=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Auto-fill failed: {str(e)}")

@router.post("/autofill/pdf")
async def autofill_pdf(request: AutofillRequest):
    """Generate a PDF with auto-filled form fields."""
    try:
        filled = {}
        for field in request.form_fields:
            field_lower = field.lower().replace(" ", "_")
            for key, value in request.user_data.items():
                key_lower = key.lower().replace(" ", "_")
                if key_lower == field_lower or key_lower in field_lower or field_lower in key_lower:
                    filled[field] = value
                    break
            if field not in filled:
                filled[field] = request.user_data.get(field, "")
        
        scheme_name = request.user_data.get("scheme_name", "Government Scheme")
        pdf_bytes = generate_autofill_pdf(filled, scheme_name)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="autofilled_form.pdf"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

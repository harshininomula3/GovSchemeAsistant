from pydantic import BaseModel
from typing import Optional, List

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    persona: str = "General Citizen"
    age_group: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    occupation: Optional[str] = None
    income_level: Optional[str] = None
    context: Optional[str] = ""
    needs: Optional[List[str]] = []
    keywords: Optional[List[str]] = []
    suggested_categories: Optional[List[str]] = []

class SchemeSearchRequest(BaseModel):
    keywords: Optional[str] = None
    category: Optional[str] = None
    state: Optional[str] = None
    target_group: Optional[str] = None
    persona: Optional[str] = None

class SchemeResponse(BaseModel):
    id: int
    name: str
    ministry: Optional[str] = None
    category: Optional[str] = None
    target_group: Optional[str] = None
    state: Optional[str] = None
    description: Optional[str] = None
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    how_to_apply: Optional[str] = None
    documents_required: Optional[str] = None
    official_url: Optional[str] = None

class ExplainResponse(BaseModel):
    scheme_name: str
    plain_english_summary: str
    key_benefits: List[str]
    eligibility_points: List[str]
    application_steps: List[str]

class DraftRequest(BaseModel):
    user_name: str
    user_details: str
    scheme_id: int
    additional_info: Optional[str] = None

class DraftResponse(BaseModel):
    draft_text: str
    scheme_name: str

class AutofillRequest(BaseModel):
    user_data: dict
    form_fields: List[str]

class AutofillResponse(BaseModel):
    filled_fields: dict
    pdf_available: bool

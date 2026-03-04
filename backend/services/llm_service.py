import os
import json
import asyncio
from groq import Groq
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def _ask_sync(prompt: str) -> str:
    """Send a prompt to Groq and return the text response (sync)."""
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2048,
    )
    return response.choices[0].message.content.strip()


async def _ask(prompt: str) -> str:
    """Async wrapper around the sync Groq call."""
    return await asyncio.to_thread(_ask_sync, prompt)


def _parse_json(text: str):
    """Try to parse JSON from LLM response, handling markdown fences."""
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        if text.endswith("```"):
            text = text[:-3]
        text = text.strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON object within the text
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
        # Try to find JSON array
        start = text.find("[")
        end = text.rfind("]") + 1
        if start != -1 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
    return None


async def analyze_persona(text: str) -> dict:
    """Analyze user input to extract persona, context, and needs."""
    prompt = f"""You are an expert at understanding Indian citizens' needs and matching them to government schemes.

Analyze the following user input and extract structured information. Return ONLY valid JSON (no markdown, no code blocks).

User Input: "{text}"

Return JSON with these fields:
{{
    "persona": "primary identity (e.g., Farmer, Student, Senior Citizen, Woman Entrepreneur, Daily Wage Worker, etc.)",
    "age_group": "estimated age group or null",
    "gender": "if mentioned or implied, else null",
    "location": "state or region if mentioned, else null",
    "occupation": "specific occupation if mentioned",
    "income_level": "if mentioned or implied (Low/Medium/High), else null",
    "context": "brief summary of their situation in 1-2 sentences",
    "needs": ["list", "of", "specific", "needs"],
    "keywords": ["relevant", "keywords", "for", "scheme", "search"],
    "suggested_categories": ["matching scheme categories"]
}}"""

    try:
        raw = await _ask(prompt)
        result = _parse_json(raw)
        if result and isinstance(result, dict):
            return result
    except Exception as e:
        print(f"[LLM ERROR] analyze_persona: {e}")

    return {
        "persona": "General Citizen",
        "age_group": None, "gender": None, "location": None,
        "occupation": None, "income_level": None,
        "context": text,
        "needs": ["general assistance"],
        "keywords": text.split()[:5],
        "suggested_categories": []
    }


async def explain_scheme(scheme_data: dict) -> dict:
    """Generate a plain-English explanation of a government scheme."""
    prompt = f"""You are a helpful government services advisor in India. Explain the following government scheme in simple English.

Scheme Details:
- Name: {scheme_data.get('name')}
- Ministry: {scheme_data.get('ministry')}
- Category: {scheme_data.get('category')}
- Description: {scheme_data.get('description')}
- Eligibility: {scheme_data.get('eligibility')}
- Benefits: {scheme_data.get('benefits')}
- How to Apply: {scheme_data.get('how_to_apply')}
- Documents Required: {scheme_data.get('documents_required')}

Return ONLY valid JSON with these fields:
{{
    "scheme_name": "full name",
    "plain_english_summary": "3-4 sentence explanation in simple language",
    "key_benefits": ["benefit 1", "benefit 2", "benefit 3"],
    "eligibility_points": ["point 1", "point 2"],
    "application_steps": ["step 1", "step 2", "step 3"]
}}"""

    try:
        raw = await _ask(prompt)
        result = _parse_json(raw)
        if result and isinstance(result, dict):
            return result
    except Exception as e:
        print(f"[LLM ERROR] explain_scheme: {e}")

    return {
        "scheme_name": scheme_data.get("name", "Unknown"),
        "plain_english_summary": scheme_data.get("description", ""),
        "key_benefits": [scheme_data.get("benefits", "See official website")],
        "eligibility_points": [scheme_data.get("eligibility", "See official website")],
        "application_steps": [scheme_data.get("how_to_apply", "See official website")]
    }


async def generate_draft(user_name: str, user_details: str, scheme_data: dict, additional_info: str = "") -> str:
    """Generate an application draft letter."""
    prompt = f"""Write a formal application letter for an Indian government scheme.

Applicant: {user_name}
Details: {user_details}
Additional Info: {additional_info}

Scheme: {scheme_data.get('name')}
Ministry: {scheme_data.get('ministry')}
Eligibility: {scheme_data.get('eligibility')}
How to Apply: {scheme_data.get('how_to_apply')}
Documents: {scheme_data.get('documents_required')}

Write a professional letter addressed to the appropriate authority. Use [YOUR_XXX] placeholders for missing info. Write ONLY the letter."""

    try:
        return await _ask(prompt)
    except Exception as e:
        print(f"[LLM ERROR] generate_draft: {e}")
        return f"[Draft generation failed. Please try again.]\n\nError: {str(e)}"


async def rank_schemes_for_user(user_context: str, schemes: list) -> list:
    """Use LLM to rank schemes by relevance."""
    if not schemes:
        return []

    schemes_subset = schemes[:20]
    schemes_summary = "\n".join([
        f"ID:{s['id']} | {s['name']} | Category:{s['category']} | Target:{s['target_group']}"
        for s in schemes_subset
    ])

    prompt = f"""Rank these government schemes by relevance to the user's situation.

User: {user_context}

Schemes:
{schemes_summary}

Return ONLY a JSON array of scheme IDs ordered by relevance. Example: [5, 12, 3]"""

    try:
        raw = await _ask(prompt)
        result = _parse_json(raw)
        if result and isinstance(result, list):
            id_to_scheme = {s["id"]: s for s in schemes}
            ranked = [id_to_scheme[sid] for sid in result if sid in id_to_scheme]
            ranked_set = {s["id"] for s in ranked}
            for s in schemes:
                if s["id"] not in ranked_set:
                    ranked.append(s)
            return ranked
    except Exception as e:
        print(f"[LLM ERROR] rank_schemes: {e}")

    return schemes

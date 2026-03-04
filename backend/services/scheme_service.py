from database import search_schemes, get_all_schemes
from services.llm_service import rank_schemes_for_user


async def find_matching_schemes(persona: str = None, keywords: str = None,
                                 category: str = None, state: str = None,
                                 target_group: str = None, context: str = None) -> list:
    """Find and rank schemes matching user criteria."""
    
    # Database keyword search
    db_results = search_schemes(
        keywords=keywords,
        category=category,
        state=state,
        target_group=target_group
    )
    
    # If no DB results, try broader search with just keywords
    if not db_results and keywords:
        individual_keywords = [k.strip() for k in keywords.split(",")]
        for kw in individual_keywords:
            results = search_schemes(keywords=kw)
            for r in results:
                if r not in db_results:
                    db_results.append(r)
    
    # If still no results, return all schemes for LLM ranking
    if not db_results:
        db_results = get_all_schemes()
    
    # Use LLM to rank by relevance if we have context
    if context and len(db_results) > 1:
        try:
            ranked = await rank_schemes_for_user(context, db_results)
            return ranked
        except Exception:
            pass
    
    return db_results

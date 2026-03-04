import json
import os
from database import get_connection

def seed_schemes():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if already seeded
    count = cursor.execute("SELECT COUNT(*) FROM schemes").fetchone()[0]
    if count > 0:
        print(f"Database already has {count} schemes. Skipping seed.")
        conn.close()
        return
    
    data_path = os.path.join(os.path.dirname(__file__), "data", "schemes.json")
    with open(data_path, "r", encoding="utf-8") as f:
        schemes = json.load(f)
    
    for scheme in schemes:
        cursor.execute("""
            INSERT INTO schemes (name, ministry, category, target_group, state, description,
                               eligibility, benefits, how_to_apply, documents_required, official_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            scheme.get("name"),
            scheme.get("ministry"),
            scheme.get("category"),
            scheme.get("target_group"),
            scheme.get("state", "Central"),
            scheme.get("description"),
            scheme.get("eligibility"),
            scheme.get("benefits"),
            scheme.get("how_to_apply"),
            scheme.get("documents_required"),
            scheme.get("official_url")
        ))
    
    conn.commit()
    print(f"Seeded {len(schemes)} schemes into database.")
    conn.close()

if __name__ == "__main__":
    from database import init_db
    init_db()
    seed_schemes()

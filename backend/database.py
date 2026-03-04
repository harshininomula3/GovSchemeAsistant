import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "schemes.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            ministry TEXT,
            category TEXT,
            target_group TEXT,
            state TEXT DEFAULT 'Central',
            description TEXT,
            eligibility TEXT,
            benefits TEXT,
            how_to_apply TEXT,
            documents_required TEXT,
            official_url TEXT
        )
    """)
    conn.commit()
    conn.close()

def get_all_schemes():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM schemes").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def search_schemes(keywords=None, category=None, state=None, target_group=None):
    conn = get_connection()
    query = "SELECT * FROM schemes WHERE 1=1"
    params = []

    if category:
        query += " AND LOWER(category) = LOWER(?)"
        params.append(category)

    if state and state.lower() != "all":
        query += " AND (LOWER(state) = LOWER(?) OR LOWER(state) = 'central')"
        params.append(state)

    if target_group:
        query += " AND LOWER(target_group) LIKE LOWER(?)"
        params.append(f"%{target_group}%")

    if keywords:
        keyword_list = [k.strip() for k in keywords.split(",") if k.strip()]
        if keyword_list:
            keyword_clauses = []
            for kw in keyword_list:
                keyword_clauses.append(
                    "(LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?) "
                    "OR LOWER(eligibility) LIKE LOWER(?) OR LOWER(benefits) LIKE LOWER(?) "
                    "OR LOWER(target_group) LIKE LOWER(?))"
                )
                params.extend([f"%{kw}%"] * 5)
            query += " AND (" + " OR ".join(keyword_clauses) + ")"

    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_scheme_by_id(scheme_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def get_scheme_count():
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM schemes").fetchone()[0]
    conn.close()
    return count

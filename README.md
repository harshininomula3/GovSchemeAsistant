# ⚖️ AI Legal & Government Scheme Assistant

An AI-powered web application that helps Indian citizens discover relevant government schemes, understand eligibility criteria in plain English, and generate ready-to-submit application letters — all from a simple text description of their situation.

---

## 🎯 What It Does

1. **Describe your situation** → _"I am a 30-year-old farmer with 2 acres of land in Rajasthan needing crop insurance"_
2. **AI analyzes your persona** → Identifies you as a Farmer, extracts needs (insurance, financial protection), and finds keywords
3. **Discovers matching schemes** → Searches 53+ government schemes and ranks them by relevance using LLM
4. **Explains in simple English** → Breaks down complex scheme details into benefits, eligibility, and step-by-step application process
5. **Generates application letter** → Collects your details and drafts a formal application letter
6. **Downloads as PDF** → One-click PDF download, ready to submit

---

## ✨ Features

### Core AI Features
- **Persona Analysis** — NLP-based extraction of occupation, age, location, income, and needs
- **Smart Scheme Matching** — Database search + LLM-powered relevance ranking
- **Plain English Explanations** — Complex government jargon translated to simple language
- **Application Letter Generation** — AI-drafted formal letters with user details filled in
- **PDF Export** — Downloadable PDF application letters via ReportLab

### Frontend Features
- **Black & Gold Minimalist Theme** — Clean dark UI with gold accents
- **Light/Dark Mode Toggle** — Persistent theme switching (☀️/🌙 button in navbar)
- **4-Step Assistant Workflow** — Describe → Discover → Understand → Apply
- **Scheme Bookmarking** — Save schemes with ⭐ for later reference
- **Search History** — All queries saved and reusable
- **User Authentication** — Login/Signup with localStorage persistence
- **Settings Page** — Theme toggle, profile management, privacy controls
- **My Activity Page** — View saved schemes and search history
- **Responsive Design** — Works on desktop and mobile
- **Smooth Animations** — Rise, fade, and hover micro-interactions

### Backend Features
- **FastAPI REST API** — High-performance async Python backend
- **SQLite Database** — 53+ curated Indian government schemes
- **Groq LLM Integration** — Uses Llama 3.3 70B for AI analysis
- **PDF Generation** — ReportLab-based PDF service
- **CORS Enabled** — Frontend-backend communication ready

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│              (React + Vite)                      │
│                                                  │
│  Home ─── Assistant ─── Settings ─── History     │
│  Login ─── Signup                                │
│  ThemeContext ─── AuthContext                     │
└──────────────────┬──────────────────────────────┘
                   │ HTTP (port 5173 → 8000)
┌──────────────────▼──────────────────────────────┐
│                   Backend                        │
│              (FastAPI + Uvicorn)                  │
│                                                  │
│  /api/analyze ─── /api/schemes ─── /api/explain  │
│  /api/draft ──── /api/autofill                   │
│                                                  │
│  Services: LLM (Groq) │ Scheme │ PDF             │
│  Database: SQLite (schemes.db)                   │
└──────────────────┬──────────────────────────────┘
                   │
          ┌────────▼────────┐
          │   Groq API      │
          │  (Llama 3.3 70B)│
          └─────────────────┘
```

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite 7, React Router DOM  |
| Styling    | Vanilla CSS, CSS Variables, Inter font |
| Backend    | Python, FastAPI, Uvicorn            |
| LLM        | Groq API (Llama 3.3 70B Versatile)  |
| Database   | SQLite                              |
| PDF        | ReportLab                           |
| Auth       | localStorage (frontend-only MVP)    |

---

## 📁 Project Structure

```
ai-legal-government-scheme-assistant/
│
├── backend/
│   ├── data/
│   │   └── schemes.json         # 53+ curated government schemes
│   ├── routers/
│   │   ├── analyze.py           # POST /api/analyze
│   │   ├── schemes.py           # POST/GET /api/schemes
│   │   ├── explain.py           # GET /api/explain/{id}
│   │   ├── draft.py             # POST /api/draft
│   │   └── autofill.py          # POST /api/autofill
│   ├── services/
│   │   ├── llm_service.py       # Groq LLM integration
│   │   ├── scheme_service.py    # Scheme matching logic
│   │   └── pdf_service.py       # PDF generation
│   ├── database.py              # SQLite schema & queries
│   ├── models.py                # Pydantic request/response models
│   ├── seed_data.py             # Database seeder
│   ├── main.py                  # FastAPI app entry point
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Navigation with theme toggle
│   │   │   └── Footer.jsx       # Footer with disclaimer
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx  # Light/dark theme provider
│   │   │   └── AuthContext.jsx   # Auth + history + bookmarks
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Assistant.jsx    # 4-step AI assistant workflow
│   │   │   ├── Login.jsx        # Sign in page
│   │   │   ├── Signup.jsx       # Create account page
│   │   │   ├── Settings.jsx     # Settings & preferences
│   │   │   └── History.jsx      # Saved schemes & history
│   │   ├── App.jsx              # Root with routes & providers
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Design system (dark & gold)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .env                          # API keys (not committed)
├── .gitignore
└── README.md
```

---

## 🚀 How to Run

### Prerequisites
- **Python 3.9+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **Groq API Key** — [Get free key](https://console.groq.com/keys)

### Step 1: Clone the Repository

```bash
git clone https://github.com/karthikeya0922/AI-Legal-Government-Scheme-Assistant.git
cd AI-Legal-Government-Scheme-Assistant
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the **root** directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Step 3: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 4: Install Frontend Dependencies

Open a **second terminal** (split terminal):

```bash
cd frontend
npm install
```

### Step 5: Run Both Servers (Split Terminal)

You need **two terminals running simultaneously**:

#### Terminal 1 — Backend (FastAPI)
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
✅ You should see: `[OK] Database initialized with 53 government schemes.`

#### Terminal 2 — Frontend (Vite)
```bash
cd frontend
npm run dev
```
✅ You should see: `Local: http://localhost:5173/`

### Step 6: Open in Browser

Navigate to **http://localhost:5173** in your browser.

> **💡 Split Terminal Tip (VS Code):**
> 1. Open the integrated terminal (`Ctrl + ~`)
> 2. Click the **split terminal** icon (⊞) in the top-right of the terminal panel
> 3. Run the backend in the left terminal, frontend in the right terminal
>
> **💡 Split Terminal Tip (Windows Terminal):**
> 1. Open Windows Terminal
> 2. Press `Alt + Shift + +` to split horizontally, or `Alt + Shift + -` to split vertically
> 3. Run each server in its own pane

---

## 📡 API Endpoints

| Method | Endpoint              | Description                              |
|--------|-----------------------|------------------------------------------|
| POST   | `/api/analyze`        | Analyze user input → persona, needs      |
| POST   | `/api/schemes`        | Search schemes by keywords, persona      |
| GET    | `/api/schemes`        | List all schemes (optional category filter) |
| GET    | `/api/schemes/{id}`   | Get scheme details by ID                 |
| GET    | `/api/explain/{id}`   | Get plain-English scheme explanation     |
| POST   | `/api/draft`          | Generate application letter text         |
| POST   | `/api/draft/pdf`      | Generate and download PDF letter         |
| GET    | `/api/categories`     | List all scheme categories               |
| GET    | `/health`             | Health check                             |
| GET    | `/docs`               | Interactive Swagger API docs             |

---

## 🎨 Theme

The app uses a **black & gold minimalist** design with light/dark mode support:

- **Dark mode** (default): Pure black background (#0a0a0a) with gold accents (#d4a843)
- **Light mode**: Warm off-white (#fafaf8) with deeper gold (#b8932e)
- Toggle via the ☀️/🌙 button in the navbar
- Theme preference is saved in localStorage

---

## 📜 Government Schemes Covered

The database includes **53+ schemes** across these categories:

- Agriculture & Rural Development
- Education & Scholarships
- Healthcare & Insurance
- MSME & Entrepreneurship
- Women & Child Development
- Housing & Urban Development
- Employment & Skill Development
- Pension & Social Security
- Financial Inclusion
- Food Security
- Energy & Sustainability
- Disability Welfare

---

## ⚠️ Disclaimer

This tool provides **AI-generated guidance only**. It is not a substitute for official government advice. Always verify scheme details, eligibility, and application procedures through official government portals before submitting any applications.

---

## 📄 License

This project is for educational and demonstration purposes.

---

## 👤 Author

**Karthikeya** — [@karthikeya0922](https://github.com/karthikeya0922)

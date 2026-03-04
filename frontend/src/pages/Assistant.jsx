import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Assistant.css'

const API = 'http://localhost:8000/api'

const CATEGORIES = [
    'All', 'Agriculture', 'Education', 'Healthcare', 'MSME & Entrepreneurship',
    'Women & Child Development', 'Housing', 'Employment', 'Skill Development',
    'Pension & Social Security', 'Insurance', 'Financial Inclusion',
    'Food Security', 'Energy', 'Disability Welfare'
]

export default function Assistant() {
    const location = useLocation()
    const { addToHistory, toggleBookmark, isBookmarked } = useAuth()
    const [step, setStep] = useState(1)
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Step 1 results
    const [analysis, setAnalysis] = useState(null)
    // Step 2 results
    const [schemes, setSchemes] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('All')
    // Step 3 - selected scheme + explanation
    const [selectedScheme, setSelectedScheme] = useState(null)
    const [explanation, setExplanation] = useState(null)
    const [explainLoading, setExplainLoading] = useState(false)
    // Step 4 - application
    const [userForm, setUserForm] = useState({
        name: '', age: '', address: '', occupation: '', income: '',
        phone: '', email: '', additional: ''
    })
    const [draft, setDraft] = useState(null)
    const [draftLoading, setDraftLoading] = useState(false)
    const [pdfLoading, setPdfLoading] = useState(false)

    useEffect(() => {
        if (location.state?.query) {
            setQuery(location.state.query)
        }
    }, [location.state])

    // Step 1: Analyze user input
    const handleAnalyze = async () => {
        if (!query.trim()) return
        setLoading(true)
        setError('')
        try {
            console.log('Sending analyze request with text:', query)
            const res = await fetch(`${API}/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: query })
            })
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.detail || `Server error ${res.status}`)
            }
            const data = await res.json()
            setAnalysis(data)
            addToHistory(query, data)

            // Auto-search schemes
            try {
                const schemeRes = await fetch(`${API}/schemes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        keywords: data.keywords?.join(',') || '',
                        persona: data.persona,
                        target_group: data.persona
                    })
                })
                if (schemeRes.ok) {
                    setSchemes(await schemeRes.json())
                }
            } catch (e) {
                console.warn('Scheme search failed:', e)
            }
            setStep(2)
        } catch (err) {
            setError(err.message || 'Failed to analyze. Ensure backend is running on port 8000.')
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Select scheme and get explanation
    const handleSelectScheme = async (scheme) => {
        setSelectedScheme(scheme)
        setExplainLoading(true)
        setExplanation(null)
        setStep(3)
        try {
            const res = await fetch(`${API}/explain/${scheme.id}`)
            if (res.ok) {
                setExplanation(await res.json())
            }
        } catch {
            console.warn('Explanation failed')
        } finally {
            setExplainLoading(false)
        }
    }

    // Step 4: Generate draft
    const handleGenerateDraft = async () => {
        if (!selectedScheme) return
        setDraftLoading(true)
        setError('')
        try {
            const userDetails = [
                userForm.name && `Name: ${userForm.name}`,
                userForm.age && `Age: ${userForm.age}`,
                userForm.address && `Address: ${userForm.address}`,
                userForm.occupation && `Occupation: ${userForm.occupation}`,
                userForm.income && `Annual Income: ${userForm.income}`,
                userForm.phone && `Phone: ${userForm.phone}`,
                userForm.email && `Email: ${userForm.email}`,
            ].filter(Boolean).join(', ')

            const res = await fetch(`${API}/draft`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: userForm.name || 'Applicant',
                    user_details: userDetails || query,
                    scheme_id: selectedScheme.id,
                    additional_info: userForm.additional
                })
            })
            if (res.ok) {
                setDraft(await res.json())
            } else {
                throw new Error('Draft generation failed')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setDraftLoading(false)
        }
    }

    // Download PDF
    const handleDownloadPDF = async () => {
        setPdfLoading(true)
        try {
            const userDetails = [
                userForm.name && `Name: ${userForm.name}`,
                userForm.age && `Age: ${userForm.age}`,
                userForm.address && `Address: ${userForm.address}`,
                userForm.occupation && `Occupation: ${userForm.occupation}`,
                userForm.income && `Annual Income: ${userForm.income}`,
            ].filter(Boolean).join(', ')

            const res = await fetch(`${API}/draft/pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: userForm.name || 'Applicant',
                    user_details: userDetails || query,
                    scheme_id: selectedScheme.id,
                    additional_info: userForm.additional
                })
            })
            if (res.ok) {
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `Application_${selectedScheme.name.replace(/\s+/g, '_')}.pdf`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            } else {
                throw new Error('PDF generation failed')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setPdfLoading(false)
        }
    }

    const filteredSchemes = selectedCategory === 'All'
        ? schemes
        : schemes.filter(s => s.category === selectedCategory)

    const resetAll = () => {
        setStep(1); setQuery(''); setAnalysis(null); setSchemes([])
        setSelectedScheme(null); setExplanation(null); setDraft(null)
        setUserForm({ name: '', age: '', address: '', occupation: '', income: '', phone: '', email: '', additional: '' })
        setError('')
    }

    const updateForm = (field, value) => setUserForm(prev => ({ ...prev, [field]: value }))

    return (
        <div className="assistant">
            <div className="container">
                {/* Header */}
                <div className="assistant-header">
                    <h1>AI Assistant</h1>
                    <p>Describe your situation and let AI find the right government schemes for you.</p>
                    {step > 1 && <button className="btn btn-ghost" onClick={resetAll}>← Start Over</button>}
                </div>

                {/* Progress Bar */}
                <div className="progress-bar">
                    {['Describe', 'Discover', 'Understand', 'Apply'].map((label, i) => (
                        <div key={i}
                            className={`progress-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}
                            onClick={() => { if (step > i + 1) setStep(i + 1) }}
                            style={{ cursor: step > i + 1 ? 'pointer' : 'default' }}
                        >
                            <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="error-banner">
                        <span>⚠️</span> {error}
                        <button onClick={() => setError('')}>✕</button>
                    </div>
                )}

                {/* ========== STEP 1: DESCRIBE ========== */}
                {step === 1 && (
                    <div className="step-content rise">
                        <div className="input-section card">
                            <h2>📝 Tell us about your situation</h2>
                            <p className="input-hint">
                                Describe who you are, your situation, and what help you need.
                                Mention your occupation, age, location, income level, etc.
                            </p>
                            <textarea
                                className="query-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Example: I am a 35-year-old farmer in Rajasthan with 2 acres of land. I need help with crop insurance and loan repayment..."
                                rows={5}
                            />
                            <div className="input-actions">
                                <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading || !query.trim()}>
                                    {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Analyzing...</> : '🔍 Analyze & Find Schemes'}
                                </button>
                                <span className="char-count">{query.length} chars</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== STEP 2: DISCOVER ========== */}
                {step === 2 && analysis && (
                    <div className="step-content rise">
                        {/* Analysis Summary */}
                        <div className="analysis-card card">
                            <h3>🧠 AI Analysis</h3>
                            <div className="analysis-grid">
                                <div className="analysis-item"><span className="analysis-label">Persona</span><span className="badge">{analysis.persona}</span></div>
                                {analysis.occupation && <div className="analysis-item"><span className="analysis-label">Occupation</span><span className="analysis-value">{analysis.occupation}</span></div>}
                                {analysis.location && <div className="analysis-item"><span className="analysis-label">Location</span><span className="analysis-value">{analysis.location}</span></div>}
                                {analysis.income_level && <div className="analysis-item"><span className="analysis-label">Income</span><span className="analysis-value">{analysis.income_level}</span></div>}
                            </div>
                            {analysis.context && <div className="analysis-context"><p>{analysis.context}</p></div>}
                            {analysis.needs?.length > 0 && (
                                <div className="analysis-tags">
                                    <span className="analysis-label">Needs:</span>
                                    {analysis.needs.map((n, i) => <span key={i} className="tag">{n}</span>)}
                                </div>
                            )}
                        </div>

                        {/* Scheme Results */}
                        <div className="schemes-section">
                            <div className="schemes-header">
                                <h2>📋 Matching Schemes ({filteredSchemes.length})</h2>
                                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="filter-select">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {filteredSchemes.length === 0 ? (
                                <div className="no-results card"><p>No schemes found. Try "All" categories.</p></div>
                            ) : (
                                <div className="schemes-grid">
                                    {filteredSchemes.map(scheme => (
                                        <div key={scheme.id} className="scheme-card card card-glow" onClick={() => handleSelectScheme(scheme)}>
                                            <div className="scheme-card-top">
                                                <span className="badge">{scheme.category}</span>
                                                <button className="bookmark-btn" onClick={(e) => { e.stopPropagation(); toggleBookmark(scheme) }} title={isBookmarked(scheme.id) ? 'Remove bookmark' : 'Bookmark'}>
                                                    {isBookmarked(scheme.id) ? '⭐' : '☆'}
                                                </button>
                                            </div>
                                            <h3>{scheme.name}</h3>
                                            <p className="scheme-desc">{scheme.description?.slice(0, 100)}...</p>
                                            <button className="btn btn-ghost scheme-view-btn">Select & Learn More →</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========== STEP 3: UNDERSTAND ========== */}
                {step === 3 && selectedScheme && (
                    <div className="step-content rise">
                        <div className="understand-card card">
                            <div className="understand-header">
                                <div>
                                    <span className="badge">{selectedScheme.category}</span>
                                    <h2>{selectedScheme.name}</h2>
                                    {selectedScheme.ministry && <p className="scheme-ministry">🏛️ {selectedScheme.ministry}</p>}
                                </div>
                                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back to Schemes</button>
                            </div>

                            {explainLoading ? (
                                <div className="loading-container"><div className="spinner"></div><p>Getting plain-English explanation...</p></div>
                            ) : explanation ? (
                                <div className="explain-content">
                                    <div className="explain-summary">
                                        <h3>📖 In Simple Words</h3>
                                        <p>{explanation.plain_english_summary}</p>
                                    </div>
                                    <div className="explain-columns">
                                        <div className="explain-section">
                                            <h4>✅ Key Benefits</h4>
                                            <ul>{explanation.key_benefits?.map((b, i) => <li key={i}>{b}</li>)}</ul>
                                        </div>
                                        <div className="explain-section">
                                            <h4>📋 Who Can Apply</h4>
                                            <ul>{explanation.eligibility_points?.map((e, i) => <li key={i}>{e}</li>)}</ul>
                                        </div>
                                    </div>
                                    <div className="explain-section">
                                        <h4>📝 How to Apply</h4>
                                        <ol>{explanation.application_steps?.map((s, i) => <li key={i}>{s}</li>)}</ol>
                                    </div>
                                </div>
                            ) : (
                                <div className="explain-content">
                                    <div className="explain-section"><h4>Description</h4><p>{selectedScheme.description}</p></div>
                                    <div className="explain-section"><h4>Eligibility</h4><p>{selectedScheme.eligibility}</p></div>
                                    <div className="explain-section"><h4>Benefits</h4><p>{selectedScheme.benefits}</p></div>
                                </div>
                            )}

                            {selectedScheme.official_url && (
                                <a href={selectedScheme.official_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ marginTop: 8 }}>
                                    🌐 Official Website →
                                </a>
                            )}

                            <div className="step-nav">
                                <button className="btn btn-primary" onClick={() => setStep(4)}>
                                    Proceed to Apply →
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== STEP 4: APPLY ========== */}
                {step === 4 && selectedScheme && (
                    <div className="step-content rise">
                        <div className="apply-card card">
                            <div className="apply-header">
                                <h2>📄 Apply for {selectedScheme.name}</h2>
                                <button className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
                            </div>

                            {/* User Details Form */}
                            {!draft && (
                                <>
                                    <p className="form-hint">Fill in your details below. These will be used to generate your application letter.</p>
                                    <div className="apply-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Full Name *</label>
                                                <input type="text" className="draft-input" placeholder="Enter your full name" value={userForm.name} onChange={e => updateForm('name', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Age</label>
                                                <input type="text" className="draft-input" placeholder="e.g. 35" value={userForm.age} onChange={e => updateForm('age', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Full Address</label>
                                            <input type="text" className="draft-input" placeholder="Village/City, District, State, PIN Code" value={userForm.address} onChange={e => updateForm('address', e.target.value)} />
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Occupation</label>
                                                <input type="text" className="draft-input" placeholder="e.g. Farmer, Student" value={userForm.occupation} onChange={e => updateForm('occupation', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Annual Income</label>
                                                <input type="text" className="draft-input" placeholder="e.g. ₹1,50,000" value={userForm.income} onChange={e => updateForm('income', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Phone Number</label>
                                                <input type="text" className="draft-input" placeholder="10-digit mobile number" value={userForm.phone} onChange={e => updateForm('phone', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="email" className="draft-input" placeholder="your@email.com" value={userForm.email} onChange={e => updateForm('email', e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Additional Information</label>
                                            <textarea className="draft-input" rows={3} placeholder="Any extra details relevant to your application..." value={userForm.additional} onChange={e => updateForm('additional', e.target.value)} />
                                        </div>
                                        <button className="btn btn-primary" onClick={handleGenerateDraft} disabled={draftLoading || !userForm.name.trim()}>
                                            {draftLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Generating...</> : '✨ Generate Application Letter'}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Draft Result */}
                            {draft && (
                                <div className="draft-result">
                                    <div className="draft-result-header">
                                        <h3>Your Application Letter</h3>
                                        <span className="badge">For: {draft.scheme_name}</span>
                                    </div>
                                    <div className="draft-text">
                                        <pre>{draft.draft_text}</pre>
                                    </div>
                                    <div className="draft-actions">
                                        <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={pdfLoading}>
                                            {pdfLoading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Preparing PDF...</> : '📥 Download as PDF'}
                                        </button>
                                        <button className="btn btn-ghost" onClick={() => navigator.clipboard.writeText(draft.draft_text)}>
                                            📋 Copy Text
                                        </button>
                                        <button className="btn btn-ghost" onClick={() => setDraft(null)}>
                                            ✏️ Edit Details & Regenerate
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

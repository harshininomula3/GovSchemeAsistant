import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const EXAMPLE_QUERIES = [
    "I am a 30-year-old farmer with 2 acres of land in Rajasthan and need crop insurance",
    "I'm a female entrepreneur starting a small business in Mumbai",
    "I am a senior citizen aged 65 looking for pension schemes",
    "I'm a college student from a low-income family looking for scholarships",
    "I have a disability and need employment support in Delhi",
    "I want to build a house under government housing scheme"
]

export default function Home() {
    const [hoveredQuery, setHoveredQuery] = useState(null)
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleTryQuery = (q) => navigate('/assistant', { state: { query: q } })

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-orb orb-1"></div>
                    <div className="hero-orb orb-2"></div>
                </div>
                <div className="container hero-content rise">
                    <div className="hero-badge">🇮🇳 AI-Powered • Government Schemes</div>
                    <h1>
                        Discover Government Schemes
                        <span className="gold-text"> Built for You</span>
                    </h1>
                    <p className="hero-desc">
                        Describe your situation in plain English. Our AI analyzes your needs,
                        finds matching schemes, explains eligibility, and drafts your application letter.
                    </p>
                    <div className="hero-actions">
                        <Link to="/assistant" className="btn btn-primary btn-lg">
                            🔍 Start Discovery
                        </Link>
                        {!user && (
                            <Link to="/signup" className="btn btn-ghost btn-lg">
                                Create Account
                            </Link>
                        )}
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><span className="stat-num">53+</span><span className="stat-label">Schemes</span></div>
                        <div className="stat-divider"></div>
                        <div className="stat"><span className="stat-num">18</span><span className="stat-label">Categories</span></div>
                        <div className="stat-divider"></div>
                        <div className="stat"><span className="stat-num">AI</span><span className="stat-label">Powered</span></div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title rise">How It Works</h2>
                    <div className="features-grid">
                        {[
                            { icon: '🧠', title: 'AI Analysis', desc: 'Describe your situation. Our AI identifies your persona, needs, and matches you with relevant schemes.' },
                            { icon: '📋', title: 'Smart Matching', desc: 'Get a curated list of government schemes ranked by relevance to your specific situation.' },
                            { icon: '📖', title: 'Plain English', desc: 'Complex scheme details explained in simple language anyone can understand.' },
                            { icon: '📄', title: 'Auto-Draft', desc: 'Generate formal application letters and download them as PDF — ready to submit.' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card card card-glow rise" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className="feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Example Queries */}
            <section className="examples-section">
                <div className="container">
                    <h2 className="section-title rise">Try an Example</h2>
                    <p className="section-subtitle">Click any example to try it instantly</p>
                    <div className="examples-grid">
                        {EXAMPLE_QUERIES.map((q, i) => (
                            <div
                                key={i}
                                className={`example-card card rise ${hoveredQuery === i ? 'hovered' : ''}`}
                                style={{ animationDelay: `${i * 0.05}s` }}
                                onClick={() => handleTryQuery(q)}
                                onMouseEnter={() => setHoveredQuery(i)}
                                onMouseLeave={() => setHoveredQuery(null)}
                            >
                                <p>"{q}"</p>
                                <span className="example-arrow">→</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section rise">
                <div className="container">
                    <div className="cta-card card">
                        <h2>Ready to find your schemes?</h2>
                        <p>Describe your situation and let AI guide you to the right government benefits.</p>
                        <Link to="/assistant" className="btn btn-primary btn-lg">Get Started →</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

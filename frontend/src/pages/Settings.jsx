import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './Settings.css'

export default function Settings() {
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <div className="settings-page">
            <div className="container">
                <div className="settings-header rise">
                    <h1>⚙️ Settings</h1>
                    <p>Customize your experience</p>
                </div>

                <div className="settings-grid">
                    {/* Profile */}
                    <div className="settings-card card rise">
                        <h3>👤 Profile</h3>
                        {user ? (
                            <div className="profile-info">
                                <div className="profile-avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
                                <div>
                                    <p className="profile-name">{user.name}</p>
                                    <p className="profile-email">{user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-dim">Not logged in</p>
                        )}
                        {user ? (
                            <button className="btn btn-danger" onClick={handleLogout}>🚪 Sign Out</button>
                        ) : (
                            <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
                        )}
                    </div>

                    {/* Appearance */}
                    <div className="settings-card card rise" style={{ animationDelay: '0.1s' }}>
                        <h3>🎨 Appearance</h3>
                        <div className="setting-row">
                            <div>
                                <p className="setting-label">Theme</p>
                                <p className="setting-desc">Switch between dark and light modes</p>
                            </div>
                            <button className="theme-toggle" onClick={toggleTheme}>
                                <span className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}>🌙</span>
                                <span className={`toggle-option ${theme === 'light' ? 'active' : ''}`}>☀️</span>
                            </button>
                        </div>
                        <div className="theme-preview">
                            <div className={`preview-box ${theme === 'dark' ? 'selected' : ''}`} onClick={() => toggleTheme()}>
                                <div className="preview-dark">
                                    <div className="pv-bar"></div>
                                    <div className="pv-lines"><div></div><div></div><div></div></div>
                                </div>
                                <span>Dark</span>
                            </div>
                            <div className={`preview-box ${theme === 'light' ? 'selected' : ''}`} onClick={() => toggleTheme()}>
                                <div className="preview-light">
                                    <div className="pv-bar"></div>
                                    <div className="pv-lines"><div></div><div></div><div></div></div>
                                </div>
                                <span>Light</span>
                            </div>
                        </div>
                    </div>

                    {/* About */}
                    <div className="settings-card card rise" style={{ animationDelay: '0.2s' }}>
                        <h3>ℹ️ About</h3>
                        <div className="about-info">
                            <p><strong>AI Legal & Government Scheme Assistant</strong></p>
                            <p className="text-dim">Version 1.0.0</p>
                            <p className="text-dim" style={{ marginTop: 8 }}>An AI-powered platform to help Indian citizens discover relevant government schemes, understand eligibility, and generate application letters.</p>
                        </div>
                        <div className="about-tech">
                            <span className="badge">React</span>
                            <span className="badge">FastAPI</span>
                            <span className="badge">Groq LLM</span>
                            <span className="badge">SQLite</span>
                        </div>
                    </div>

                    {/* Privacy */}
                    <div className="settings-card card rise" style={{ animationDelay: '0.3s' }}>
                        <h3>🔒 Privacy & Data</h3>
                        <p className="text-dim" style={{ fontSize: 13 }}>Your data is stored locally in your browser. No personal data is sent to external servers except when analyzing queries via the AI model.</p>
                        <div className="setting-row" style={{ marginTop: 12 }}>
                            <p className="setting-label">Clear All Local Data</p>
                            <button className="btn btn-danger" onClick={() => {
                                if (confirm('This will clear all saved data. Continue?')) {
                                    localStorage.clear()
                                    window.location.reload()
                                }
                            }}>🗑️ Clear Data</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

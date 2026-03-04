import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './History.css'

export default function History() {
    const { history, clearHistory, bookmarks, toggleBookmark } = useAuth()
    const navigate = useNavigate()

    return (
        <div className="history-page">
            <div className="container">
                <div className="history-header rise">
                    <h1>📚 My Activity</h1>
                    <p>Your saved schemes and search history</p>
                </div>

                {/* Bookmarked Schemes */}
                <section className="history-section rise">
                    <div className="section-top">
                        <h2>⭐ Saved Schemes ({bookmarks.length})</h2>
                    </div>
                    {bookmarks.length === 0 ? (
                        <div className="empty-state card">
                            <p>No saved schemes yet. Browse the assistant to bookmark schemes you're interested in.</p>
                            <button className="btn btn-primary" onClick={() => navigate('/assistant')}>Go to Assistant</button>
                        </div>
                    ) : (
                        <div className="bookmarks-grid">
                            {bookmarks.map(scheme => (
                                <div key={scheme.id} className="bookmark-card card">
                                    <div className="bookmark-top">
                                        <span className="badge">{scheme.category}</span>
                                        <button className="bookmark-remove" onClick={() => toggleBookmark(scheme)} title="Remove">✕</button>
                                    </div>
                                    <h3>{scheme.name}</h3>
                                    <p className="text-dim">{scheme.description?.slice(0, 100)}...</p>
                                    <span className="text-muted" style={{ fontSize: 10 }}>Saved {new Date(scheme.savedAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Search History */}
                <section className="history-section rise" style={{ animationDelay: '0.1s' }}>
                    <div className="section-top">
                        <h2>🕐 Search History ({history.length})</h2>
                        {history.length > 0 && (
                            <button className="btn btn-ghost" onClick={clearHistory}>🗑️ Clear All</button>
                        )}
                    </div>
                    {history.length === 0 ? (
                        <div className="empty-state card">
                            <p>No search history yet. Start by describing your situation in the assistant.</p>
                        </div>
                    ) : (
                        <div className="history-list">
                            {history.map(entry => (
                                <div key={entry.id} className="history-item card" onClick={() => navigate('/assistant', { state: { query: entry.query } })}>
                                    <div className="history-item-top">
                                        <span className="badge">{entry.analysis?.persona || 'General'}</span>
                                        <span className="text-muted" style={{ fontSize: 11 }}>{new Date(entry.date).toLocaleString()}</span>
                                    </div>
                                    <p className="history-query">"{entry.query}"</p>
                                    {entry.analysis?.needs && (
                                        <div className="history-tags">
                                            {entry.analysis.needs.slice(0, 3).map((n, i) => (
                                                <span key={i} className="tag-small">{n}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

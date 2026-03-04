import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = () => { logout(); navigate('/login'); setMenuOpen(false) }

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-inner">
                <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                    <span className="logo-icon">⚖️</span>
                    <span className="logo-text">LegalAI</span>
                </Link>

                <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? '✕' : '☰'}
                </button>

                <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
                    <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
                    <NavLink to="/assistant" onClick={() => setMenuOpen(false)}>Assistant</NavLink>
                    {user && <NavLink to="/history" onClick={() => setMenuOpen(false)}>My Activity</NavLink>}
                    <NavLink to="/settings" onClick={() => setMenuOpen(false)}>Settings</NavLink>
                </div>

                <div className={`nav-right ${menuOpen ? 'open' : ''}`}>
                    <button className="theme-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    {user ? (
                        <div className="user-menu">
                            <button className="btn btn-ghost nav-btn" onClick={handleLogout}>Sign Out</button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary nav-btn" onClick={() => setMenuOpen(false)}>Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

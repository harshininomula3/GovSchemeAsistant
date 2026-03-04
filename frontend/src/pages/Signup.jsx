import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Signup() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!name || !email || !password) { setError('Please fill in all fields'); return }
        if (password.length < 6) { setError('Password must be at least 6 characters'); return }
        if (password !== confirm) { setError('Passwords do not match'); return }
        setLoading(true)
        setTimeout(() => {
            const result = signup(name, email, password)
            if (result.success) navigate('/assistant')
            else setError(result.error)
            setLoading(false)
        }, 500)
    }

    return (
        <div className="auth-page">
            <div className="auth-container rise">
                <div className="auth-header">
                    <div className="auth-logo">⚖️</div>
                    <h1>Create Account</h1>
                    <p>Join us to discover government schemes tailored for you</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">⚠️ {error}</div>}
                    <div className="auth-field">
                        <label>Full Name</label>
                        <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="auth-field">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="auth-field">
                        <label>Confirm Password</label>
                        <input type="password" placeholder="Re-enter password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Creating...</> : 'Create Account'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        if (!email || !password) { setError('Please fill in all fields'); return }
        setLoading(true)
        setTimeout(() => {
            const result = login(email, password)
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your saved schemes and history</p>
                </div>
                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="auth-error">⚠️ {error}</div>}
                    <div className="auth-field">
                        <label>Email Address</label>
                        <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="auth-field">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                        {loading ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span> Signing in...</> : 'Sign In'}
                    </button>
                </form>
                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Create one</Link></p>
                </div>
            </div>
        </div>
    )
}

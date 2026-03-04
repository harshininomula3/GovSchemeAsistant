import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('search_history')
        return saved ? JSON.parse(saved) : []
    })

    const [bookmarks, setBookmarks] = useState(() => {
        const saved = localStorage.getItem('bookmarks')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        if (user) localStorage.setItem('user', JSON.stringify(user))
        else localStorage.removeItem('user')
    }, [user])

    useEffect(() => { localStorage.setItem('search_history', JSON.stringify(history)) }, [history])
    useEffect(() => { localStorage.setItem('bookmarks', JSON.stringify(bookmarks)) }, [bookmarks])

    const login = (email, password) => {
        // Frontend-only auth for MVP
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const found = users.find(u => u.email === email && u.password === password)
        if (found) {
            setUser({ name: found.name, email: found.email })
            return { success: true }
        }
        return { success: false, error: 'Invalid email or password' }
    }

    const signup = (name, email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' }
        }
        users.push({ name, email, password })
        localStorage.setItem('users', JSON.stringify(users))
        setUser({ name, email })
        return { success: true }
    }

    const logout = () => setUser(null)

    const addToHistory = (query, analysis) => {
        const entry = { id: Date.now(), query, analysis, date: new Date().toISOString() }
        setHistory(prev => [entry, ...prev].slice(0, 50))
    }

    const clearHistory = () => setHistory([])

    const toggleBookmark = (scheme) => {
        setBookmarks(prev => {
            const exists = prev.find(s => s.id === scheme.id)
            if (exists) return prev.filter(s => s.id !== scheme.id)
            return [...prev, { ...scheme, savedAt: new Date().toISOString() }]
        })
    }

    const isBookmarked = (id) => bookmarks.some(s => s.id === id)

    return (
        <AuthContext.Provider value={{
            user, login, signup, logout,
            history, addToHistory, clearHistory,
            bookmarks, toggleBookmark, isBookmarked
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Assistant from './pages/Assistant'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import History from './pages/History'
import './App.css'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

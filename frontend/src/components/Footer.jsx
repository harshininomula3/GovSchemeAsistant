import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <span className="footer-logo">⚖️ LegalAI</span>
                    <p>AI-powered government scheme discovery for Indian citizens</p>
                </div>
                <div className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/assistant">Assistant</Link>
                    <Link to="/settings">Settings</Link>
                </div>
                <div className="footer-bottom">
                    <p>⚠️ This tool provides AI-generated information for guidance only. Always verify with official government sources.</p>
                    <p className="footer-copy">© 2026 LegalAI — Built with ❤️ for Indian Citizens</p>
                </div>
            </div>
        </footer>
    )
}

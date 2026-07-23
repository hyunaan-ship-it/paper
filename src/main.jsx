import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>
            롤링페이퍼 화면을 불러오는 중 오류가 발생했습니다 🌸
          </h2>
          <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '24px' }}>
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => { window.location.reload(); }}
            style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 14px rgba(168,85,247,0.4)' }}
          >
            페이지 새로고침하기
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

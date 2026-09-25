import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Analytics } from '@vercel/analytics/react'
import './style.css'
import { initializeAnalytics } from './analytics'
initializeAnalytics()
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /><Analytics /></React.StrictMode>)


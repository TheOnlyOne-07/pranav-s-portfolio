import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { IntroProvider } from './context/IntroContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IntroProvider>
      <App />
    </IntroProvider>
  </React.StrictMode>,
)

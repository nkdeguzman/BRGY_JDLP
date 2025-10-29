import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ThemeProvider } from '@mui/material'
import theme from './theme/theme'
import { SettingsProvider } from './context/SettingsContext.jsx'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<ThemeProvider theme={theme}>
<SettingsProvider>
<App />
</SettingsProvider>
</ThemeProvider>
</BrowserRouter>
</React.StrictMode>
)
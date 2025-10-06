import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './routes/index'
import { SectionPage } from './routes/section/[slug]'
import { AppShell } from './components/layout/AppShell'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/section/:slug" element={<SectionPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App

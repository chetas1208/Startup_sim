import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RunPage from './pages/RunPage'
import HistoryPage from './pages/HistoryPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">
                  Startup Sim Agent
                </h1>
              </div>
              <div className="flex space-x-4">
                <a href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  New Simulation
                </a>
                <a href="/history" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  History
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/run/:runId" element={<RunPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

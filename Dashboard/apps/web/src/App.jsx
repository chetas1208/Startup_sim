import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import ResearchProgress from './pages/ResearchProgress';
import Dashboard from './pages/Dashboard';
import { getResults } from './services/api';

const SCREENS = {
  LANDING: 'landing',
  RESEARCH: 'research',
  DASHBOARD: 'dashboard',
};

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LANDING);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const transition = (nextScreen) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(nextScreen);
      setTransitioning(false);
    }, 300);
  };

  const handleSubmit = (q) => {
    setQuery(q);
    transition(SCREENS.RESEARCH);
  };

  const handleResearchComplete = async () => {
    const data = await getResults('mock-run-001');
    data.query = query;
    setResults(data);
    transition(SCREENS.DASHBOARD);
  };

  const handleNewSearch = () => {
    setQuery('');
    setResults(null);
    transition(SCREENS.LANDING);
  };

  useEffect(() => {
    if (screen === SCREENS.LANDING) {
      window.scrollTo(0, 0);
    }
  }, [screen]);

  return (
    <div
      className={`min-h-screen transition-opacity duration-300 ${
        transitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {screen === SCREENS.LANDING && <LandingPage onSubmit={handleSubmit} />}
      {screen === SCREENS.RESEARCH && (
        <ResearchProgress query={query} onComplete={handleResearchComplete} />
      )}
      {screen === SCREENS.DASHBOARD && results && (
        <Dashboard data={results} onNewSearch={handleNewSearch} />
      )}
    </div>
  );
}

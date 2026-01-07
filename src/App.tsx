import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Stats from './pages/Stats';
import Page2 from './pages/Page2';
import Footer from './components/Layout/Footer';
import { useEffect } from 'react';

import './game/gameEngine';
import './game/tick';
import { cleanupTickSystem, startTickInterval, startAutoSaveInterval } from './game/tick';
import { gameEngine } from './game/gameEngine';
import { useGameStore } from './game/gameStore';

/**
 * Main App Component
 *
 * This component sets up the application structure with:
 * - Game logic hooks (persistence, ticks, production)
 * - Routing for different pages
 * - Global layout and footer
 */
function App() {
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  // Initialize game when app loads
  useEffect(() => {
    const initGame = async () => {
      await gameEngine.initialize();
      syncWithEngine();
    };
    initGame();
  }, [syncWithEngine]);

  // Start tick system when app mounts
  useEffect(() => {
    startTickInterval();
    startAutoSaveInterval();
    
    return () => {
      cleanupTickSystem();
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Main app layout */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="stats" element={<Stats />} />
          <Route path="page2" element={<Page2 />} />
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

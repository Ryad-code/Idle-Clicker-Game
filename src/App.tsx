import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Stats from './pages/Stats';
import AuthPage from './pages/AuthPage';
import Footer from './components/Layout/Footer';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';

import './game/gameEngine';
import './game/tick';
import { setUserId, cleanupTickSystem, startTickInterval, startAutoSaveInterval } from './game/tick';
import { gameEngine } from './game/gameEngine';
import { useGameStore } from './game/gameStore';

/**
 * Main App Component
 *
 * This component sets up the application structure with:
 * - Authentication handling
 * - Game logic hooks (persistence, ticks, production)
 * - Routing for different pages
 * - Global layout and footer
 */
function App() {
  const user = useAuth();
  const syncWithEngine = useGameStore(state => state.syncWithEngine);

  // Initialize game when user changes
  useEffect(() => {
    const initGame = async () => {
      await gameEngine.initialize(user?.id || null);
      syncWithEngine();
    };
    initGame();
  }, [user?.id, syncWithEngine]);

  // Set userId for auto-save when user changes
  useEffect(() => {
    setUserId(user?.id);
  }, [user?.id]);

  // Start tick system when app mounts
  useEffect(() => {
    startTickInterval();
    startAutoSaveInterval();
    
    return () => {
      cleanupTickSystem();
    };
  }, []);

  // Show loading state while checking authentication
  if (user === undefined) return null;

  return (
    <Router>
      <Routes>
        {/* Auth page for unauthenticated users */}
        {!user ? (
          <>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </>
        ) : (
          <>
            {/* Main app layout for logged-in users */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="stats" element={<Stats />} />
            </Route>

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;

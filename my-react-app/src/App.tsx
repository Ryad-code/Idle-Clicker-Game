import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAtom } from 'jotai';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import AuthPage from './pages/AuthPage';
import Footer from './components/Layout/Footer';
import { useAuth } from './hooks/useAuth';
import { playerAtom } from './game/gameLogic';
import { Player } from './game/types';

function App() {
  const user = useAuth();
  const [player, setPlayer] = useAtom(playerAtom);

  console.log("player: ", player)

  // Production system - runs every second
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer((prev) => {
        const production = prev.calculatePointsPerSecond();
        if (production > 0) {
          const newPlayer = Object.assign(new Player(), prev);
          newPlayer.addPoints(production);
          return newPlayer;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setPlayer]);

  // While checking the session, show nothing (or you can add a spinner)
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
              <Route path="page1" element={<Page1 />} />
              <Route path="page2" element={<Page2 />} />
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

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
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
import { loadPlayerFromDB, savePlayerToDB } from './game/playerService';

function App() {
  const user = useAuth();
  const [player, setPlayer] = useAtom(playerAtom);
  const playerRef = useRef(player);

  // Display updates in player state
  useEffect(() => {
    console.log("Player state updated: ", player);
  }, [player]);

  // Keep ref in sync with latest player state (used by save interval)
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  // Load player from DB when user authenticates
  useEffect(() => {
    if (!user) return;
    
    const loadPlayer = async () => {
      const dbPlayer = await loadPlayerFromDB(user.id);
      setPlayer(dbPlayer);
    };
    
    loadPlayer();
  }, [user, setPlayer]);

  // Production system - runs every second
  // Do we keep it here or move it to a separate hook/file?
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer((prev) => {
        const newPlayer = Object.assign(new Player(), prev);
        newPlayer.refreshDerivedStats();
        if (newPlayer.pointsPerSecond > 0) {
          newPlayer.addPoints(newPlayer.pointsPerSecond);
        }
        return newPlayer;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setPlayer]);

  // Periodic save to DB every 30s
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const snapshot = playerRef.current;
      savePlayerToDB(user.id, snapshot).catch(err => console.error('Save failed', err));
    }, 1000);
    console.log("Started periodic save interval");

    return () => clearInterval(interval);
  }, [user]);
  //........................................................

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

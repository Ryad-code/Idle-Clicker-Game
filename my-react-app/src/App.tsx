import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import AuthPage from './pages/AuthPage';
import Footer from './components/Layout/Footer';
import { useAuth } from './hooks/useAuth';

function App() {
  const user = useAuth();

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

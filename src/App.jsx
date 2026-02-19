import { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.jsx';
import LoginRegistration from './pages/login-registration/LoginRegistration.jsx';
import Home from './pages/home/Home.jsx';
import Friends from './pages/friends/Friends.jsx';
import Messages from './pages/messages/Messages.jsx';
import Profile from './pages/profile/Profile.jsx';
import { AuthContext } from './context/AuthContext.jsx';

function App() {
  const location = useLocation();
  const { isAuth } = useContext(AuthContext);
  const isLoginPage = location.pathname === '/login';

  // login page is rendered with no sidebar
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={!isAuth ? <LoginRegistration /> : <Navigate to="/" />} />
      </Routes>
    );
  }

  // redirect unauthenticated users to login
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // layout with sidebar always visible
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* in case the user enters a wrong or non-existent address */}
        </Routes>
      </main>
    </div>
  );
}

export default App;

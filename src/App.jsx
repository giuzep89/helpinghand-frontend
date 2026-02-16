import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Sidebar from './components/sidebar/Sidebar.jsx';
import LoginRegistration from './pages/login-registration/LoginRegistration.jsx';
import Home from './pages/home/Home.jsx';
import Friends from './pages/friends/Friends.jsx';
import Messages from './pages/messages/Messages.jsx';
import Profile from './pages/profile/Profile.jsx';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // login page is rendered with no sidebar
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<LoginRegistration />} />
      </Routes>
    );
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
        </Routes>
      </main>
    </div>
  );
}

export default App;

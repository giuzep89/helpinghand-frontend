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

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <Routes>
        <Route path="/login" element={<LoginRegistration />} />
        <Route path="/" element={<Home />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;

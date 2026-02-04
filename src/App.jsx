import { Routes, Route } from 'react-router-dom';
import './App.css';
import LoginRegistration from './pages/login-registration/LoginRegistration.jsx';
import Home from './pages/home/Home.jsx';
import Friends from './pages/friends/Friends.jsx';
import Messages from './pages/messages/Messages.jsx';
import Profile from './pages/profile/Profile.jsx';

function App() {
  return (
    <>
      {/* TODO: Add Sidebar here with condition to hide on login page */}
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

import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import HomeIcon from '../../assets/Icons/Home.svg';
import FriendsIcon from '../../assets/Icons/Friends.svg';
import ChatIcon from '../../assets/Icons/Chat.svg';
import ProfileIcon from '../../assets/Icons/Profile-navbar.svg';
import AppLogo from '../../assets/Icons/AppLogo-navbar.svg';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-link">
          <img src={HomeIcon} alt="" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/friends" className="sidebar-link">
          <img src={FriendsIcon} alt="" />
          <span>Friends</span>
        </NavLink>
        <NavLink to="/messages" className="sidebar-link">
          <img src={ChatIcon} alt="" />
          <span>Messages</span>
        </NavLink>
        <NavLink to="/profile" className="sidebar-link">
          <img src={ProfileIcon} alt="" />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <img src={AppLogo} alt="HelpingHand" className="sidebar-logo" />
        <span className="sidebar-username">{user?.username}</span>
        <button type="button" className="sidebar-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

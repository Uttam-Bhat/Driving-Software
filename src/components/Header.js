import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="logo">NIRMALA</h1>
      </div>
      <div className="header-right">
        <div className="profile-menu" onClick={toggleProfileMenu}>
          <i className="fas fa-user-circle"></i>
          <span>Profile</span>
          <i className={`fas fa-chevron-${showProfileMenu ? 'up' : 'down'}`}></i>
        </div>
        {showProfileMenu && (
          <div className="profile-dropdown">
            <Link to="/profile">
              <i className="fas fa-user"></i> Profile
            </Link>
            <Link to="/manage">
              <i className="fas fa-cog"></i> Manage
            </Link>
            <Link to="/login" className="logout">
              <i className="fas fa-sign-out-alt"></i> Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 
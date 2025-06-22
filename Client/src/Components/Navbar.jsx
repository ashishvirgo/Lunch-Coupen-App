import React, { useState } from 'react';
import logo from '../images/mess_logo.jpeg';
import './Navbar.css'; // Import the custom styles

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        {/* Logo & Brand */}
        <div className="brand">
          <img src={logo} alt="Logo" className="logo" />
          <span className="brand-text">Lunch Coupon Generator</span>
        </div>

        {/* Hamburger menu */}
        <button className="hamburger" onClick={toggleNavbar}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* Navigation links */}
        <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
          <li><a href="#change-password">Change Password</a></li>
          <li><a href="#logout">Logout</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

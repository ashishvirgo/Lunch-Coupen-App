import React from 'react';
import logo from '../images/mess_logo.jpeg';
import './Navbar.css'
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Logo and Brand */}
        <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
          <img
            src={logo}
            alt="Logo"
            width="100"
            height="100"
            style={{ maxWidth: '80px', height: 'auto' }}
            className="d-inline-block align-text-top me-2"
          />
          Lunch Coupon Generator
        </a>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" href="#change-password">Change Password</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#logout">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

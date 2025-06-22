import React, { useState } from 'react';
import GenerateCoupon from './GenerateCoupon';
import VerifyCoupon from './VerifyCoupon';
import CouponHistory from '../Components/CouponHistory';
import Navbar from '../Components/Navbar';
import './DashBoard.css'

function DashBoard() {
  const [activeComponent, setActiveComponent] = useState('');

  const renderComponent = () => {
    if (activeComponent === '') {
      return (
        <div className="button-container">
          <button className="dashboard-button generate" onClick={() => setActiveComponent('generate')}>
            Generate Coupon
          </button>
          <button className="dashboard-button verify" onClick={() => setActiveComponent('verify')}>
            Verify Coupon
          </button>
          <button className="dashboard-button history" onClick={() => setActiveComponent('history')}>
            Coupon History
          </button>
        </div>
      );
    }

    switch (activeComponent) {
      case 'generate':
        return <GenerateCoupon />;
      case 'verify':
        return <VerifyCoupon />;
      case 'history':
        return <CouponHistory />;
      case 'settings':
        return <div>Settings Component</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className='navbar1'>
        <Navbar />
      </div>
      
      <div className="dashboard-container">
        <aside className="sidebar">
          <h2>Dashboard</h2>
          <nav>
            <ul className="nav-list">
              <li><span className="nav-link" onClick={() => setActiveComponent('')}>Home</span></li>
              <li><span className="nav-link" onClick={() => setActiveComponent('generate')}>Generate Coupon</span></li>
              <li><span className="nav-link" onClick={() => setActiveComponent('verify')}>Verify Coupon</span></li>
              <li><span className="nav-link" onClick={() => setActiveComponent('history')}>Coupon History</span></li>
              <li><span className="nav-link" onClick={() => setActiveComponent('settings')}>Settings</span></li>
              
            </ul>
          </nav>
        </aside>

        <main className="main-content">
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}

export default DashBoard;

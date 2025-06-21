import React, { useState } from 'react';
import GenerateCoupon from './GenerateCoupon';
import VerifyCoupon from './VerifyCoupon';
import CouponHistory from '../Components/CouponHistory';
import Navbar from '../Components/Navbar';

function DashBoard() {
  const [activeComponent, setActiveComponent] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  const renderComponent = () => {
    if (activeComponent === '') {
      return (
        <div style={styles.buttonContainer}>
          <button style={styles.GCButton} onClick={() => setActiveComponent('generate')}>Generate Coupon</button>
          <button style={styles.VCButton} onClick={() => setActiveComponent('verify')}>Verify Coupon</button>
          <button style={styles.CHButton} onClick={() => setActiveComponent('history')}>Coupon History</button>
        </div>
      );
    }

    switch (activeComponent) {
      case 'generate': return <GenerateCoupon />;
      case 'verify': return <VerifyCoupon />;
      case 'history': return <CouponHistory />;
      case 'settings': return <div>Settings Component</div>;
      default: return null;
    }
  };

  return (
    <div className='container-fluid'>
      <Navbar onSidebarToggle={toggleSidebar} />
      <div style={styles.dashboardContainer}>
        {/* Sidebar */}
        <aside
          style={{
            ...styles.sidebar,
            display: isSidebarVisible ? 'flex' : 'none',
          }}
          className="d-none d-lg-flex"
        >
          <h2 style={{ color: 'white' }}>Dashboard</h2>
          <nav>
            <ul style={styles.navList}>
              <li><span style={styles.navLink} onClick={() => setActiveComponent('generate')}>Generate Coupon</span></li>
              <li><span style={styles.navLink} onClick={() => setActiveComponent('verify')}>Verify Coupon</span></li>
              <li><span style={styles.navLink} onClick={() => setActiveComponent('history')}>Coupon History</span></li>
              <li><span style={styles.navLink} onClick={() => setActiveComponent('settings')}>Settings</span></li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={styles.mainContent}>
          {renderComponent()}
        </main>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: 'flex',
    width: '100%',
    paddingTop: '100px',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#2c3e50',
    padding: '20px',
    color: 'white',
    flexDirection: 'column',
    position: 'relative',
  },
  navList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '20px',
  },
  navLink: {
    display: 'block',
    padding: '10px 0',
    color: '#ecf0f1',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    backgroundColor: '#ecf0f1',
    overflowY: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '20px',
  },
  GCButton: {
    width: '300px',
    height: '280px',
    fontSize: '2.5rem',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  VCButton: {
    width: '300px',
    height: '280px',
    fontSize: '2.5rem',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  CHButton: {
    width: '300px',
    height: '280px',
    fontSize: '2.5rem',
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default DashBoard;

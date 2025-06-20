import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MessDashboard() {
  const [scannedData, setScannedData] = useState('');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({ total: 0, used: 0, unused: 0 });
  const [tokens, setTokens] = useState([]);

  // Fetch token stats and list
  const fetchTokens = async () => {
    const res = await axios.get('http://localhost:5000/tokens');
    const all = res.data;
    const used = all.filter(t => t.status === 'used').length;
    const unused = all.filter(t => t.status === 'valid').length;
    setStats({ total: all.length, used, unused });
    setTokens(all);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleScan = async (data) => {
    if (data) {
      setScannedData(data);
      try {
        const res = await axios.post('http://localhost:5000/verify', { scannedData: data });
        setMessage(res.data.message);
        fetchTokens(); // refresh stats
      } catch (err) {
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>🍽️ Mess Owner Dashboard</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ background: '#e3f2fd', padding: '10px 20px', borderRadius: '10px' }}>
          <h3>Total Tokens</h3>
          <p>{stats.total}</p>
        </div>
        <div style={{ background: '#d0f0c0', padding: '10px 20px', borderRadius: '10px' }}>
          <h3>Unused</h3>
          <p>{stats.unused}</p>
        </div>
        <div style={{ background: '#ffcccc', padding: '10px 20px', borderRadius: '10px' }}>
          <h3>Used</h3>
          <p>{stats.used}</p>
        </div>
      </div>

      <h2>Scan QR to Verify</h2>
      <Link to="/verify">Scan and Verify</Link>
      <p><strong>Status:</strong> {message}</p>

      <h2>📋 All Coupons</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Coupon ID</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, idx) => (
            <tr key={idx}>
              <td>{token.studentId}</td>
              <td>{token.qrData}</td>
              <td style={{ color: token.status === 'used' ? 'red' : 'green' }}>{token.status}</td>
              <td>{new Date(token.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MessDashboard;

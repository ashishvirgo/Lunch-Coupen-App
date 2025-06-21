import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CouponHistory() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${apiUrl}/tokens`);
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (coupon) => {
    if (!coupon.mobile) return alert('Mobile number not available');

    const message = encodeURIComponent(
      `Hello ${coupon.name},\n\nHere is your ABESEC coupon:\n\nCoupon Code: ${coupon.qrData}\nItem: ${coupon.items}\nValue: ₹${coupon.value}\nQR: ${coupon.qrImage}\nValid until: 30th Jun 2025\n\nThank you.`
    );
    window.open(`https://wa.me/91${coupon.mobile}?text=${message}`, '_blank');
  };

  const handleSendEmail = async (coupon) => {
    try {
      await axios.post(`${apiUrl}/send-email`, {
        to: coupon.email,
        subject: 'Your ABESEC Coupon',
        text: `Hi ${coupon.name},\n\nHere is your coupon:\nCode: ${coupon.qrData}\nQR: ${coupon.qrImage}\nItem: ${coupon.items}\nValue: ₹${coupon.value}\nValid till 30th Jun 2025\n\nRegards,\nABESEC Admin`
      });
      alert('Email sent successfully!');
    } catch (err) {
      alert(`Failed to send email: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div>Loading coupon history...</div>;
  if (coupons.length === 0) return <div>No coupons found.</div>;

  const buttonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px',
    color: 'white',
    backgroundColor: '#007bff',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
    opacity: 0.7
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Coupon History</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Item</th>
            <th>Value</th>
            <th>Code</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, idx) => {
            const isUsed = coupon.status?.toLowerCase() === 'used';
            return (
              <tr key={idx}>
                <td>{coupon.studentId}</td>
                <td>{coupon.name}</td>
                <td>{coupon.items}</td>
                <td>₹{coupon.value}</td>
                <td>{coupon.qrData}</td>
                <td>{coupon.mobile}</td>
                <td>{coupon.email}</td>
                <td>{coupon.status}</td>
                <td>
                  <button
                    onClick={() => handleSendWhatsApp(coupon)}
                    disabled={isUsed}
                    style={isUsed ? disabledButtonStyle : buttonStyle}
                  >
                    Send WhatsApp
                  </button>
                  <button
                    onClick={() => handleSendEmail(coupon)}
                    disabled={isUsed}
                    style={isUsed ? disabledButtonStyle : buttonStyle}
                  >
                    Send Email
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default CouponHistory;

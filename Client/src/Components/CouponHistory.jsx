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
      const res = await axios.get(`${apiUrl}/tokens`); // Update as needed
      setCoupons(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (coupon) => {
    // const phone = coupon.mobile;
    const phone = 9718668730;
    // const message = encodeURIComponent(
    //   `Hello ${coupon.name},\n\nHere is your ABESEC coupon:\n\nCoupon Code: ${coupon.code}\nItem: ${coupon.item}\nValue: ₹${coupon.value}\nValid until: 30th Jun 2025\n\nThank you.`
    // );
    const message = encodeURIComponent(
      `Hello Ashish,\n\nHere is your ABESEC coupon:\n\nCoupon Code: 3291-1234567\nItem: Lunch\nValue: ₹ 50\nValid until: 30th Jun 2025\n\nThank you.`
    );
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
  };

  const handleSendEmail = async (coupon) => {
    try {
      await axios.post(`${apiUrl}/send-email`, {
        to: coupon.email,
        subject: 'Your ABESEC Coupon',
        text: `Hi ${coupon.name},\n\nHere is your coupon:\nCode: ${coupon.code}\nItem: ${coupon.item}\nValue: ₹${coupon.value}\nValid till 30th Jun 2025\n\nRegards,\nABESEC Admin`
      });
      alert('Email sent successfully!');
    } catch (err) {
      alert(`Failed to send email: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) return <div>Loading coupon history...</div>;

  if (coupons.length === 0) return <div>No coupons found.</div>;

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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon, idx) => (
            <tr key={idx}>
              <td>{coupon.studentId}</td>
              <td>{coupon.name}</td>
              <td>{coupon.item}</td>
              <td>₹{coupon.value}</td>
              <td>{coupon.code}</td>
              <td>{coupon.mobile}</td>
              <td>{coupon.email}</td>
              <td>
                <button onClick={() => handleSendWhatsApp(coupon)} style={{ marginRight: '10px' }}>
                  Send WhatsApp
                </button>
                <button onClick={() => handleSendEmail(coupon)}>
                  Send Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CouponHistory;

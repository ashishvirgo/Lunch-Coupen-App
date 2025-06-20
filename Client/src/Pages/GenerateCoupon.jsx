import { jsPDF } from 'jspdf';
import axios from 'axios';
import { useState } from 'react';

function GenerateCoupon() {
  const [form, setForm] = useState({
    name: '',
    dept: '',
    mobile: '',
    email: '',
    studentId: '',
    purpose: '',
    value: '',
    items: []
  });

  const [mode, setMode] = useState('single');
  const [count, setCount] = useState(1);
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      items: checked
        ? [...prev.items, value]
        : prev.items.filter((item) => item !== value)
    }));
  };

  const handleGenerate = async () => {
    const { name, dept, mobile, email, studentId, purpose, value, items } = form;

    if (!name || !dept || !mobile || !email || !studentId || !purpose || !value) {
      alert('Please fill in all fields');
      return;
    }

    if (mode === 'single' && items.length !== 1) {
      alert('Please select exactly one item');
      return;
    }

    if (mode === 'multiple' && items.length === 0) {
      alert('Please select at least one item');
      return;
    }

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

    if (!isValidEmail(email)) {
      alert('Invalid email address');
      return;
    }

    if (!isValidMobile(mobile)) {
      alert('Invalid 10-digit mobile number');
      return;
    }

    if (isNaN(value) || Number(value) <= 0) {
      alert('Invalid coupon value');
      return;
    }

    if (mode === 'multiple' && (isNaN(count) || count < 1 || count > 100)) {
      alert('Please enter a valid number of coupons between 1 and 100');
      return;
    }

    const howMany = mode === 'multiple' ? count : 1;
    const doc = new jsPDF();

    try {
      let firstPage = true;

      for (let i = 0; i < howMany; i++) {
        for (const item of items) {
          // Get QR from backend
          const res = await axios.post(`${apiUrl}/generate`, { studentId });
          const { qrImage, qrData } = res.data;

          if (!firstPage) doc.addPage();
          firstPage = false;

          doc.setFontSize(24);
          doc.text('ABESEC COUPON', 70, 40);

          doc.setFontSize(14);
          doc.text(`Student ID: ${studentId}`, 20, 85);
          doc.text(`Purpose: ${purpose}`, 20, 95);
          doc.text(`Item: ${item}`, 20, 105);
          doc.text(`Value: ₹${value}`, 20, 115);
          doc.text(`Coupon Code: ${qrData}`, 20, 55);

          doc.setFontSize(12);
          doc.text('Valid until: 30th Jun 2025', 20, 140);
          doc.text('Terms and conditions apply.', 20, 155);
          doc.text('Breakfast Timing 8:00 - 9:00 AM.', 20, 165);
          doc.text('Lunch Timing 12:00 - 2:00 PM.', 20, 175);
          doc.text('Dinner Timing 7:30 - 9:30 PM.', 20, 185);

          doc.addImage(qrImage, 'PNG', 100, 70, 75, 75);
        }
      }

      doc.save(`${studentId}_coupons.pdf`);
      alert('Coupons PDF generated successfully!');
    } catch (err) {
      console.error('Error generating coupon:', err);
      alert(`Generation failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="container">
      <div style={{
        width: '40vw',
        textAlign: 'center',
        border: '4px solid green',
        borderRadius: '20px',
        margin: 'auto',
        padding: '30px'
      }}>
        <h2>Generate Coupon</h2>

        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
          <label>
            <input
              type="radio"
              name="mode"
              value="single"
              checked={mode === 'single'}
              onChange={() => {
                setMode('single');
                setForm({ ...form, items: [] });
              }}
            />
            Single
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              name="mode"
              value="multiple"
              checked={mode === 'multiple'}
              onChange={() => {
                setMode('multiple');
                setForm({ ...form, items: [] });
              }}
            />
            Multiple
          </label>
        </div>

        {mode === 'multiple' && (
          <input
            type="number"
            min="1"
            max="100"
            placeholder="Number of coupons per item"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            style={inputStyle}
          />
        )}

        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} style={inputStyle} />
        <input type="text" name="dept" placeholder="Department" value={form.dept} onChange={handleChange} style={inputStyle} />
        <input type="tel" name="mobile" placeholder="Mobile (10 digits)" value={form.mobile} onChange={handleChange} style={inputStyle} maxLength={10} />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input type="text" name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} style={inputStyle} />
        <input type="text" name="purpose" placeholder="Purpose (e.g., Seminar)" value={form.purpose} onChange={handleChange} style={inputStyle} />

        {mode === 'single' ? (
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label>
              <input
                type="radio"
                name="item"
                value="Breakfast"
                checked={form.items[0] === 'Breakfast'}
                onChange={(e) => setForm({ ...form, items: [e.target.value] })}
              /> Breakfast
            </label><br />
            <label>
              <input
                type="radio"
                name="item"
                value="Lunch"
                checked={form.items[0] === 'Lunch'}
                onChange={(e) => setForm({ ...form, items: [e.target.value] })}
              /> Lunch
            </label><br />
            <label>
              <input
                type="radio"
                name="item"
                value="Dinner"
                checked={form.items[0] === 'Dinner'}
                onChange={(e) => setForm({ ...form, items: [e.target.value] })}
              /> Dinner
            </label>
          </div>
        ) : (
          <div style={{ textAlign: 'left', marginBottom: '10px' }}>
            <label><input type="checkbox" value="Breakfast" onChange={handleItemChange} checked={form.items.includes('Breakfast')} /> Breakfast</label><br />
            <label><input type="checkbox" value="Lunch" onChange={handleItemChange} checked={form.items.includes('Lunch')} /> Lunch</label><br />
            <label><input type="checkbox" value="Dinner" onChange={handleItemChange} checked={form.items.includes('Dinner')} /> Dinner</label>
          </div>
        )}

        <input type="number" name="value" placeholder="Coupon Value (₹)" value={form.value} onChange={handleChange} style={inputStyle} min="1" />

        <button onClick={handleGenerate} style={{ padding: '10px 20px', marginTop: '10px' }}>
          Generate & Download Coupon
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

export default GenerateCoupon;

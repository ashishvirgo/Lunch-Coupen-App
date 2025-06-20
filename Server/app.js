const express = require('express');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://ashishvirgo12:abes1234@cluster0.tyj6h.mongodb.net/hostel_mess?retryWrites=true&w=majority&appName=Cluster0');

const CouponSchema = new mongoose.Schema({
  studentId: String,
  name: String,
  dept: String,
  mobile: String,
  email: String,
  qrData: String,
  purpose: String, 
  value: String, 
  items: Array,
  status: { type: String, default: 'valid' },
  createdAt: { type: Date, default: Date.now },
});

const Coupon = mongoose.model('Coupon', CouponSchema);
app.get('/tokens', async (req, res) => {
  const all = await Coupon.find().sort({ createdAt: -1 });
  res.json(all);
});
app.post('/generate', async (req, res) => {
  const { studentId, name, dept, mobile, email, purpose, value, items } = req.body;
  const uniqueText = `${studentId}-${Date.now()}`;
  const qrImage = await QRCode.toDataURL(uniqueText);

  await Coupon.create({ studentId, qrData: uniqueText, name, dept, mobile, email, purpose, value, items });

  res.json({ qrImage, qrData: uniqueText });
});



app.post('/verify', async (req, res) => {
  const { scannedData } = req.body;
  const coupon = await Coupon.findOne({ qrData: scannedData });

  if (!coupon) return res.status(404).json({ valid: false, message: 'Invalid QR code' });

  if (coupon.status !== 'valid') {
    return res.status(400).json({ valid: false, message: 'Coupon already used or expired' });
  }

  coupon.status = 'used';
  await coupon.save();

  res.json({ valid: true, message: 'Coupon verified. Meal allowed!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));

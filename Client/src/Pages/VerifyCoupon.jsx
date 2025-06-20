import { useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function VerifyCoupon() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const qrRegionId = 'reader';
  const html5QrCodeRef = useRef(null);

  const startScanner = async () => {
    setMessage('');
    setError('');
    setScanning(true);

    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    try {
      console.log("start")
      const devices = await Html5Qrcode.getCameras();
      console.log("56")
      if (devices.length === 0) {
        setError('No camera found');
        return;
      }
     console.log("1")
      const cameraId = devices[0].id;
     console.log("2")
      await html5QrCodeRef.current.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        handleScanSuccess,
        handleScanError
      );
    } catch (err) {
      if (err.name === 'NotAllowedError') {
  setError('Camera access was denied. Please allow it in your browser settings.');
}
     else{
      console.error('Camera start error:', err);
      setError('Failed to start camera: ' + err.message);
     }
    }
  };
  const isErrorMessage = (msg) => {
  if (!msg) return false;
  const lowerMsg = msg.toLowerCase();
  return lowerMsg.includes('already used') || lowerMsg.includes('expired');
};
  const handleScanSuccess = async (data) => {
    if (!loading) {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scannedData: data }),
        });
        const result = await res.json();
        setMessage(result.message);
      } catch (err) {
        setError('Verification failed. Try again.'+ err.message);
      } finally {
        setLoading(false);
        stopScanner();
      }
    }
  };

  const handleScanError = (err) => {
    console.warn('QR Scan error:', err);
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
      setScanning(false);
    }
  };

  return (
    <div>
      <h2>Verify Your Coupon</h2>

      {!scanning && (
        <button onClick={startScanner}>Start Scanning</button>
      )}

      <div id="reader" style={{ width: '300px', marginTop: '1rem' }}></div>

      {loading && <p>Verifying...</p>}
       {message && (
      <p style={{ color: isErrorMessage(message) ? 'red' : 'green' }}>
        {message}
      </p>
    )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default VerifyCoupon;

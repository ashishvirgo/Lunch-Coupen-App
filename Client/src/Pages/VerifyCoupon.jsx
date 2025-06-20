import { useRef, useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function VerifyCoupon() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const qrRegionId = 'reader';
  const html5QrCodeRef = useRef(null);
  const scannedOnce = useRef(false); // Prevent multiple scans

  useEffect(() => {
    return () => {
      stopScanner(); // Cleanup on unmount
    };
  }, []);

  const startScanner = async () => {
    if (scanning || html5QrCodeRef.current) return;

    setMessage('');
    setError('');
    setScanning(true);
    scannedOnce.current = false;

    html5QrCodeRef.current = new Html5Qrcode(qrRegionId);

    try {
      const devices = await Html5Qrcode.getCameras();

      if (devices.length === 0) {
        setError('No camera found');
        html5QrCodeRef.current = null;
        setScanning(false);
        return;
      }

      // Try to use back camera
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes('back') ||
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );

      const cameraId = backCamera ? backCamera.id : devices[0].id;

      await html5QrCodeRef.current.start(
        cameraId,
        { fps: 10, qrbox: 250 },
        handleScanSuccess,
        handleScanError
      );
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow it in your browser settings.');
      } else {
        console.error('Camera start error:', err);
        setError('Failed to start camera: ' + err.message);
      }
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
      }
    } catch (err) {
      console.error("Error stopping scanner:", err);
    } finally {
      setScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  const isErrorMessage = (msg) => {
    if (!msg) return false;
    const lowerMsg = msg.toLowerCase();
    return lowerMsg.includes('already used') || lowerMsg.includes('expired');
  };

  const handleScanSuccess = async (data) => {
    if (scannedOnce.current || loading) return;
    scannedOnce.current = true;

    await stopScanner(); // Stop scanning after first scan
    setLoading(true);

    try {
      const res = await fetch(`${apiUrl}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scannedData: data }),
      });

      const result = await res.json();
      setMessage(result.message);
    } catch (err) {
      setError('Verification failed. Try again. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (err) => {
    console.warn('QR Scan error:', err);
    // No need to show every scanning error
  };

  return (
    <div>
      <h2>Verify Your Coupon</h2>

      {!scanning && (
        <button onClick={startScanner}>Start Scanning</button>
      )}

      {scanning && (
        <button onClick={stopScanner} style={{ marginTop: '1rem' }}>
          Stop Scanning
        </button>
      )}

      <div id={qrRegionId} style={{ width: '300px', marginTop: '1rem' }}></div>

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

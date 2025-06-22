import React, { useState, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import './App.css';

function App() {
  const defaultUPI = "paytm.s1ep1ge@pty";
  const merchantName = "KVH NextGen Store";

  const [amount, setAmount] = useState('');
  const [qrImage, setQrImage] = useState(null);

  const generateUPIURL = () => {
    return `upi://pay?pa=${defaultUPI}&pn=${encodeURIComponent(merchantName)}&am=${amount}&tn=&mode=00`;
  };

  const handleGenerateQR = () => {
    if (amount <= 0) {
      setQrImage(null);
      return;
    }

    const url = generateUPIURL();

    // Generate SVG with red color and increased size
    QRCodeLib.toString(url, {
      type: 'svg',
      color: '#ff0000', // solid red for reliability
      background: '#ffffff',
      width: 160,
      height: 160,
    }).then(svg => {
      const wrappedSVG = `<div style="display:inline-block">${svg}</div>`;
      setQrImage(wrappedSVG);
    });
  };

  // 🔁 Dynamic QR Generation: regenerate QR whenever amount changes
  useEffect(() => {
    handleGenerateQR();
  }, [amount]);

  const downloadQR = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(qrImage, 'image/svg+xml');
    const svgElement = doc.querySelector('svg');

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = "UPI-QR.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = url;
  };

  const copyLink = () => {
    const url = generateUPIURL();
    navigator.clipboard.writeText(url).then(() => {
      alert("UPI link copied to clipboard!");
    });
  };

  const resetQR = () => {
    setAmount('');
    setQrImage(null);
  };

  return (
    <div className="app">
      <div className="container">
        <h2> K V H nextGen Store</h2>
        <p>UPI QR Code Generator</p>

        {/* Single Section - Default UPI */}
        <section className="qr-section">
          <h2>Upi Id: {defaultUPI}</h2>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />
          <div className="btn-group">
            <button onClick={copyLink}>🔗Copy Link</button>
            <button onClick={resetQR} className="reset-btn">⏻ Reset</button>
          </div>

          {qrImage && (
            <div className="qr-result" style={{ marginTop: '20px' }}>
              <div dangerouslySetInnerHTML={{ __html: qrImage }} />
              <p className="amount-text" style={{ marginTop: '10px', fontWeight: 'bold' }}>
                Scan to Pay ₹{amount}
              </p>
            </div>
          )}
          {qrImage && (
            <div className="btn-group" style={{ marginTop: '20px' }}>
              <button onClick={downloadQR} className="download-btn"> ↓ Save QR_Code</button>
            </div>
          )}

          {!amount && (
            <p style={{ marginTop: '20px', color: '#888' }}>Enter an amount to generate QR</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
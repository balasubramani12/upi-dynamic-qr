import React, { useState, useEffect } from 'react';
import QRCodeLib from 'qrcode';
import './App.css';

function App() {
  const defaultUPI = "paytm.s1ep1ge@pty";
  const merchantName = "KVH NextGen Store";

  const [amount, setAmount] = useState('');
  const [qrImage, setQrImage] = useState(null);

  // Generate UPI URL with or without amount
  const generateUPIURL = () => {
    let url = `upi://pay?pa=${defaultUPI}&pn=${encodeURIComponent(merchantName)}`;
    if (amount && amount > 0) {
      url += `&am=${amount}`;
    }
    url += `&tn=&mode=00`;
    return url;
  };

  // Generate QR Code based on URL
  const handleGenerateQR = () => {
    const url = generateUPIURL();
    QRCodeLib.toString(url, {
      type: 'svg',
      color: '#ff0000',
      background: '#ffffff',
      width: 160,
      height: 160,
    }).then(svg => {
      const wrappedSVG = `<div style="display:inline-block">${svg}</div>`;
      setQrImage(wrappedSVG);
    });
  };

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

  const resetQR = () => {
    setAmount('');
    setQrImage(null);
    handleGenerateQR();
  };

  return (
    <div className="app">
      <div className="container">
        <h2 id="title">KVH nextGen Store</h2>
        <p className="upi-id">UPI ID: {defaultUPI}</p>
        <p>UPI QR Code Generator</p>

        <section className="info-section">
          <div className="store-info">
            <p className="yet-to-pay">
              <span>Yet to Pay: ₹{amount || '0.00'}</span>
            </p>
          </div>
          <hr />
        </section>

        <section className="qr-display">
          <div className="qr-frame">
            {qrImage ? (
              <div dangerouslySetInnerHTML={{ __html: qrImage }} />
            ) : (
              <p className="placeholder-text">Scan & Pay using UPI</p>
            )}
            <span className="corner-bl"></span>
            <span className="corner-br"></span>
          </div>
        </section>

        <section className="input-section">
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
          />

          <div className="btn-group-vertical">
            <button onClick={downloadQR} className="download-btn">↓ Save QR_Code</button>
            <button onClick={resetQR} className="reset-btn">☠️ Reset</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;

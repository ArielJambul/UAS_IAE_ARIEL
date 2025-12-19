import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    // URL ini mengarah ke Backend PHP di port 5000
    fetch('http://localhost:5000/src/api_bookings.php')
      .then(response => response.text())
      .then(data => {
        console.log("Data dari backend:", data);
        setMessage("Koneksi ke Backend Berhasil! (Cek Console)");
      })
      .catch(err => {
        console.error("Error:", err);
        setMessage("Gagal terhubung ke backend.");
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Frontend Bengkel</h1>
      <h3>Status: {message}</h3>
    </div>
  );
}

export default App;
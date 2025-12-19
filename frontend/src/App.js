import { useState, useEffect } from 'react'

function App() {
  const [data, setData] = useState(null);

  // Coba ambil data dari backend saat halaman dibuka
  useEffect(() => {
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Aplikasi Bengkel (Frontend)</h1>
      <p>Status Koneksi ke Backend:</p>
      
      {data ? (
        // Jika berhasil connect ke backend
        <div style={{ color: 'green', border: '1px solid green', padding: '10px' }}>
          <h3>{data.message}</h3>
        </div>
      ) : (
        // Jika masih loading atau error
        <p style={{ color: 'red' }}>Menghubungkan ke Backend...</p>
      )}
    </div>
  )
}

export default App
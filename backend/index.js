const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Agar frontend bisa akses data backend (wajib jika beda port)
app.use(cors());
app.use(express.json());

// Route sederhana untuk tes
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Halo! Backend Bengkel berhasil jalan di Docker!' 
  });
});

app.listen(port, () => {
  console.log(`Backend app listening on port ${port}`);
});
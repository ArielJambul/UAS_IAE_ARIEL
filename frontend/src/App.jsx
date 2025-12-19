import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Konfigurasi URL Backend (Port 5000 sesuai docker-compose)
const API_URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null); // Simpan data user login
  const [view, setView] = useState('login'); // login | user | admin

  // Cek apakah ada sesi tersimpan saat refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setView(parsedUser.role === 'admin' ? 'admin' : 'user');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setView('login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      {view === 'login' && <LoginForm setUser={setUser} setView={setView} />}
      {view === 'user' && <UserDashboard user={user} logout={handleLogout} />}
      {view === 'admin' && <AdminDashboard user={user} logout={handleLogout} />}
    </div>
  );
}

// --- KOMPONEN LOGIN ---
function LoginForm({ setUser, setView }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint login.php
      const res = await axios.post(`${API_URL}/login.php`, form);
      if (res.data.status === 'success') {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setView(userData.role === 'admin' ? 'admin' : 'user');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Gagal koneksi ke backend.');
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', border: '1px solid #ddd', padding: '20px' }}>
      <h2>Login Bengkel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="Username" 
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value})}
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }} 
        />
        <input 
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value})} 
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }} 
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>Login</button>
      </form>
    </div>
  );
}

// --- KOMPONEN USER DASHBOARD ---
function UserDashboard({ user, logout }) {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ jenis_kendaraan: 'Motor Bebek', nopol: '', keluhan: '', tanggal_booking: '' });

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api_bookings.php?user_id=${user.id}`);
      if (res.data.status === 'success') setBookings(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api_tambah_booking.php`, { ...form, user_id: user.id });
      alert('Booking Berhasil!');
      setForm({ jenis_kendaraan: 'Motor Bebek', nopol: '', keluhan: '', tanggal_booking: '' });
      loadData();
    } catch (err) { alert('Gagal booking'); }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Halo, {user.username}!</h2>
        <button onClick={logout} style={{ background: 'red', color: 'white', padding: '5px 10px' }}>Logout</button>
      </div>
      
      <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Tambah Booking</h3>
        <form onSubmit={handleSubmit}>
          <select value={form.jenis_kendaraan} onChange={e => setForm({...form, jenis_kendaraan: e.target.value})} style={{ display: 'block', width: '100%', margin: '5px 0' }}>
            <option>Motor Bebek</option><option>Motor Matic</option><option>Motor Sport</option>
          </select>
          <input placeholder="Nopol" value={form.nopol} onChange={e => setForm({...form, nopol: e.target.value})} required style={{ display: 'block', width: '100%', margin: '5px 0', padding: '5px' }} />
          <textarea placeholder="Keluhan" value={form.keluhan} onChange={e => setForm({...form, keluhan: e.target.value})} required style={{ display: 'block', width: '100%', margin: '5px 0', padding: '5px' }} />
          <input type="date" value={form.tanggal_booking} onChange={e => setForm({...form, tanggal_booking: e.target.value})} required style={{ display: 'block', width: '100%', margin: '5px 0', padding: '5px' }} />
          <button type="submit" style={{ padding: '10px', background: 'green', color: 'white', width: '100%' }}>Kirim Booking</button>
        </form>
      </div>

      <h3>Riwayat Servis</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Motor</th><th>Keluhan</th><th>Status</th></tr></thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.jenis_kendaraan} ({b.nopol})<br/><small>{b.tanggal_booking}</small></td>
              <td>{b.keluhan}</td>
              <td><b>{b.status}</b></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- KOMPONEN ADMIN DASHBOARD ---
function AdminDashboard({ user, logout }) {
  const [data, setData] = useState([]);

  const loadData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api_admin_bookings.php`);
      if (res.data.status === 'success') setData(res.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, []);

  const updateStatus = async (id, status_baru) => {
    try {
      await axios.post(`${API_URL}/api_update_status.php`, { id_booking: id, status_baru });
      loadData();
    } catch (err) { alert('Gagal update'); }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard Admin</h2>
        <button onClick={logout} style={{ background: 'red', color: 'white', padding: '5px 10px' }}>Logout</button>
      </div>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr><th>Pelanggan</th><th>Motor & Keluhan</th><th>Status</th><th>Aksi</th></tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.nama_lengkap}</td>
              <td>{item.jenis_kendaraan} ({item.nopol})<br/><small>{item.keluhan}</small></td>
              <td>{item.status}</td>
              <td>
                <select 
                  defaultValue={item.status} 
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                  style={{ padding: '5px' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="Diproses">Diproses</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Dibatalkan">Dibatalkan</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
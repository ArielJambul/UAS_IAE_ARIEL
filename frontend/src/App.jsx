import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 

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

// --- LOGIN FORM ---
function LoginForm({ setUser, setView }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login.php`, form);
      if (res.data.status === 'success') {
        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setView(userData.role === 'admin' ? 'admin' : 'user');
      } else {
        setError(res.data.message);
      }
    } catch (err) { setError('Gagal koneksi ke backend.'); }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', border: '1px solid #ddd', padding: '20px' }}>
      <h2>Login Bengkel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>Login</button>
      </form>
    </div>
  );
}

// --- USER DASHBOARD ---
function UserDashboard({ user, logout }) {
  const [tab, setTab] = useState('booking'); // 'booking' atau 'katalog'

  return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Halo, {user.username}!</h2>
          <div>
            <button onClick={() => setTab('booking')} style={{ marginRight: '5px', padding: '8px', background: tab==='booking'?'#007bff':'#ccc', color: 'white', border:'none' }}>Booking & Riwayat</button>
            <button onClick={() => setTab('katalog')} style={{ marginRight: '5px', padding: '8px', background: tab==='katalog'?'#007bff':'#ccc', color: 'white', border:'none' }}>Daftar Harga Layanan</button>
            <button onClick={logout} style={{ background: 'red', color: 'white', padding: '8px 15px', border:'none' }}>Logout</button>
          </div>
        </div>
        
        {/* TAMPILKAN KONTEN SESUAI TAB */}
        {tab === 'booking' ? <UserBookingManager user={user} /> : <UserServiceCatalog />}
      </div>
  );
}

// Sub-Komponen User 1: Katalog Layanan (Read Only)
function UserServiceCatalog() {
    const [services, setServices] = useState([]);
    useEffect(() => {
        axios.get(`${API_URL}/api_layanan.php`).then(res => {
            if(res.data.status === 'success') setServices(res.data.data);
        });
    }, []);

    return (
        <div>
            <h3>📋 Daftar Paket Layanan Bengkel</h3>
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead style={{ background: '#eee' }}><tr><th>Nama Layanan</th><th>Deskripsi</th><th>Harga</th></tr></thead>
                <tbody>
                    {services.map(s => (
                        <tr key={s.id}>
                            <td><b>{s.nama_layanan}</b></td>
                            <td>{s.deskripsi}</td>
                            <td style={{ color: 'green', fontWeight: 'bold' }}>Rp {parseInt(s.harga).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Sub-Komponen User 2: Manager Booking (CRUD Booking)
function UserBookingManager({ user }) {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]); 
  const [mode, setMode] = useState('paket'); 
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const defaultForm = { jenis_kendaraan: 'Motor Bebek', nopol: '', keluhan: '', tanggal_booking: '', service_id: '' };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    loadHistory();
    axios.get(`${API_URL}/api_layanan.php`).then(res => {
        if(res.data.status === 'success') setServices(res.data.data);
    });
  }, []);

  const loadHistory = async () => {
    const res = await axios.get(`${API_URL}/api_bookings.php?user_id=${user.id}`);
    if (res.data.status === 'success') setBookings(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataKirim = { ...form, user_id: user.id };
    
    if (mode === 'paket') {
        const selectedService = services.find(s => s.id == form.service_id);
        if(!selectedService) { alert("Pilih paket dulu!"); return; }
        dataKirim.keluhan = `Paket: ${selectedService.nama_layanan}`;
    } else {
        dataKirim.service_id = "";
    }

    try {
      if (isEditing) { // UPDATE
        await axios.post(`${API_URL}/api_booking_operations.php`, { ...dataKirim, action: 'update', booking_id: editId });
        alert('Data berhasil diubah!');
        setIsEditing(false); setEditId(null);
      } else { // CREATE
        await axios.post(`${API_URL}/api_tambah_booking.php`, dataKirim);
        alert('Booking Berhasil!');
      }
      setForm(defaultForm);
      loadHistory();
    } catch (err) { alert('Gagal memproses data'); }
  };

  const handleEdit = (item) => {
    if(item.status !== 'Pending') return alert("Hanya status Pending yang bisa diedit!");
    setIsEditing(true); setEditId(item.id);
    setMode(item.service_id ? 'paket' : 'manual');
    setForm({
        jenis_kendaraan: item.jenis_kendaraan,
        nopol: item.nopol,
        keluhan: item.keluhan,
        tanggal_booking: item.tanggal_booking,
        service_id: item.service_id || ''
    });
  };

  const handleDelete = async (id, status) => { // DELETE
      if(status !== 'Pending') return alert("Hanya status Pending yang bisa dibatalkan!");
      if(!confirm("Batalkan booking ini?")) return;
      const res = await axios.post(`${API_URL}/api_booking_operations.php`, { action: 'delete', booking_id: id, user_id: user.id });
      if(res.data.status === 'success') { alert("Booking dibatalkan"); loadHistory(); }
  };

  return (
    <div>
      <div style={{ background: isEditing ? '#fff3cd' : '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: isEditing ? '1px solid orange' : '1px solid #ddd' }}>
        <h3>{isEditing ? '✏️ Edit Booking' : '➕ Buat Booking Baru'}</h3>
        <div style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '15px' }}><input type="radio" name="mode" checked={mode === 'paket'} onChange={() => setMode('paket')} /> Paket Servis</label>
            <label><input type="radio" name="mode" checked={mode === 'manual'} onChange={() => setMode('manual')} /> Manual</label>
        </div>
        <form onSubmit={handleSubmit}>
          <select value={form.jenis_kendaraan} onChange={e => setForm({...form, jenis_kendaraan: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }}>
            <option>Motor Bebek</option><option>Motor Matic</option><option>Motor Sport</option>
          </select>
          <input placeholder="Nopol" value={form.nopol} onChange={e => setForm({...form, nopol: e.target.value})} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }} />
          <input type="date" value={form.tanggal_booking} onChange={e => setForm({...form, tanggal_booking: e.target.value})} required style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }} />
          {mode === 'paket' ? (
              <select value={form.service_id} required onChange={e => setForm({...form, service_id: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }}>
                  <option value="">-- Pilih Layanan --</option>
                  {services.map(s => (<option key={s.id} value={s.id}>{s.nama_layanan} - Rp {parseInt(s.harga).toLocaleString()}</option>))}
              </select>
          ) : (
              <textarea placeholder="Keluhan..." value={form.keluhan} required onChange={e => setForm({...form, keluhan: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '5px' }} />
          )}
          <button type="submit" style={{ padding: '10px', background: isEditing ? 'orange' : 'green', color: 'white', width: '100%', cursor:'pointer' }}>{isEditing ? 'Simpan Perubahan' : 'Kirim Booking'}</button>
          {isEditing && <button type="button" onClick={()=>{setIsEditing(false); setForm(defaultForm);}} style={{ marginTop:'5px', width:'100%', padding:'5px', cursor:'pointer' }}>Batal Edit</button>}
        </form>
      </div>
      <h3>Riwayat Servis</h3>
      <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr><th>Motor</th><th>Detail</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id}>
              <td>{b.jenis_kendaraan} ({b.nopol})<br/><small>{b.tanggal_booking}</small></td>
              <td>{b.keluhan}</td>
              <td><b>{b.status}</b></td>
              <td>
                  {b.status === 'Pending' ? (
                      <>
                        <button onClick={() => handleEdit(b)} style={{ marginRight: '5px', background: 'orange', border: 'none', padding: '5px', cursor: 'pointer', borderRadius:'4px' }}>Edit</button>
                        <button onClick={() => handleDelete(b.id, b.status)} style={{ background: 'red', color: 'white', border: 'none', padding: '5px', cursor: 'pointer', borderRadius:'4px' }}>Batal</button>
                      </>
                  ) : <small style={{ color: 'gray' }}>Locked</small>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ user, logout }) {
  const [tab, setTab] = useState('bookings'); 
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Dashboard Admin</h2>
        <div>
            <button onClick={() => setTab('bookings')} style={{ marginRight: '10px', padding: '8px', background: tab==='bookings'?'#333':'#ccc', color: 'white', border:'none' }}>Antrian</button>
            <button onClick={() => setTab('layanan')} style={{ marginRight: '10px', padding: '8px', background: tab==='layanan'?'#333':'#ccc', color: 'white', border:'none' }}>Kelola Layanan</button>
            <button onClick={logout} style={{ background: 'red', color: 'white', padding: '8px 15px', border:'none' }}>Logout</button>
        </div>
      </div>
      {tab === 'bookings' ? <AdminBookingList /> : <AdminManageServices />}
    </div>
  );
}

function AdminBookingList() {
    const [data, setData] = useState([]);
    const loadData = async () => {
        const res = await axios.get(`${API_URL}/api_admin_bookings.php`);
        if (res.data.status === 'success') setData(res.data.data);
    };
    useEffect(() => { loadData(); }, []);

    const updateStatus = async (id, status_baru) => {
        await axios.post(`${API_URL}/api_update_status.php`, { id_booking: id, status_baru });
        loadData();
    };

    return (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#333', color: 'white' }}><tr><th>Pelanggan</th><th>Detail</th><th>Status</th><th>Aksi</th></tr></thead>
            <tbody>
            {data.map(item => (
                <tr key={item.id}>
                <td>{item.nama_lengkap}</td>
                <td>{item.jenis_kendaraan} ({item.nopol})<br/><b>{item.nama_layanan ? `Paket: ${item.nama_layanan}` : 'Manual'}</b><br/><small>"{item.keluhan}"</small></td>
                <td>{item.status}</td>
                <td>
                    <select defaultValue={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>
                    <option value="Pending">Pending</option><option value="Diproses">Diproses</option><option value="Selesai">Selesai</option><option value="Dibatalkan">Dibatalkan</option>
                    </select>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
}

function AdminManageServices() {
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({ nama_layanan: '', deskripsi: '', harga: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const loadServices = async () => {
        const res = await axios.get(`${API_URL}/api_layanan.php`);
        if(res.data.status === 'success') setServices(res.data.data);
    };
    useEffect(() => { loadServices(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = isEditing ? { ...form, action: 'update', id: editId } : form;
        const res = await axios.post(`${API_URL}/api_layanan.php`, payload);
        
        if(res.data.status === 'success') {
            alert(res.data.message);
            setForm({ nama_layanan: '', deskripsi: '', harga: '' });
            setIsEditing(false); setEditId(null);
            loadServices();
        } else {
            alert(res.data.message); // Tampilkan pesan error jika gagal hapus/update
        }
    };

    const handleEdit = (s) => { setIsEditing(true); setEditId(s.id); setForm({ nama_layanan: s.nama_layanan, deskripsi: s.deskripsi, harga: s.harga }); };
    const handleDelete = async (id) => {
        if(!confirm('Hapus layanan ini?')) return;
        const res = await axios.post(`${API_URL}/api_layanan.php`, { action: 'delete', id });
        if(res.data.status === 'success') { alert(res.data.message); loadServices(); }
        else { alert(res.data.message); }
    };

    return (
        <div>
            <h3>{isEditing ? '✏️ Edit Layanan' : '➕ Tambah Paket Layanan'}</h3>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px', background: '#eee', padding: '15px' }}>
                <input placeholder="Nama Layanan" value={form.nama_layanan} onChange={e => setForm({...form, nama_layanan: e.target.value})} required style={{ marginRight: '5px', padding: '5px' }} />
                <input placeholder="Harga" type="number" value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} required style={{ marginRight: '5px', padding: '5px' }} />
                <input placeholder="Deskripsi" value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} required style={{ marginRight: '5px', width: '250px', padding: '5px' }} />
                <button type="submit" style={{ background: isEditing ? 'orange' : 'green', color: 'white', padding: '5px 15px', border:'none', cursor:'pointer' }}>{isEditing ? 'Simpan' : 'Tambah'}</button>
                {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({ nama_layanan: '', deskripsi: '', harga: '' }); }} style={{ marginLeft: '5px', padding:'5px', cursor:'pointer' }}>Batal</button>}
            </form>
            <h3>Daftar Layanan Bengkel</h3>
            <table border="1" cellPadding="5" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr><th>Nama</th><th>Harga</th><th>Deskripsi</th><th>Aksi</th></tr></thead>
                <tbody>
                    {services.map(s => (
                        <tr key={s.id}>
                            <td>{s.nama_layanan}</td>
                            <td>Rp {parseInt(s.harga).toLocaleString()}</td>
                            <td>{s.deskripsi}</td>
                            <td>
                                <button onClick={() => handleEdit(s)} style={{ background: 'orange', marginRight: '5px', padding: '4px 8px', border:'none', cursor:'pointer', borderRadius:'4px' }}>Edit</button>
                                <button onClick={() => handleDelete(s.id)} style={{ background: 'red', color: 'white', padding: '4px 8px', border:'none', cursor:'pointer', borderRadius:'4px' }}>Hapus</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
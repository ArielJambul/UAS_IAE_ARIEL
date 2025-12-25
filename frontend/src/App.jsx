import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('landing');

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
    setView('landing');
  };

  return (
    <div className="app-root">
      {/* GLOBAL NAVBAR */}
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo">BENGKEL<span>ONLINE</span></div>
          {user && (
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ fontWeight: '500' }}>Halo, {user.nama_lengkap}</span>
              <button onClick={handleLogout} className="btn btn-sm btn-outline">Logout</button>
            </div>
          )}
        </div>
      </nav>

      {view === 'landing' && <LandingPage setView={setView} />}
      {view === 'login_user' && <AuthLayout title="Login Pelanggan"><UserLoginForm setUser={setUser} setView={setView} /></AuthLayout>}
      {view === 'login_admin' && <AuthLayout title="Login Staff"><AdminLoginForm setUser={setUser} setView={setView} /></AuthLayout>}
      {view === 'register' && <AuthLayout title="Daftar Akun Baru"><RegisterForm setView={setView} /></AuthLayout>}

      {view === 'user' && <UserDashboard user={user} logout={handleLogout} />}
      {view === 'admin' && <AdminDashboard user={user} logout={handleLogout} />}
    </div>
  );
}

// --- LAYOUT COMPONENTS ---
function AuthLayout({ children, title }) {
  return (
    <div className="auth-wrapper animate-fade-up">
      <div className="card auth-box">
        <h2 className="text-center" style={{ marginBottom: '30px', color: 'var(--brand-black)' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

// --- 1. LANDING PAGE (HERO STYLE) ---
function LandingPage({ setView }) {
  return (
    <div>
      <div className="hero animate-fade-up">
        <div className="container">
          <h1>Servis Motor Profesional</h1>
          <p>Layanan servis terbaik dengan mekanik handal dan sparepart original. Cepat, transparan, dan terpercaya.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setView('login_user')}>Mulai Booking</button>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }} onClick={() => setView('login_admin')}>Staff Login</button>
          </div>
        </div>
      </div>

      <div className="container">
        <h3 className="text-center mb-20" style={{ opacity: 0.6 }}>MENGAPA KAMI?</h3>
        <div className="grid-3">
          <div className="card text-center">
            <h2>🛠️</h2>
            <h3>Mekanik Handal</h3>
            <p style={{ color: '#666' }}>Tim profesional bersertifikat resmi.</p>
          </div>
          <div className="card text-center">
            <h2>⚡</h2>
            <h3>Proses Cepat</h3>
            <p style={{ color: '#666' }}>Sistem booking online tanpa antri lama.</p>
          </div>
          <div className="card text-center">
            <h2>🏷️</h2>
            <h3>Harga Transparan</h3>
            <p style={{ color: '#666' }}>Tidak ada biaya tersembunyi.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- AUTH FORMS (REUSED LOGIC, NEW UI) ---
function RegisterForm({ setView }) {
  const [form, setForm] = useState({ nama_lengkap: '', username: '', password: '' });
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api_register.php`, form);
      if (res.data.status === 'success') { alert(res.data.message); setView('login_user'); }
      else { alert(res.data.message); }
    } catch (err) { alert('Gagal koneksi.'); }
  };
  return (
    <form onSubmit={handleRegister}>
      <div className="form-group"><label>Nama Lengkap</label><input className="form-control" required onChange={e => setForm({ ...form, nama_lengkap: e.target.value })} /></div>
      <div className="form-group"><label>Username</label><input className="form-control" required onChange={e => setForm({ ...form, username: e.target.value })} /></div>
      <div className="form-group"><label>Password</label><input type="password" className="form-control" required onChange={e => setForm({ ...form, password: e.target.value })} /></div>
      <button className="btn btn-primary btn-block">Daftar Sekarang</button>
      <div className="text-center mt-20"><span className="btn-link" onClick={() => setView('login_user')}>Sudah punya akun? Login</span></div>
    </form>
  );
}

function UserLoginForm({ setUser, setView }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login.php`, form);
      if (res.data.status === 'success') {
        if (res.data.data.role !== 'user') { setError("Bukan akun User!"); return; }
        setUser(res.data.data); localStorage.setItem('user', JSON.stringify(res.data.data)); setView('user');
      } else { setError(res.data.message); }
    } catch (err) { setError('Gagal koneksi.'); }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      <div className="form-group"><label>Username</label><input className="form-control" onChange={e => setForm({ ...form, username: e.target.value })} /></div>
      <div className="form-group"><label>Password</label><input type="password" className="form-control" onChange={e => setForm({ ...form, password: e.target.value })} /></div>
      <button className="btn btn-primary btn-block">Masuk</button>
      <div className="text-center mt-20" style={{ cursor: 'pointer', color: '#666' }} onClick={() => setView('register')}>Belum punya akun? Daftar</div>
    </form>
  );
}

function AdminLoginForm({ setUser, setView }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login.php`, form);
      if (res.data.status === 'success') {
        if (res.data.data.role !== 'admin') { setError("Bukan akun Admin!"); return; }
        setUser(res.data.data); localStorage.setItem('user', JSON.stringify(res.data.data)); setView('admin');
      } else { setError(res.data.message); }
    } catch (err) { setError('Gagal koneksi.'); }
  };
  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <div className="form-group"><label>Username</label><input className="form-control" onChange={e => setForm({ ...form, username: e.target.value })} /></div>
      <div className="form-group"><label>Password</label><input type="password" className="form-control" onChange={e => setForm({ ...form, password: e.target.value })} /></div>
      <button className="btn btn-secondary btn-block">Masuk Dashboard</button>
    </form>
  );
}

// --- DASHBOARDS ---
function UserDashboard({ user }) {
  const [tab, setTab] = useState('booking');
  const [selectedPkg, setSelectedPkg] = useState(null); // State untuk paket yang dipilih dari katalog

  const handleSelectService = (service) => {
    setSelectedPkg(service);
    setTab('booking');
  };

  return (
    <div className="container animate-fade-up">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <button onClick={() => setTab('booking')} className={`btn ${tab === 'booking' ? 'btn-primary' : 'btn-outline'}`}>Booking</button>
        <button onClick={() => setTab('queue')} className={`btn ${tab === 'queue' ? 'btn-primary' : 'btn-outline'}`}>Antrian Live</button>
        <button onClick={() => setTab('katalog')} className={`btn ${tab === 'katalog' ? 'btn-primary' : 'btn-outline'}`}>Harga</button>
      </div>
      {tab === 'booking' && <UserBookingManager user={user} preSelectedService={selectedPkg} clearSelection={() => setSelectedPkg(null)} />}
      {tab === 'queue' && <UserLiveQueue />}
      {tab === 'katalog' && <UserServiceCatalog onSelect={handleSelectService} />}
    </div>
  );
}

function UserServiceCatalog({ onSelect }) {
  const [services, setServices] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/api_services.php`).then(res => { if (res.data.status === 'success') setServices(res.data.data); }); }, []);
  return (
    <div className="grid-3">
      {services.map(s => (
        <div key={s.id} className="card service-card">
          <h3>{s.nama_layanan}</h3>
          <p style={{ color: '#666', minHeight: '50px' }}>{s.deskripsi}</p>
          <span className="service-price">Rp {parseInt(s.harga).toLocaleString()}</span>
          <button
            className="btn btn-primary btn-block mt-20"
            onClick={() => onSelect(s)}
          >
            Booking Sekarang
          </button>
        </div>
      ))}
    </div>
  );
}

function UserLiveQueue() {
  const [queue, setQueue] = useState([]);
  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, []);
  const loadQueue = async () => {
    const res = await axios.get(`${API_URL}/api_public_queue.php`);
    if (res.data.status === 'success') setQueue(res.data.data);
  };
  return (
    <div className="card">
      <h3 className="mb-20">🚦 Monitor Antrian</h3>
      <table className="table">
        <thead><tr><th>Nopol</th><th>Kendaraan</th><th>Status</th></tr></thead>
        <tbody>
          {queue.length === 0 ? <tr><td colSpan="3">Sepi bos.</td></tr> : queue.map((item, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 'bold' }}>{item.nopol}</td>
              <td>{item.jenis_kendaraan}<br /><small>{item.keluhan}</small></td>
              <td><span className={`badge status-${item.status}`}>{item.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserBookingManager({ user, preSelectedService, clearSelection }) {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [mode, setMode] = useState('paket');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const defaultForm = { jenis_kendaraan: 'Motor Bebek', nopol: '', keluhan: '', tanggal_booking: '', service_id: '' };
  const [form, setForm] = useState(defaultForm);

  // Load Services & History
  useEffect(() => {
    loadHistory();
    axios.get(`${API_URL}/api_services.php`).then(res => { if (res.data.status === 'success') setServices(res.data.data); });
  }, []);

  // Handle Pre-selected Service from Catalog
  useEffect(() => {
    if (preSelectedService) {
      setMode('paket');
      setForm(prev => ({ ...prev, service_id: preSelectedService.id }));
      // Optional: Scroll to form
    }
  }, [preSelectedService]);

  const loadHistory = async () => { const res = await axios.get(`${API_URL}/api_bookings.php?user_id=${user.id}`); if (res.data.status === 'success') setBookings(res.data.data); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let dataKirim = { ...form, user_id: user.id };
    if (mode === 'paket') {
      const selectedService = services.find(s => s.id == form.service_id);
      if (!selectedService) { alert("Pilih paket!"); return; }
      dataKirim.keluhan = `Paket: ${selectedService.nama_layanan}`;
    } else { dataKirim.service_id = ""; }

    try {
      if (isEditing) {
        await axios.post(`${API_URL}/api_booking_operations.php`, { ...dataKirim, action: 'update', booking_id: editId });
        alert('Disimpan!'); setIsEditing(false); setEditId(null);
      } else {
        await axios.post(`${API_URL}/api_tambah_booking.php`, dataKirim);
        alert('Booking Terkirim!');
      }
      setForm(defaultForm);
      if (clearSelection) clearSelection(); // Clear selection after submit
      loadHistory();
    } catch (err) { alert('Gagal'); }
  };

  const handleEdit = (item) => {
    if (item.status !== 'Pending') return alert("Hanya status Pending yang bisa diedit!");
    setIsEditing(true); setEditId(item.id); setMode(item.service_id ? 'paket' : 'manual');
    setForm({
      jenis_kendaraan: item.jenis_kendaraan,
      nopol: item.nopol,
      keluhan: item.keluhan,
      tanggal_booking: item.tanggal_booking,
      service_id: item.service_id || ''
    });
    // Optional: Scroll to form
    const formElement = document.querySelector('form');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDelete = async (id, status) => {
    if (status !== 'Pending') return alert("Sudah diproses, tidak bisa batal.");
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    await axios.post(`${API_URL}/api_booking_operations.php`, { action: 'delete', booking_id: id, user_id: user.id });
    loadHistory();
  };

  return (
    <div className="grid-2">
      <div className="card">
        <h3>{isEditing ? '✏️ Edit Booking' : 'Booking Baru'}</h3>
        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          <label style={{ cursor: 'pointer' }}><input type="radio" name="mode" checked={mode === 'paket'} onChange={() => setMode('paket')} /> Paket Servis</label>
          <label style={{ cursor: 'pointer' }}><input type="radio" name="mode" checked={mode === 'manual'} onChange={() => setMode('manual')} /> Manual</label>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: '15px', marginBottom: '0' }}>
            <div className="form-group"><label>Jenis</label><select className="form-control" value={form.jenis_kendaraan} onChange={e => setForm({ ...form, jenis_kendaraan: e.target.value })}><option>Motor Bebek</option><option>Motor Matic</option><option>Motor Sport</option></select></div>
            <div className="form-group"><label>Nopol</label><input className="form-control" value={form.nopol} onChange={e => setForm({ ...form, nopol: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label>Tanggal</label><input type="date" className="form-control" value={form.tanggal_booking} onChange={e => setForm({ ...form, tanggal_booking: e.target.value })} required /></div>

          {mode === 'paket' ? (
            <div className="form-group"><label>Layanan</label><select className="form-control" value={form.service_id} required onChange={e => setForm({ ...form, service_id: e.target.value })}><option value="">Pilih...</option>{services.map(s => (<option key={s.id} value={s.id}>{s.nama_layanan} - Rp {parseInt(s.harga).toLocaleString()}</option>))}</select></div>
          ) : (
            <div className="form-group"><label>Keluhan</label><textarea className="form-control" rows="3" value={form.keluhan} required onChange={e => setForm({ ...form, keluhan: e.target.value })} /></div>
          )}

          <button className="btn btn-primary btn-block">{isEditing ? 'Simpan Perubahan' : 'Kirim Booking'}</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm(defaultForm); }} className="btn btn-outline btn-block mt-20">Batal Edit</button>}
        </form>
      </div>

      <div className="card">
        <h3>Riwayat Saya</h3>
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table">
            <thead><tr><th>Motor</th><th>Status</th><th>#</th></tr></thead>
            <tbody>
              {bookings.length === 0 ? <tr><td colSpan="3">Belum ada history.</td></tr> : bookings.map(b => (
                <tr key={b.id}>
                  <td><b>{b.jenis_kendaraan}</b><br />{b.nopol}</td>
                  <td><span className={`badge status-${b.status}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'Pending' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <button
                          onClick={() => handleEdit(b)}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.75rem', padding: '5px 10px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id, b.status)}
                          className="btn btn-sm btn-outline"
                          style={{ borderColor: 'var(--brand-red)', color: 'var(--brand-red)', fontSize: '0.75rem', padding: '5px 10px' }}
                        >
                          Batalkan
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ user }) {
  const [tab, setTab] = useState('bookings');
  return (
    <div className="container animate-fade-up">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', justifyContent: 'center' }}>
        <button onClick={() => setTab('bookings')} className={`btn ${tab === 'bookings' ? 'btn-primary' : 'btn-outline'}`}>Antrian</button>
        <button onClick={() => setTab('layanan')} className={`btn ${tab === 'layanan' ? 'btn-primary' : 'btn-outline'}`}>Layanan</button>
      </div>
      {tab === 'bookings' ? <AdminBookingList /> : <AdminManageServices />}
    </div>
  );
}

function AdminBookingList() {
  const [data, setData] = useState([]);
  const loadData = async () => { try { const res = await axios.get(`${API_URL}/api_admin_bookings.php`); if (res.data.status === 'success') setData(res.data.data); } catch (e) { } };
  useEffect(() => { loadData(); }, []);
  const updateStatus = async (id, status_baru) => { await axios.post(`${API_URL}/api_update_status.php`, { id_booking: id, status_baru }); loadData(); };
  const handleDelete = async (id) => { if (confirm("Hapus?")) { await axios.post(`${API_URL}/api_hapus_booking.php`, { id_booking: id }); loadData(); } };

  return (
    <div className="card">
      <table className="table">
        <thead><tr><th>Pelanggan</th><th>Kendaraan</th><th>Status</th><th>Aksi</th></tr></thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td><b>{item.nama_lengkap}</b></td>
              <td>{item.jenis_kendaraan} ({item.nopol})<br /><small>{item.keluhan}</small></td>
              <td>
                <select className="form-control" style={{ padding: '5px' }} value={item.status} onChange={(e) => updateStatus(item.id, e.target.value)}>
                  <option value="Pending">Pending</option><option value="Diproses">Diproses</option><option value="Selesai">Selesai</option><option value="Dibatalkan">Dibatalkan</option>
                </select>
              </td>
              <td><button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">Hapus</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminManageServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ nama_layanan: '', deskripsi: '', harga: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const loadServices = async () => { const res = await axios.get(`${API_URL}/api_services.php`); if (res.data.status === 'success') setServices(res.data.data); };
  useEffect(() => { loadServices(); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = isEditing ? { ...form, action: 'update', id: editId } : form;
    await axios.post(`${API_URL}/api_services.php`, payload);
    setForm({ nama_layanan: '', deskripsi: '', harga: '' }); setIsEditing(false); setEditId(null); loadServices();
  };
  const handleDelete = async (id) => { if (confirm('Hapus?')) { await axios.post(`${API_URL}/api_services.php`, { action: 'delete', id }); loadServices(); } };

  return (
    <div className="grid-2">
      <div className="card">
        <h3>{isEditing ? 'Edit Layanan' : 'Tambah Layanan'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Nama</label><input className="form-control" value={form.nama_layanan} onChange={e => setForm({ ...form, nama_layanan: e.target.value })} required /></div>
          <div className="form-group"><label>Harga</label><input className="form-control" type="number" value={form.harga} onChange={e => setForm({ ...form, harga: e.target.value })} required /></div>
          <div className="form-group"><label>Deskripsi</label><textarea className="form-control" value={form.deskripsi} onChange={e => setForm({ ...form, deskripsi: e.target.value })} required /></div>
          <button className="btn btn-secondary btn-block">{isEditing ? 'Simpan' : 'Tambah'}</button>
          {isEditing && <button type="button" onClick={() => { setIsEditing(false); setForm({ nama_layanan: '', deskripsi: '', harga: '' }); }} className="btn btn-outline btn-block mt-20">Batal</button>}
        </form>
      </div>
      <div className="card">
        <h3>Daftar Layanan</h3>
        <table className="table">
          <thead><tr><th>Layanan</th><th>Edit</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td>{s.nama_layanan}<br /><small>{s.deskripsi}</small><br /><b>Rp {parseInt(s.harga).toLocaleString()}</b></td>
                <td><button onClick={() => { setIsEditing(true); setEditId(s.id); setForm(s); }} className="btn btn-sm btn-outline">✏️</button> <button onClick={() => handleDelete(s.id)} className="btn btn-sm btn-danger">🗑️</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
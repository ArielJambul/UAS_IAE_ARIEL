-- 1. PASTIIN DATABASE AKTIF
CREATE DATABASE IF NOT EXISTS bengkel_db;
USE bengkel_db;

-- 2. HAPUS TABEL LAMA (Urutan penting biar gak error foreign key)
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS users;

-- 3. BUAT TABEL USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user'
);

-- 4. BUAT TABEL SERVICES (LAYANAN)
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_layanan VARCHAR(100),
    deskripsi TEXT,
    harga DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. BUAT TABEL BOOKINGS (TRANSAKSI)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service_id INT NULL, 
    jenis_kendaraan VARCHAR(50),
    nopol VARCHAR(20),
    keluhan TEXT,
    tanggal_booking DATE,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Relasi: Jika User dihapus, booking ikut terhapus
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Relasi: Jika Layanan dihapus, nama layanan di booking jadi NULL (Biar history aman)
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

-- 6. ISI DATA DUMMY USERS (Login Admin & User)
-- Password sengaja dibuat plain text 'admin' agar login 100% berhasil
INSERT INTO users (nama_lengkap, username, password, role) VALUES 
('Administrator', 'admin', 'admin', 'admin'),
('Ariel User', 'ariel', 'ariel', 'user');

-- 7. ISI DATA DUMMY SERVICES (Biar tabel tidak kosong)
INSERT INTO services (nama_layanan, deskripsi, harga) VALUES 
('Ganti Oli & Filter', 'Ganti oli mesin Shell/Motul + filter oli original', 75000),
('Servis Ringan / Tune Up', 'Cek karburator/injeksi, rem, rantai, dan kelistrikan', 150000),
('Servis Besar / Turun Mesin', 'Perbaikan total bagian dalam mesin (Overhaul)', 500000);

-- 8. ISI CONTOH BOOKING (Biar Admin bisa lihat antrian)
INSERT INTO bookings (user_id, service_id, jenis_kendaraan, nopol, keluhan, tanggal_booking, status) VALUES 
(2, 1, 'Motor Matic', 'B 6666 JKT', 'Paket: Ganti Oli & Filter', CURDATE(), 'Pending');
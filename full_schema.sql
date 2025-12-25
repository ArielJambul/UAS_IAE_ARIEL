-- Database: bengkel_db

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100),
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    jenis_kendaraan VARCHAR(50),
    nopol VARCHAR(20),
    keluhan TEXT,
    tanggal_booking DATE,
    status VARCHAR(20) DEFAULT 'Pending',
    taksiran_biaya INT DEFAULT 0,
    catatan_admin TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_layanan VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    deskripsi TEXT
);

-- Data Default Users
INSERT IGNORE INTO users (nama_lengkap, username, password, role) 
VALUES ('Administrator', 'admin', 'admin', 'admin');

INSERT IGNORE INTO users (nama_lengkap, username, password, role) 
VALUES ('Ariel User', 'ariel', 'ariel', 'user');

-- Data Default Services
INSERT INTO services (nama_layanan, harga, deskripsi) VALUES 
('Servis Ringan', 50000, 'Ganti oli dan cek mesin standar'),
('Servis Besar', 150000, 'Bongkar mesin dan pembersihan total'),
('Ganti Ban', 35000, 'Jasa pasang ban (belum termasuk harga ban)');

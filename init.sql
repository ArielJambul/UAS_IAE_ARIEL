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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Akun Default: Username 'admin', Password 'admin'
INSERT INTO users (nama_lengkap, username, password, role) 
VALUES ('Administrator', 'admin', 'admin', 'admin');

-- Akun Default: Username 'ariel', Password 'ariel'
INSERT INTO users (nama_lengkap, username, password, role) 
VALUES ('Ariel User', 'ariel', 'ariel', 'user');
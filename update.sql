CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_layanan VARCHAR(100) NOT NULL,
    harga INT NOT NULL,
    deskripsi TEXT
);

INSERT INTO services (nama_layanan, harga, deskripsi) VALUES 
('Servis Ringan', 50000, 'Ganti oli dan cek mesin standar'),
('Servis Besar', 150000, 'Bongkar mesin dan pembersihan total'),
('Ganti Ban', 35000, 'Jasa pasang ban (belum termasuk harga ban)');

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS taksiran_biaya INT DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS catatan_admin TEXT DEFAULT NULL;

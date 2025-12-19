<?php
include 'koneksi.php';

// Ambil data dari form
$nama = $_POST['nama_lengkap'];
$username = $_POST['username'];
$password = $_POST['password'];

// 1. Enkripsi Password (Wajib biar aman)
// Kita pakai password_hash supaya sesuai dengan logika di cek_login.php
$password_encrypted = password_hash($password, PASSWORD_DEFAULT);

// 2. Siapkan Query Simpan
// Role otomatis kita set jadi 'user'
$query = "INSERT INTO users (username, password, nama_lengkap, role) 
          VALUES ('$username', '$password_encrypted', '$nama', 'user')";

// 3. Eksekusi Query
if ($conn->query($query) === TRUE) {
    // Jika berhasil, kembali ke halaman login
    header("location:login.php?pesan=Pendaftaran berhasil, silakan login!");
} else {
    // Jika gagal (misal username sudah dipakai)
    echo "Error: " . $query . "<br>" . $conn->error;
}
?>
<?php
// Hostname sesuaikan dengan nama service DB di docker-compose.yml
// Kalau di gambar awal kamu namanya 'bengkel_db', pakai itu.
$host = "bengkel_db"; 
$user = "root";
$pass = "root"; // Password sesuaikan dengan MYSQL_ROOT_PASSWORD di docker-compose
$db   = "bengkel_db"; // Nama database yang kamu buat

$koneksi = mysqli_connect($host, $user, $pass, $db);

if (!$koneksi) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
?>
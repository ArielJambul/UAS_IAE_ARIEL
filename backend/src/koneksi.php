<?php
// PENTING: Hostname harus sama dengan nama service di docker-compose ("bengkel_db")
$servername = "bengkel_db"; 
$username = "root";
$password = "root";
$dbname = "bengkel_db";

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}
?>
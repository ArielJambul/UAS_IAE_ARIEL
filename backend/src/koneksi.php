<?php
// Hostname HARUS 'bengkel_db' (sesuai nama service di docker-compose)
$servername = "bengkel_db"; 
$username = "root";
$password = "root";
$dbname = "bengkel_db";

// Membuat koneksi
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    // Return error sebagai JSON agar tidak merusak frontend
    die(json_encode(["status" => "error", "message" => "Koneksi gagal: " . $conn->connect_error]));
}
?>
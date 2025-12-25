<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['nama_lengkap']) || !isset($input['username']) || !isset($input['password'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap!"]);
    exit;
}

$nama = $conn->real_escape_string($input['nama_lengkap']);
$username = $conn->real_escape_string($input['username']);
$password = $input['password']; // Disimpan sebagai text biasa agar konsisten dengan init.sql (atau bisa di-hash jika mau)

// Cek Username Double
$check = $conn->query("SELECT id FROM users WHERE username = '$username'");
if ($check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username sudah dipakai!"]);
    exit;
}

// Insert User Baru (Role Default = user)
$sql = "INSERT INTO users (nama_lengkap, username, password, role) VALUES ('$nama', '$username', '$password', 'user')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Registrasi berhasil! Silakan login."]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal: " . $conn->error]);
}
?>

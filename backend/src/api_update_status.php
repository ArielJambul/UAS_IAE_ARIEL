<?php
// 1. Header CORS Lengkap (Wajib agar Frontend bisa Update data)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // <-- Ini kuncinya!
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle Preflight Request (Browser tanya izin dulu sebelum kirim data update)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'koneksi.php';

// 3. Ambil Data JSON dari Frontend
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

// 4. Validasi Input
if(!isset($data['id_booking']) || !isset($data['status_baru'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

$id = $data['id_booking'];
$status = $data['status_baru'];

// 5. Eksekusi Update ke Database
$query = "UPDATE bookings SET status = '$status' WHERE id = '$id'";

if ($conn->query($query) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Status berhasil diubah!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
}
?>
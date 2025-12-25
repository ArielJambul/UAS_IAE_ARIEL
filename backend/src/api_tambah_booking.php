<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'koneksi.php';

$data = json_decode(file_get_contents('php://input'), true);

if(!isset($data['user_id']) || !isset($data['nopol'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap!"]);
    exit;
}

$user_id = $data['user_id'];
$jenis = $data['jenis_kendaraan'];
$nopol = $data['nopol'];
$keluhan = $data['keluhan'];
$tanggal = $data['tanggal_booking'];
$status = "Pending";

// LOGIKA BARU: Cek apakah user memilih paket servis (service_id)
// Jika service_id ada isinya, masukkan. Jika kosong, set NULL (manual).
$service_id = (isset($data['service_id']) && $data['service_id'] != "") ? "'".$data['service_id']."'" : "NULL";

$query = "INSERT INTO bookings (user_id, service_id, jenis_kendaraan, nopol, keluhan, tanggal_booking, status) 
          VALUES ('$user_id', $service_id, '$jenis', '$nopol', '$keluhan', '$tanggal', '$status')";

if ($conn->query($query) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Booking berhasil disimpan!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal: " . $conn->error]);
}
?>
<?php
// 1. Header Wajib API
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// 2. Terima Data JSON dari Frontend
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

// Cek apakah data lengkap?
if(!isset($data['user_id']) || !isset($data['nopol'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap!"]);
    exit;
}

$user_id = $data['user_id'];
$jenis = $data['jenis_kendaraan'];
$nopol = $data['nopol'];
$keluhan = $data['keluhan'];
$tanggal = $data['tanggal_booking'];
$status = "Pending"; // Default status

// 3. Masukkan ke Database
$query = "INSERT INTO bookings (user_id, jenis_kendaraan, nopol, keluhan, tanggal_booking, status) 
          VALUES ('$user_id', '$jenis', '$nopol', '$keluhan', '$tanggal', '$status')";

if ($conn->query($query) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Booking berhasil disimpan!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal: " . $conn->error]);
}
?>
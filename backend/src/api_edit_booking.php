<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id']) || !isset($data['jenis_kendaraan']) || !isset($data['nopol']) || !isset($data['keluhan']) || !isset($data['tanggal_booking'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

$id = $conn->real_escape_string($data['id']);
$jenis = $conn->real_escape_string($data['jenis_kendaraan']);
$nopol = $conn->real_escape_string($data['nopol']);
$keluhan = $conn->real_escape_string($data['keluhan']);
$tanggal = $conn->real_escape_string($data['tanggal_booking']);

$sql = "UPDATE bookings SET jenis_kendaraan='$jenis', nopol='$nopol', keluhan='$keluhan', tanggal_booking='$tanggal' WHERE id='$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Booking diperbarui"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
}
?>

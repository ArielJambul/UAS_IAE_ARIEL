<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_booking'])) {
    echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
    exit;
}

$id = $conn->real_escape_string($data['id_booking']);

$sql = "DELETE FROM bookings WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Booking dihapus"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus: " . $conn->error]);
}
?>

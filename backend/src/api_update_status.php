<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);

if(!isset($data['id_booking']) || !isset($data['status_baru'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

$id = $data['id_booking'];
$status = $data['status_baru'];

$query = "UPDATE bookings SET status = '$status' WHERE id = '$id'";

if ($conn->query($query) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Status berhasil diubah!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal update: " . $conn->error]);
}
?>
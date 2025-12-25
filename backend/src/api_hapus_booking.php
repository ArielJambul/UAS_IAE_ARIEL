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

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id_booking'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Parameter id_booking wajib ada"]);
    exit;
}

$id = $conn->real_escape_string($data['id_booking']);

$sql = "DELETE FROM bookings WHERE id = '$id'";

if ($conn->query($sql) === TRUE) {
    if ($conn->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Booking dihapus"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Booking tidak ditemukan"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Gagal menghapus: " . $conn->error]);
}
?>

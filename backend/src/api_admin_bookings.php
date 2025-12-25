<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// Query JOIN: Ambil data Booking + Nama User + Nama Layanan (jika ada)
$query = "SELECT bookings.*, users.nama_lengkap, services.nama_layanan, services.harga 
          FROM bookings 
          JOIN users ON bookings.user_id = users.id 
          LEFT JOIN services ON bookings.service_id = services.id
          ORDER BY bookings.created_at DESC";

$result = $conn->query($query);
$data = [];

if ($result && $result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "empty", "data" => []]);
}
?>
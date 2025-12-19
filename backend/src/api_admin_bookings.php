<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// Query JOIN: Mengambil data booking + Nama User pemiliknya
$query = "SELECT bookings.*, users.nama_lengkap 
          FROM bookings 
          JOIN users ON bookings.user_id = users.id 
          ORDER BY bookings.created_at DESC";

$result = $conn->query($query);
$data = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $data]);
} else {
    echo json_encode(["status" => "empty", "data" => []]);
}
?>
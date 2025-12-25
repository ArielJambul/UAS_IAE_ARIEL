<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// Ambil antrian yang belum selesai (Pending, Diproses) dan yang baru selesai hari ini
// Status: Pending, Diproses, Selesai (Limit 5 terakhir biar tau progress)
$query = "SELECT jenis_kendaraan, nopol, keluhan, status, created_at FROM bookings 
          WHERE status != 'Dibatalkan' 
          ORDER BY FIELD(status, 'Diproses', 'Pending', 'Selesai') ASC, created_at ASC";

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

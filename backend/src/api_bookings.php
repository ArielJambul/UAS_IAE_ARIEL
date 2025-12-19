<?php
// 1. Header Wajib API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// 2. Cek apakah ada ID User yang dikirim?
if (!isset($_GET['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User ID tidak ditemukan"]);
    exit;
}

$user_id = $_GET['user_id'];

// 3. Ambil data dari Database
$query = "SELECT * FROM bookings WHERE user_id = '$user_id' ORDER BY created_at DESC";
$result = $conn->query($query);

$bookings = [];

if ($result->num_rows > 0) {
    // Masukkan semua baris data ke array
    while($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    // Kirim balasan JSON Sukses
    echo json_encode([
        "status" => "success",
        "data" => $bookings
    ]);
} else {
    // Kirim balasan Kosong (tapi sukses)
    echo json_encode([
        "status" => "empty",
        "data" => []
    ]);
}
?>
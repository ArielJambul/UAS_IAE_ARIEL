<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include 'koneksi.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = isset($input['action']) ? $input['action'] : '';

// Validasi Dasar
if(!isset($input['booking_id']) || !isset($input['user_id'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

$booking_id = $input['booking_id'];
$user_id = $input['user_id'];

// --- HAPUS / BATALKAN BOOKING ---
if ($action == 'delete') {
    // Hanya bisa hapus jika status masih 'Pending' DAN milik user tersebut
    $query = "DELETE FROM bookings WHERE id='$booking_id' AND user_id='$user_id' AND status='Pending'";
    
    if ($conn->query($query) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Booking berhasil dibatalkan"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal: Booking sudah diproses atau bukan milik Anda"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}

// --- UPDATE / EDIT BOOKING ---
elseif ($action == 'update') {
    $jenis = $input['jenis_kendaraan'];
    $nopol = $input['nopol'];
    $tanggal = $input['tanggal_booking'];
    
    // Logic Service ID vs Manual
    $keluhan = $input['keluhan'];
    $service_id = (isset($input['service_id']) && $input['service_id'] != "") ? "'".$input['service_id']."'" : "NULL";

    $query = "UPDATE bookings SET 
              jenis_kendaraan='$jenis', nopol='$nopol', keluhan='$keluhan', tanggal_booking='$tanggal', service_id=$service_id 
              WHERE id='$booking_id' AND user_id='$user_id' AND status='Pending'";

    if ($conn->query($query) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(["status" => "success", "message" => "Data booking berhasil diubah"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal: Booking sudah diproses atau tidak ditemukan"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
}
?>
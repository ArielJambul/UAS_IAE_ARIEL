<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Ambil semua layanan
    $sql = "SELECT * FROM services";
    $result = $conn->query($sql);
    $services = [];
    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }
    echo json_encode(["status" => "success", "data" => $services]);
} 
elseif ($method == 'POST') {
    // Tambah layanan baru
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['nama_layanan']) || !isset($data['harga'])) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
        exit;
    }
    
    $nama = $conn->real_escape_string($data['nama_layanan']);
    $harga = (int)$data['harga'];
    $deskripsi = isset($data['deskripsi']) ? $conn->real_escape_string($data['deskripsi']) : '';

    $sql = "INSERT INTO services (nama_layanan, harga, deskripsi) VALUES ('$nama', '$harga', '$deskripsi')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Layanan berhasil ditambahkan"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal: " . $conn->error]);
    }
}
elseif ($method == 'DELETE') {
    // Hapus layanan
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id'])) {
        echo json_encode(["status" => "error", "message" => "ID tidak ditemukan"]);
        exit;
    }
    $id = (int)$data['id'];
    $sql = "DELETE FROM services WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Layanan dihapus"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal: " . $conn->error]);
    }
}
?>

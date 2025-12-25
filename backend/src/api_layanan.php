<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include 'koneksi.php';

$method = $_SERVER['REQUEST_METHOD'];

// --- GET: AMBIL SEMUA LAYANAN ---
if ($method == 'GET') {
    $result = $conn->query("SELECT * FROM services ORDER BY id DESC");
    $data = [];
    while($row = $result->fetch_assoc()) { $data[] = $row; }
    echo json_encode(["status" => "success", "data" => $data]);
}

// --- POST: CREATE, UPDATE, DELETE ---
elseif ($method == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = isset($input['action']) ? $input['action'] : 'create';

    // 1. DELETE
    if($action == 'delete') {
        $id = $input['id'];
        $conn->query("DELETE FROM services WHERE id='$id'");
        echo json_encode(["status" => "success", "message" => "Layanan dihapus"]);
        exit;
    }

    // 2. UPDATE (EDIT)
    if($action == 'update') {
        $id = $input['id'];
        $nama = $input['nama_layanan'];
        $desc = $input['deskripsi'];
        $harga = $input['harga'];
        
        $sql = "UPDATE services SET nama_layanan='$nama', deskripsi='$desc', harga='$harga' WHERE id='$id'";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Layanan berhasil diupdate"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
        exit;
    }

    // 3. CREATE (TAMBAH)
    if(isset($input['nama_layanan'])) {
        $nama = $input['nama_layanan'];
        $desc = $input['deskripsi'];
        $harga = $input['harga'];

        $sql = "INSERT INTO services (nama_layanan, deskripsi, harga) VALUES ('$nama', '$desc', '$harga')";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "Layanan berhasil ditambah"]);
        } else {
            echo json_encode(["status" => "error", "message" => $conn->error]);
        }
    }
}
?>
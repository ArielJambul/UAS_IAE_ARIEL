<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['nama_lengkap']) || !isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit;
}

$nama_lengkap = $conn->real_escape_string($data['nama_lengkap']);
$username = $conn->real_escape_string($data['username']);
$password = $data['password']; 
$role = isset($data['role']) ? $conn->real_escape_string($data['role']) : 'user';

// Cek username
$check = $conn->query("SELECT id FROM users WHERE username = '$username'");
if ($check && $check->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Username sudah digunakan"]);
    exit;
}

$sql = "INSERT INTO users (nama_lengkap, username, password, role) VALUES ('$nama_lengkap', '$username', '$password', '$role')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success", "message" => "Registrasi berhasil"]);
} else {
    echo json_encode(["status" => "error", "message" => "Gagal registrasi: " . $conn->error]);
}
?>

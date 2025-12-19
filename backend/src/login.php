<?php
// --- HEADER API (PENTING BUAT NETWORK) ---
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include 'koneksi.php';

// Ambil data yang dikirim Frontend (Format JSON)
$data_input = json_decode(file_get_contents("php://input"), true);

$username = $data_input['username'];
$password = $data_input['password'];

// Cek Database
$query = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // Verifikasi Password (sesuaikan kalau pakai hash atau plain text)
    // Anggap saja password di db plain text dulu sesuai contoh sebelumnya
    if ($password == $row['password']) {
        
        // --- JAWABAN SUKSES (JSON) ---
        echo json_encode([
            "status" => "success",
            "message" => "Login Berhasil",
            "data" => [
                "id" => $row['id'],
                "username" => $row['username'],
                "role" => $row['role']
            ]
        ]);
        
    } else {
        // --- JAWABAN GAGAL PASSWORD (JSON) ---
        echo json_encode([
            "status" => "error",
            "message" => "Password Salah"
        ]);
    }
} else {
    // --- JAWABAN GAGAL USERNAME (JSON) ---
    echo json_encode([
        "status" => "error",
        "message" => "Username tidak ditemukan"
    ]);
}
?>
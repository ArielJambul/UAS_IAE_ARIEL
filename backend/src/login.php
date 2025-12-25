<?php
// 1. Konfigurasi Header CORS yang Lengkap
// Penting agar frontend (port 8080/5173) bisa komunikasi dengan backend (port 5000)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Tambahkan OPTIONS
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle Preflight Request (Browser suka cek dulu sebelum kirim data)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'koneksi.php';

// Ambil data JSON
$data_input = json_decode(file_get_contents("php://input"), true);

// Validasi input kosong
if (!$data_input) {
    echo json_encode(["status" => "error", "message" => "Data input tidak valid"]);
    exit;
}

$username = $data_input['username'];
$password = $data_input['password'];

// Cek Database
$query = "SELECT * FROM users WHERE username='$username'";
$result = $conn->query($query);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    
    // 3. LOGIKA CEK PASSWORD (HYBRID)
    // Kita pakai logika ganda supaya:
    // a. Akun dari 'init.sql' (admin/admin) tetap bisa login (karena di DB passwordnya plain text).
    // b. Akun hasil Register baru tetap bisa login (karena di DB passwordnya terenkripsi).
    
    $password_is_valid = false;

    // Cek 1: Apakah password di database terenkripsi hash? (Untuk user hasil register)
    if (password_verify($password, $row['password'])) {
        $password_is_valid = true;
    }
    // Cek 2: Apakah password di database plain text? (Untuk user default 'admin' dari init.sql)
    else if ($password == $row['password']) {
        $password_is_valid = true;
    }

    if ($password_is_valid) {
        // --- JAWABAN SUKSES ---
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
        // --- JAWABAN GAGAL PASSWORD ---
        echo json_encode([
            "status" => "error",
            "message" => "Password Salah"
        ]);
    }
} else {
    // --- JAWABAN GAGAL USERNAME ---
    echo json_encode([
        "status" => "error",
        "message" => "Username tidak ditemukan"
    ]);
}
?>
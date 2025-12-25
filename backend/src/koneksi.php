<?php
// Tahan error HTML agar tidak merusak JSON
error_reporting(0);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

// Prioritas: Ambil dari ENV (Docker), jika tidak ada baru pakai default
$servername = getenv('DB_HOST') ?: "localhost"; 
$username = getenv('DB_USER') ?: "root"; 
$password = getenv('DB_PASS') ?: ""; 
$dbname = getenv('DB_NAME') ?: "bengkel_db";

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Koneksi Error: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8mb4");

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Database Error: " . $e->getMessage() . " (Host: $servername)"
    ]);
    exit;
}
?>
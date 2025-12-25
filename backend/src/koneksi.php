<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// host.docker.internal = Alamat Laptop (XAMPP) dari dalam Docker
$servername = "host.docker.internal"; 

// Username XAMPP (Default)
$username = "root"; 

// Password XAMPP (Default KOSONG)
// Hapus isinya, biarkan string kosong ""
$password = ""; 

$dbname = "bengkel_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    // Ini akan muncul di Inspect Element jika gagal
    die(json_encode(["status" => "error", "message" => "Gagal Konek XAMPP: " . $conn->connect_error]));
}
?>
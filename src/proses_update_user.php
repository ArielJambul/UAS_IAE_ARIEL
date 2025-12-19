<?php
session_start();
include 'koneksi.php';

$id = $_POST['id'];
$jenis = $_POST['jenis_kendaraan'];
$nopol = $_POST['nopol'];
$keluhan = $_POST['keluhan'];
$tanggal = $_POST['tanggal_booking'];

// Update data
$query = "UPDATE bookings SET 
          jenis_kendaraan='$jenis', nopol='$nopol', keluhan='$keluhan', tanggal_booking='$tanggal' 
          WHERE id='$id' AND status='Pending'";

if ($conn->query($query) === TRUE) {
    header("location:user_dashboard.php?pesan=Data berhasil diupdate!");
} else {
    echo "Error: " . $conn->error;
}
?>
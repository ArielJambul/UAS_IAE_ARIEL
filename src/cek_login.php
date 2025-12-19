<?php 
// Mengaktifkan session php
session_start();
 
// Menghubungkan dengan koneksi
include 'koneksi.php';
 
// Menangkap data yang dikirim dari form
$username = $_POST['username'];
$password = md5($_POST['password']);
 
// Menyeleksi data admin dengan username dan password yang sesuai
$data = mysqli_query($koneksi,"select * from users where username='$username' and password='$password'");
 
// Menghitung jumlah data yang ditemukan
$cek = mysqli_num_rows($data);
 
if($cek > 0){
    $row = mysqli_fetch_assoc($data);

    // PENTING: Simpan ID dan Role ke Session
    $_SESSION['username'] = $username;
    $_SESSION['role']     = $row['role'];
    $_SESSION['user_id']  = $row['id'];     // <-- INI WAJIB ADA BUAT BOOKING
    $_SESSION['status']   = "login";
 
    // Cek jika user login sebagai admin
    if($row['role'] == "admin"){
        header("location:admin_dashboard.php");
 
    // Cek jika user login sebagai pelanggan
    }else if($row['role'] == "pelanggan"){
        header("location:user_dashboard.php");
 
    }else{
        header("location:index.php?pesan=gagal");
    }
}else{
    header("location:index.php?pesan=gagal");
}
?>
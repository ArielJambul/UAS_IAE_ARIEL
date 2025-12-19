<?php
// 1. Mulai Session (Wajib ada di baris paling atas)
session_start();

// 2. Cek Keamanan: Apakah user sudah login DAN role-nya Admin?
if (!isset($_SESSION['role']) || $_SESSION['role'] != "admin") {
    // Jika bukan admin, paksa balik ke halaman login
    header("location:index.php?pesan=belum_login");
    exit;
}

// 3. Hubungkan ke Database
include 'koneksi.php';

// 4. Cek apakah tombol Update ditekan (apakah ada data POST yang dikirim)
if (isset($_POST['id_booking']) && isset($_POST['status'])) {

    // Tangkap data dari form yang ada di admin_dashboard.php
    $id_booking = $_POST['id_booking'];
    $status     = $_POST['status'];

    // 5. Buat Query Update
    // Logika: Ubah kolom 'status' menjadi X dimana ID bookingnya adalah Y
    $query = "UPDATE bookings SET status='$status' WHERE id='$id_booking'";

    // 6. Eksekusi Query
    if (mysqli_query($koneksi, $query)) {
        // JIKA BERHASIL:
        // Redirect kembali ke dashboard admin dengan membawa pesan sukses di URL
        header("location:admin_dashboard.php?pesan=update_sukses");
    } else {
        // JIKA GAGAL (Error Database):
        echo "Terjadi Kesalahan saat update data: " . mysqli_error($koneksi);
        echo "<br><a href='admin_dashboard.php'>Kembali ke Dashboard</a>";
    }

} else {
    // Jika file ini dibuka langsung lewat URL tanpa mengisi form (akses ilegal)
    // Kembalikan ke dashboard
    header("location:admin_dashboard.php");
}
?>
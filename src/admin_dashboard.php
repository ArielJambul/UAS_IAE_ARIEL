<?php
session_start();
// Cek apakah yang akses benar-benar admin
if ($_SESSION['role'] != "admin") {
    header("location:index.php?pesan=gagal");
}
include 'koneksi.php';
?>

<!DOCTYPE html>
<html>
<head>
    <title>Halaman Admin Bengkel</title>
</head>
<body>
    <h1>Dashboard Admin</h1>
    <p>Halo, <?php echo $_SESSION['username']; ?>! <a href="logout.php">Logout</a></p>

    <hr>
    
    <h3>Daftar Antrian Booking Masuk</h3>
    <table border="1" cellpadding="10" cellspacing="0">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Pelanggan</th>
                <th>Motor</th>
                <th>Keluhan</th>
                <th>Tanggal</th>
                <th>Status Saat Ini</th>
                <th>Aksi (Ubah Status)</th>
            </tr>
        </thead>
        <tbody>
            <?php
            // Join tabel bookings dengan users supaya nama pelanggan muncul
            $query = "SELECT bookings.*, users.nama FROM bookings 
                      JOIN users ON bookings.user_id = users.id 
                      ORDER BY bookings.id DESC";
            
            $data = mysqli_query($koneksi, $query);
            $no = 1;
            
            while($d = mysqli_fetch_array($data)){
            ?>
            <tr>
                <td><?php echo $no++; ?></td>
                <td><?php echo $d['nama']; ?></td> <td><?php echo $d['kendaraan']; ?></td>
                <td><?php echo $d['keluhan']; ?></td>
                <td><?php echo $d['tanggal']; ?></td>
                <td>
                    <?php 
                    if($d['status'] == 'Pending'){ echo '<span style="color:red">Pending</span>'; }
                    elseif($d['status'] == 'Proses'){ echo '<span style="color:blue">Sedang Dikerjakan</span>'; }
                    else { echo '<span style="color:green">Selesai</span>'; }
                    ?>
                </td>
                <td>
                    <form action="update_status.php" method="POST">
                        <input type="hidden" name="id_booking" value="<?php echo $d['id']; ?>">
                        <select name="status">
                            <option value="Pending" <?php if($d['status']=='Pending') echo 'selected'; ?>>Pending</option>
                            <option value="Proses" <?php if($d['status']=='Proses') echo 'selected'; ?>>Proses</option>
                            <option value="Selesai" <?php if($d['status']=='Selesai') echo 'selected'; ?>>Selesai</option>
                        </select>
                        <button type="submit">Update</button>
                    </form>
                </td>
            </tr>
            <?php } ?>
        </tbody>
    </table>
</body>
</html>
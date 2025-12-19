<?php
session_start();
include 'koneksi.php';

if($_SESSION['status'] != "login"){ header("location:login.php"); exit; }

$id = $_GET['id'];
$user_id = $_SESSION['user_id'];

// Ambil data lama
$query = "SELECT * FROM bookings WHERE id='$id' AND user_id='$user_id'";
$result = $conn->query($query);
$data = $result->fetch_assoc();

// Jika data tidak ada atau status sudah bukan Pending, tendang balik
if(!$data || $data['status'] != 'Pending') {
    header("location:user_dashboard.php?pesan=Data tidak bisa diedit!");
    exit;
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <title>Edit Booking</title>
    <style>
        body { font-family: sans-serif; padding: 50px; background: #f4f4f4; }
        .box { background: white; padding: 20px; max-width: 500px; margin: auto; border-radius: 8px; }
        input, textarea, select { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; box-sizing: border-box;}
        button { background: #ffc107; border: none; padding: 10px 20px; cursor: pointer; width: 100%; }
    </style>
</head>
<body>
    <div class="box">
        <h2>✏️ Edit Booking</h2>
        <form action="proses_update_user.php" method="POST">
            <input type="hidden" name="id" value="<?php echo $data['id']; ?>">
            
            <label>Jenis Kendaraan</label>
            <select name="jenis_kendaraan">
                <option value="Motor Bebek" <?php if($data['jenis_kendaraan']=='Motor Bebek') echo 'selected'; ?>>Motor Bebek</option>
                <option value="Motor Matic" <?php if($data['jenis_kendaraan']=='Motor Matic') echo 'selected'; ?>>Motor Matic</option>
                <option value="Motor Sport" <?php if($data['jenis_kendaraan']=='Motor Sport') echo 'selected'; ?>>Motor Sport</option>
            </select>

            <label>Nopol</label>
            <input type="text" name="nopol" value="<?php echo $data['nopol']; ?>" required>

            <label>Keluhan</label>
            <textarea name="keluhan" rows="3" required><?php echo $data['keluhan']; ?></textarea>

            <label>Tanggal Rencana</label>
            <input type="date" name="tanggal_booking" value="<?php echo $data['tanggal_booking']; ?>" required>

            <button type="submit">Simpan Perubahan</button>
            <br><br>
            <a href="user_dashboard.php">Kembali</a>
        </form>
    </div>
</body>
</html>
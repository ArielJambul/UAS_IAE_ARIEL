<?php
session_start();
// Cek apakah sudah login?
if($_SESSION['status'] != "login"){
    header("location:login.php?pesan=Belum login!");
}
?>
<h1>Welcome Back, <?php echo $_SESSION['username']; ?>!</h1>
<a href="logout.php">Logout</a>
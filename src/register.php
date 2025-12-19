<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Register New Account</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; }
        .box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); width: 350px; }
        input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
        button { width: 100%; padding: 10px; background-color: #28a745; color: white; border: none; cursor: pointer; }
        button:hover { background-color: #218838; }
    </style>
</head>
<body>
    <div class="box">
        <h2 style="text-align: center;">Register Account</h2>
        
        <form action="proses_register.php" method="POST">
            <label>Your Fullname</label>
            <input type="text" name="nama_lengkap" required placeholder="Example: Ariel Putra">

            <label>Your Username</label>
            <input type="text" name="username" required placeholder="Example: ariel">
            
            <label>Your Password</label>
            <input type="password" name="password" required placeholder="Example: password">
            
            <button type="submit">Register Now</button>
        </form>
        
        <p style="text-align: center; font-size: 12px;">
            Already have an account? <a href="login.php">Login here</a>
        </p>
    </div>
</body>
</html>
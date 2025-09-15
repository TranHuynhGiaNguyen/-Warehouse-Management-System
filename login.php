<?php
session_start();
require_once 'config.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password'])) {
            // Đặt session trước khi header
            $_SESSION['user_id']  = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role']     = $user['role'];
            $_SESSION['loggedin'] = true;

            // Đường dẫn tuyệt đối cho chắc
            header("Location: /WarehouseManagement/index.php");
            exit;
        } else {
            $error = "Sai mật khẩu!";
        }
    } else {
        $error = "Tên đăng nhập không tồn tại!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>login</title>
        <script src="https://kit.fontawesome.com/c9f5871d83.js" crossorigin="anonymous"></script>  
        <link rel="stylesheet" href="./assets/css/login.css?v=<?= time() ?>">
        <style>
            #message {
                color: red;
                font-weight: bold;
                margin-bottom: 10px;
                padding: 8px;
                border-radius: 5px;
                background-color: rgba(255, 0, 0, 0.1);
                display: none; 
            }
            #message.show {
                display: block; 
            }
        </style>
    </head>
    <body>
    <div class="background">
        <header class="header">
            <nav class="nav">
                <a href="index.php">Trang chủ</a>
                <a href="about.php">Về chúng tôi</a>
                <a href="#">Chăm sóc khách hàng</a>
            </nav>
        </header>
        <section class="home"> 
            <div class="content">
                <a class="logo">Warehouse Management</a>
                <h2>Chào mừng!</h2>
                <pre>Liên hệ với chúng tôi qua các nền tảng xã hội sau</pre>
                <div class="icon">
                    <i class="fa-brands fa-instagram"></i>
                    <i class="fa-brands fa-facebook"></i>
                    <i class="fa-brands fa-twitter"></i>
                    <i class="fa-brands fa-github"></i>
                </div>
            </div>
        </section>
        <form class="login" method="POST" action="">
            <h2>Đăng nhập</h2>
            
            <!-- Thông báo lỗi sẽ hiển thị ở đây -->
            <div id="message" class="<?php echo !empty($error) ? 'show' : ''; ?>">
                <?php echo htmlspecialchars($error); ?>
            </div>

            <div class="input">
                <input type="username" name="username" class="input1" placeholder="Tài Khoản" required>
                <i class="fa-solid fa-envelope"></i>
            </div>
            <div class="input">
                <input type="password" name="password" class="input1" placeholder="Mật khẩu" required>
                <i class="fa-solid fa-lock"></i>
            </div>
            <div class="check">
                <label><input type="checkbox"> Nhớ mật khẩu</label>
            </div>
            <div class="button">
                <button class="btn" type="submit">Đăng nhập</button>
                </div>
            </div>
        </form>
    </div>
</body>
</html>
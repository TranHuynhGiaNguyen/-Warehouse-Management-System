<?php
session_start(); 
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}
require_once __DIR__ . '/includes/auth.php';
include 'config.php'; //Database connection
$result = $conn->query("SELECT * FROM products");
?>
<!DOCTYPE html>
<html lang="vi">
<head>
<style>

.logout-box h3 {
  margin-bottom:10px;
  color:#333;
}
.logout-btn {
  display:inline-block;
  padding:8px 16px;
  background:#0dc8e9;
  color:#fff;
  font-weight:600;
  border-radius:6px;
  text-decoration:none;
  transition:background 0.3s;
}
.logout-btn:hover {
  background:#099db4;
}

</style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quản lý tồn kho</title>

    <!-- CSS chung -->
    <link rel="stylesheet" href="assets/css/style.css?v=2">
    <link rel="stylesheet" href="assets/css/header.css?v=1">
    <link rel="stylesheet" href="assets/css/sidebar.css?v=1">

    <!-- Font -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>
    <div class="layout">
        <!-- Sidebar -->
        <?php include 'includes/sidebar.php'; ?>

        <!-- Main content -->
        <div class="main-content">
            <header class="main-header">
                <div class="logo">📦 Inventory</div>
                <nav class="main-nav">
                    <a href="index.php" class="active">Trang chủ</a>
               
                </nav>
                <div class="user-info">
                    <span>Xin chào</span>
                </div>
                <div class="logout-box">
                <a href="logout.php" class="logout-btn">Đăng xuất</a>
                </div>

            </header>

            <main class="container">
                <section class="section">
                    <table class="inventory-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Mã SKU</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while($row = $result->fetch_assoc()): ?>
                            <tr>
                                <td><?= $row['id'] ?></td>
                                <td><?= $row['name'] ?></td>
                                <td><?= $row['sku'] ?></td>
                                <td><?= $row['quantity'] ?></td>
                                <td><?= number_format($row['price'], 0, ',', '.') ?> ₫</td>
                            </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    </div>
</body>
</html>
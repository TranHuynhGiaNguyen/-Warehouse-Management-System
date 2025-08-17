<?php
include 'config.php';
$result = $conn->query("SELECT * FROM products");
?>
<!DOCTYPE html>
<html lang="vi">
<head>
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
                    <a href="add.php">Thêm sản phẩm</a>
                    <a href="report.php">Báo cáo</a>
                </nav>
                <div class="user-info">
                    <span>Xin chào, Admin</span>
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
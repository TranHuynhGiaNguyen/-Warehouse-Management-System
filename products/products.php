<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối DB
include __DIR__ . '/../config.php';

// Lấy danh sách sản phẩm
$result = $conn->query("SELECT * FROM products ORDER BY id DESC");
if (!$result) {
    die("Lỗi truy vấn: " . $conn->error);
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quản lý sản phẩm</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body>

<div class="layout">
  <!-- Sidebar -->
  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <!-- Main content -->
  <div class="main-content">
    <!-- Header -->
    <?php include __DIR__ . '/../includes/header.php'; ?>
    
    <!-- Page content -->
    <div class="container">
      <div class="section">
        <div class="page-header">
          <h2>📋 Danh sách sản phẩm</h2>
          <a href="product_add.php" class="btn btn-primary">➕ Thêm sản phẩm</a>
        </div>

        <table class="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Mã SKU</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
          <?php if ($result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
              <tr>
                <td><?= $row['id'] ?></td>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= htmlspecialchars($row['sku']) ?></td>
                <td><?= $row['quantity'] ?></td>
                <td><?= number_format($row['price'], 0, ',', '.') ?> ₫</td>
                <td>
                  <a href="product_edit.php?id=<?= $row['id'] ?>">✏️ Sửa</a> | 
                  <a href="product_delete.php?id=<?= $row['id'] ?>" onclick="return confirm('Xóa sản phẩm này?')">🗑️ Xóa</a>
                </td>
              </tr>
            <?php endwhile; ?>
          <?php else: ?>
            <tr>
              <td colspan="6" style="text-align: center; color: #b3b3b3;">Không có sản phẩm nào</td>
            </tr>
          <?php endif; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

</body>
</html>
<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../config.php';

$message = "";
$product = null;

// Lấy ID sản phẩm từ URL
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id > 0) {
    // Lấy thông tin sản phẩm
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
}

if (!$product) {
    header("Location: products.php");
    exit;
}

// Xử lý cập nhật
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST['name'] ?? '';
    $sku = $_POST['sku'] ?? '';
    $quantity = (int)($_POST['quantity'] ?? 0);
    $price = (float)($_POST['price'] ?? 0);

    if (!empty($name) && !empty($sku)) {
        $stmt = $conn->prepare("UPDATE products SET name=?, sku=?, quantity=?, price=? WHERE id=?");
        $stmt->bind_param("ssidi", $name, $sku, $quantity, $price, $id);
        if ($stmt->execute()) {
            header("Location: products.php");
            exit;
        } else {
            $message = "❌ Lỗi khi cập nhật sản phẩm: " . $conn->error;
        }
    } else {
        $message = "⚠️ Vui lòng nhập đầy đủ thông tin!";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sửa sản phẩm</title>
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
          <h2>✏️ Sửa sản phẩm</h2>
        </div>

        <?php if ($message): ?>
          <div class="alert" style="padding: 10px; margin-bottom: 20px; border-radius: 4px; <?= strpos($message, '❌') !== false ? 'background: #f8d7da; color: #721c24;' : 'background: #d4edda; color: #155724;' ?>">
            <?= $message ?>
          </div>
        <?php endif; ?>

        <form method="POST" action="" class="form">
          <div>
            <label>Tên sản phẩm:</label>
            <input type="text" name="name" value="<?= htmlspecialchars($product['name']) ?>" required>
          </div>

          <div>
            <label>Mã SKU:</label>
            <input type="text" name="sku" value="<?= htmlspecialchars($product['sku']) ?>" required>
          </div>

          <div>
            <label>Số lượng:</label>
            <input type="number" name="quantity" value="<?= $product['quantity'] ?>" required>
          </div>

          <div>
            <label>Giá:</label>
            <input type="number" step="0.01" name="price" value="<?= $product['price'] ?>" required>
          </div>

          <div style="margin-top: 20px;">
            <button type="submit" class="btn btn-primary">Cập nhật</button>
            <a href="products.php" class="btn" style="background: #666; color: white; margin-left: 10px;">Hủy</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

</body>
</html>
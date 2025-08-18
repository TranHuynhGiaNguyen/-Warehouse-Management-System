<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<!-- Debug: Bắt đầu trang product_add.php -->";

include __DIR__ . '/../config.php';

echo "<!-- Debug: Đã include config.php -->";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    echo "<!-- Debug: POST request detected -->";
    
    $name = $_POST['name'] ?? '';
    $sku = $_POST['sku'] ?? '';
    $quantity = (int)($_POST['quantity'] ?? 0);
    $price = (float)($_POST['price'] ?? 0);

    echo "<!-- Debug: name=$name, sku=$sku, quantity=$quantity, price=$price -->";

    if (!empty($name) && !empty($sku)) {
        $stmt = $conn->prepare("INSERT INTO products (name, sku, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssid", $name, $sku, $quantity, $price);
        if ($stmt->execute()) {
            echo "<!-- Debug: Insert thành công, chuyển hướng -->";
            header("Location: products.php");
            exit;
        } else {
            $message = "❌ Lỗi khi thêm sản phẩm: " . $conn->error;
            echo "<!-- Debug: Lỗi insert: " . $conn->error . " -->";
        }
    } else {
        $message = "⚠️ Vui lòng nhập đầy đủ thông tin!";
        echo "<!-- Debug: Thiếu thông tin name hoặc sku -->";
    }
}

echo "<!-- Debug: Chuẩn bị render HTML -->";
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thêm sản phẩm</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  
</head>
<body>

<!-- Debug: Bắt đầu layout -->
<div class="layout">

  <!-- Sidebar -->
  <div class="sidebar">
    <?php 
    echo "<!-- Debug: Bắt đầu include sidebar -->";
    if (file_exists(__DIR__ . '/../includes/sidebar.php')) {
        include __DIR__ . '/../includes/sidebar.php';
        echo "<!-- Debug: Sidebar included thành công -->";
    } else {
        echo "<h3>📊 Menu</h3>";
        echo "<ul>";
        echo "<li><a href='../index.php' style='color: white;'>🏠 Trang chủ</a></li>";
        echo "<li><a href='products.php' style='color: white;'>📦 Sản phẩm</a></li>";
        echo "</ul>";
        echo "<!-- Debug: Sidebar file không tồn tại, dùng fallback -->";
    }
    ?>
  </div>

  <!-- Nội dung chính -->
  <div class="main-content">
    <?php 
    echo "<!-- Debug: Bắt đầu include header -->";
    if (file_exists(__DIR__ . '/../includes/header.php')) {
        include __DIR__ . '/../includes/header.php';
        echo "<!-- Debug: Header included thành công -->";
    }
    ?>
    
    <header class="main-header">
      <h2>➕ Thêm sản phẩm mới</h2>
    </header>

    <main class="container">
      <?php if ($message): ?>
        <div class="message <?= strpos($message, '❌') !== false ? 'error' : 'success' ?>">
          <?= $message ?>
        </div>
      <?php endif; ?>

      <!-- Debug: Form bắt đầu -->
      <form method="POST" action="">
        <label>Tên sản phẩm:</label>
        <input type="text" name="name" required>

        <label>Mã SKU:</label>
        <input type="text" name="sku" required>

        <label>Số lượng:</label>
        <input type="number" name="quantity" value="0" required>

        <label>Giá:</label>
        <input type="number" step="0.01" name="price" value="0" required>

        <button type="submit" class="btn">Lưu sản phẩm</button>
        <a href="products.php" class="btn" style="background: #95a5a6; margin-left: 10px;">Hủy</a>
      </form>
      <!-- Debug: Form kết thúc -->

    </main>
  </div>
</div>

</body>
</html>
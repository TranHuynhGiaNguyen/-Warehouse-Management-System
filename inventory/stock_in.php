<?php
require_once __DIR__ . '/../includes/auth.php'; 
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../config.php';

$message = "";
$selected_product = null;

// Lấy danh sách sản phẩm
$products_result = $conn->query("SELECT id, name, sku, quantity FROM products ORDER BY name");

// Nếu có product_id trong URL, lấy thông tin sản phẩm đó
$product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
if ($product_id > 0) {
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $selected_product = $result->fetch_assoc();
}

// Xử lý nhập kho
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $product_id = (int)$_POST['product_id'];
    $quantity = (int)$_POST['quantity'];
    $reason = $_POST['reason'] ?? '';
    $reference = $_POST['reference'] ?? '';
    
    if ($product_id > 0 && $quantity > 0) {
        // Bắt đầu transaction
        $conn->begin_transaction();
        
        try {
            // Thêm vào bảng stock_transactions
            $stmt = $conn->prepare("INSERT INTO stock_transactions (product_id, transaction_type, quantity, reason, reference) VALUES (?, 'in', ?, ?, ?)");
            $stmt->bind_param("iiss", $product_id, $quantity, $reason, $reference);
            $stmt->execute();
            
            // Cập nhật số lượng trong bảng products
            $stmt = $conn->prepare("UPDATE products SET quantity = quantity + ? WHERE id = ?");
            $stmt->bind_param("ii", $quantity, $product_id);
            $stmt->execute();
            
            $conn->commit();
            
            header("Location: inventory.php?success=stock_in");
            exit;
            
        } catch (Exception $e) {
            $conn->rollback();
            $message = "❌ Lỗi khi nhập kho: " . $e->getMessage();
        }
    } else {
        $message = "⚠️ Vui lòng chọn sản phẩm và nhập số lượng hợp lệ!";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nhập kho</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/stock_in.css?v=<?= time() ?>">
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
          <h2>📥 Nhập kho</h2>
          <a href="inventory.php" class="btn" style="background: #666; color: white;">← Quay lại</a>
        </div>

        <?php if ($message): ?>
          <div class="alert" style="padding: 10px; margin-bottom: 20px; border-radius: 4px; <?= strpos($message, '❌') !== false ? 'background: #f8d7da; color: #721c24;' : 'background: #d4edda; color: #155724;' ?>">
            <?= $message ?>
          </div>
        <?php endif; ?>

        <form method="POST" action="" class="form">
          <div>
            <label>Chọn sản phẩm:</label>
            <select name="product_id" id="product_id" required onchange="updateProductInfo()">
              <option value="">-- Chọn sản phẩm --</option>
              <?php while($product = $products_result->fetch_assoc()): ?>
                <option value="<?= $product['id'] ?>" 
                        data-name="<?= htmlspecialchars($product['name']) ?>"
                        data-sku="<?= htmlspecialchars($product['sku']) ?>"
                        data-quantity="<?= $product['quantity'] ?>"
                        <?= ($selected_product && $selected_product['id'] == $product['id']) ? 'selected' : '' ?>>
                  <?= htmlspecialchars($product['name']) ?> (<?= $product['sku'] ?>) - Tồn: <?= $product['quantity'] ?>
                </option>
              <?php endwhile; ?>
            </select>
          </div>

          <!-- Thông tin sản phẩm được chọn -->
          <div id="product-info" class="product-info" style="display: <?= $selected_product ? 'block' : 'none' ?>;">
            <h4>Thông tin sản phẩm</h4>
            <p><strong>Tên:</strong> <span id="info-name"><?= $selected_product['name'] ?? '' ?></span></p>
            <p><strong>SKU:</strong> <span id="info-sku"><?= $selected_product['sku'] ?? '' ?></span></p>
            <p class="current-stock"><strong>Tồn kho hiện tại:</strong> <span id="info-quantity"><?= $selected_product['quantity'] ?? '' ?></span></p>
          </div>

          <div>
            <label>Số lượng nhập:</label>
            <input type="number" name="quantity" min="1" required placeholder="Nhập số lượng cần nhập kho">
          </div>

          <div>
            <label>Lý do nhập kho:</label>
            <select name="reason" required>
              <option value="">-- Chọn lý do --</option>
              <option value="Nhập hàng từ nhà cung cấp">Nhập hàng từ nhà cung cấp</option>
              <option value="Nhập hàng đầu kỳ">Nhập hàng đầu kỳ</option>
              <option value="Điều chỉnh tồn kho">Điều chỉnh tồn kho</option>
              <option value="Trả hàng từ khách">Trả hàng từ khách</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div>
            <label>Mã tham chiếu (tùy chọn):</label>
            <input type="text" name="reference" placeholder="VD: PO001, HD001...">
            <small style="color: #b3b3b3; font-size: 12px;">Mã phiếu nhập, hóa đơn, hoặc tài liệu tham khảo</small>
          </div>

          <div style="margin-top: 20px;">
            <button type="submit" class="btn btn-primary">✅ Xác nhận nhập kho</button>
            <a href="inventory.php" class="btn" style="background: #666; color: white; margin-left: 10px;">Hủy</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<script>
function updateProductInfo() {
    const select = document.getElementById('product_id');
    const selectedOption = select.options[select.selectedIndex];
    const infoDiv = document.getElementById('product-info');
    
    if (select.value) {
        document.getElementById('info-name').textContent = selectedOption.getAttribute('data-name');
        document.getElementById('info-sku').textContent = selectedOption.getAttribute('data-sku');
        document.getElementById('info-quantity').textContent = selectedOption.getAttribute('data-quantity');
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}
</script>

</body>
</html>
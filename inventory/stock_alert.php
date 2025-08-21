<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../config.php';

$message = "";
$product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;

// Lấy thông tin sản phẩm
if ($product_id > 0) {
    $stmt = $conn->prepare("SELECT p.*, COALESCE(sa.min_quantity, 5) as current_min_quantity, sa.id as alert_id, sa.is_active 
                           FROM products p 
                           LEFT JOIN stock_alerts sa ON p.id = sa.product_id 
                           WHERE p.id = ?");
    $stmt->bind_param("i", $product_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $product = $result->fetch_assoc();
    
    if (!$product) {
        header("Location: inventory.php");
        exit;
    }
} else {
    header("Location: inventory.php");
    exit;
}

// Xử lý cập nhật cài đặt cảnh báo
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $min_quantity = (int)$_POST['min_quantity'];
    $is_active = isset($_POST['is_active']) ? 1 : 0;
    
    if ($min_quantity >= 0) {
        try {
            if ($product['alert_id']) {
                // Update existing alert
                $stmt = $conn->prepare("UPDATE stock_alerts SET min_quantity = ?, is_active = ? WHERE id = ?");
                $stmt->bind_param("iii", $min_quantity, $is_active, $product['alert_id']);
                $stmt->execute();
            } else {
                // Create new alert
                $stmt = $conn->prepare("INSERT INTO stock_alerts (product_id, min_quantity, is_active) VALUES (?, ?, ?)");
                $stmt->bind_param("iii", $product_id, $min_quantity, $is_active);
                $stmt->execute();
            }
            
            $message = "✅ Cài đặt cảnh báo đã được cập nhật!";
            
            // Reload product data
            $stmt = $conn->prepare("SELECT p.*, COALESCE(sa.min_quantity, 5) as current_min_quantity, sa.id as alert_id, sa.is_active 
                                   FROM products p 
                                   LEFT JOIN stock_alerts sa ON p.id = sa.product_id 
                                   WHERE p.id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
            
        } catch (Exception $e) {
            $message = "❌ Lỗi khi cập nhật cài đặt: " . $e->getMessage();
        }
    } else {
        $message = "⚠️ Số lượng tối thiểu phải >= 0!";
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cài đặt cảnh báo tồn kho</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/stock_alert.css?v=<?= time() ?>">
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
          <h2>⚙️ Cài đặt cảnh báo tồn kho</h2>
          <a href="inventory.php" class="btn" style="background: #666; color: white;">← Quay lại</a>
        </div>

        <?php if ($message): ?>
          <div class="alert" style="padding: 10px; margin-bottom: 20px; border-radius: 4px; <?= strpos($message, '❌') !== false ? 'background: #f8d7da; color: #721c24;' : 'background: #d4edda; color: #155724;' ?>">
            <?= $message ?>
          </div>
        <?php endif; ?>

        <!-- Product Info -->
        <div class="product-info">
          <h3>📦 Thông tin sản phẩm</h3>
          <p><strong>Tên sản phẩm:</strong> <?= htmlspecialchars($product['name']) ?></p>
          <p><strong>Mã SKU:</strong> <?= htmlspecialchars($product['sku']) ?></p>
          <p><strong>Giá:</strong> <?= number_format($product['price'], 0, ',', '.') ?> ₫</p>
        </div>

        <!-- Current Status -->
        <div class="current-status">
          <div class="status-item">
            <div class="status-value <?= $product['quantity'] == 0 ? 'danger' : ($product['quantity'] <= $product['current_min_quantity'] ? 'warning' : 'normal') ?>">
              <?= $product['quantity'] ?>
            </div>
            <div class="status-label">Tồn kho hiện tại</div>
          </div>
          
          <div class="status-item">
            <div class="status-value <?= $product['current_min_quantity'] > 0 ? 'warning' : 'normal' ?>">
              <?= $product['current_min_quantity'] ?>
            </div>
            <div class="status-label">Ngưỡng cảnh báo hiện tại</div>
          </div>
          
          <div class="status-item">
            <div class="status-value <?= $product['is_active'] ? 'normal' : 'danger' ?>">
              <?= $product['is_active'] ? 'BẬT' : 'TẮT' ?>
            </div>
            <div class="status-label">Trạng thái cảnh báo</div>
          </div>
          
          <div class="status-item">
            <div class="status-value <?= $product['quantity'] == 0 ? 'danger' : ($product['quantity'] <= $product['current_min_quantity'] && $product['is_active'] ? 'warning' : 'normal') ?>">
              <?php if ($product['quantity'] == 0): ?>
                HẾT HÀNG
              <?php elseif ($product['quantity'] <= $product['current_min_quantity'] && $product['is_active']): ?>
                CẢNH BÁO
              <?php else: ?>
                BÌNH THƯỜNG
              <?php endif; ?>
            </div>
            <div class="status-label">Trạng thái tồn kho</div>
          </div>
        </div>

        <!-- Settings Form -->
        <form method="POST" action="" class="form">
          <h3>⚙️ Cài đặt cảnh báo</h3>
          
          <div>
            <label>Ngưỡng cảnh báo tồn kho thấp:</label>
            <input type="number" name="min_quantity" value="<?= $product['current_min_quantity'] ?>" min="0" required>
            <small style="color: #b3b3b3; font-size: 12px;">
              Hệ thống sẽ cảnh báo khi số lượng tồn kho <= ngưỡng này
            </small>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" name="is_active" id="is_active" <?= $product['is_active'] ? 'checked' : '' ?>>
            <label for="is_active">Kích hoạt cảnh báo cho sản phẩm này</label>
          </div>

          <!-- Preview -->
          <div id="alert-preview" class="alert-preview">
            <strong>🔍 Xem trước:</strong>
            <div id="preview-text"></div>
          </div>

          <div style="margin-top: 20px;">
            <button type="submit" class="btn" style="background: #ffa500; color: white;">💾 Lưu cài đặt</button>
            <a href="inventory.php" class="btn" style="background: #666; color: white; margin-left: 10px;">Hủy</a>
          </div>
        </form>

        <!-- Usage Guide -->
        <div style="background: #282828; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #1db954;">
          <h4>📚 Hướng dẫn sử dụng</h4>
          <ul style="color: #b3b3b3; margin-left: 20px; line-height: 1.6;">
            <li><strong>Ngưỡng cảnh báo:</strong> Đặt số lượng tối thiểu mà bạn muốn được cảnh báo</li>
            <li><strong>Tắt cảnh báo:</strong> Bỏ tick "Kích hoạt cảnh báo" nếu không muốn nhận cảnh báo cho sản phẩm này</li>
            <li><strong>Cảnh báo sẽ hiển thị:</strong> Trang tồn kho, dashboard, và các báo cáo</li>
            <li><strong>Màu sắc:</strong> 
              <span style="color: #1db954;">Xanh lá = Đủ hàng</span>, 
              <span style="color: #ffa500;">Cam = Tồn kho thấp</span>, 
              <span style="color: #ff4444;">Đỏ = Hết hàng</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
function updatePreview() {
    const minQuantity = parseInt(document.querySelector('input[name="min_quantity"]').value) || 0;
    const isActive = document.querySelector('input[name="is_active"]').checked;
    const currentStock = <?= $product['quantity'] ?>;
    const previewDiv = document.getElementById('alert-preview');
    const previewText = document.getElementById('preview-text');
    
    if (!isActive) {
        previewDiv.className = 'alert-preview normal';
        previewText.innerHTML = '✅ Cảnh báo đã được tắt cho sản phẩm này';
        return;
    }
    
    if (currentStock == 0) {
        previewDiv.className = 'alert-preview danger';
        previewText.innerHTML = '🚨 <strong>HẾT HÀNG:</strong> Sản phẩm đã hết hàng và cần nhập kho ngay lập tức!';
    } else if (currentStock <= minQuantity) {
        previewDiv.className = 'alert-preview warning';
        previewText.innerHTML = `⚠️ <strong>TỒN KHO THẤP:</strong> Chỉ còn ${currentStock} sản phẩm (ngưỡng cảnh báo: ${minQuantity})`;
    } else {
        previewDiv.className = 'alert-preview normal';
        previewText.innerHTML = `✅ <strong>ĐỦ HÀNG:</strong> Tồn kho ${currentStock} > ngưỡng cảnh báo ${minQuantity}`;
    }
}

// Update preview on input change
document.querySelector('input[name="min_quantity"]').addEventListener('input', updatePreview);
document.querySelector('input[name="is_active"]').addEventListener('change', updatePreview);

// Initial preview
updatePreview();
</script>

</body>
</html>
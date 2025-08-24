<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối DB
include __DIR__ . '/../config.php';

// Lấy danh sách sản phẩm với thông tin tồn kho và cảnh báo
$sql = "SELECT p.*, 
               COALESCE(sa.min_quantity, 5) as min_quantity,
               CASE WHEN p.quantity <= COALESCE(sa.min_quantity, 5) THEN 1 ELSE 0 END as is_low_stock
        FROM products p
        LEFT JOIN stock_alerts sa ON p.id = sa.product_id AND sa.is_active = 1
        ORDER BY p.quantity ASC";

$result = $conn->query($sql);
if (!$result) {
    die("Lỗi truy vấn: " . $conn->error);
}

// Đếm số sản phẩm cảnh báo tồn kho thấp
$low_stock_count = 0;
$products = [];
while ($row = $result->fetch_assoc()) {
    if ($row['is_low_stock']) {
        $low_stock_count++;
    }
    $products[] = $row;
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Quản lý tồn kho</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/inventory.css?v=<?= time() ?>">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        .stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background: linear-gradient(145deg, #1c1c1c, #111);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #2a2a2a;
  box-shadow: 0 2px 6px rgba(0,0,0,0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.6);
}

.stat-card.success {
  border-left: 5px solid #1db954;
}
.stat-card.warning {
  border-left: 5px solid #ffa500;
}
.stat-card.info {
  border-left: 5px solid #1e90ff;
}
.stat-card.danger {
  border-left: 5px solid #ff4444;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

    </style>
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
          <h2>📋 Quản lý tồn kho</h2>
          <div class="actions-buttons">
            <a href="stock_in.php" class="btn btn-primary">📥 Nhập kho</a>
            <a href="stock_out.php" class="btn" style="background: #ff6b35; color: white;">Xuất kho</a>
            <a href="stock_history.php" class="btn" style="background: #666; color: white;">Lịch sử</a>
          </div>
        </div>

        <!-- Stats Cards -->
    <div class="stats-grid">
          <a href="?filter=all" class="stat-card success filter-tab <?= ($_GET['filter'] ?? 'all') == 'all' ? 'active' : '' ?>">
            <div class="stat-number"><?= count($products) ?></div>
            <div class="stat-label">Tất cả sản phẩm</div>
          </a>
          
          <a href="?filter=low_stock" class="stat-card warning filter-tab <?= ($_GET['filter'] ?? '') == 'low_stock' ? 'active' : '' ?>">
            <div class="stat-number"><?= $low_stock_count ?></div>
            <div class="stat-label">Tồn kho thấp</div>
          </a>
          
          <a href="?filter=out_of_stock" class="stat-card danger filter-tab <?= ($_GET['filter'] ?? '') == 'out_of_stock' ? 'active' : '' ?>">
            <div class="stat-number"><?= array_sum(array_column(array_filter($products, fn($p) => $p['quantity'] == 0), 'quantity')) == 0 ? count(array_filter($products, fn($p) => $p['quantity'] == 0)) : 0 ?></div>
            <div class="stat-label">Hết hàng</div>
          </a>
          
          <div class="stat-card info">
            <div class="stat-number"><?= number_format(array_sum(array_column($products, 'quantity'))) ?></div>
            <div class="stat-label">Tổng số lượng tồn</div>
          </div>
          
          <div class="stat-card secondary">
            <div class="stat-number">
              <?= number_format(array_sum(array_map(fn($p) => $p['quantity'] * $p['price'], $products)), 0, ',', '.') ?>₫
            </div>
            <div class="stat-label">Giá trị tồn kho</div>
          </div>
        </div>
                <!-- Filter Menu -->
        <form method="get" style="margin-bottom: 20px; display:flex; gap:10px; align-items:center;">
          <!-- Giữ filter cũ (all/low/out) -->
          <input type="hidden" name="filter" value="<?= htmlspecialchars($_GET['filter'] ?? 'all') ?>">

          <label for="sort" style="color:#ccc;">Sắp xếp theo:</label>
          <select name="sort" id="sort" onchange="this.form.submit()" 
                  style="padding:6px 12px; border-radius:6px; background:#111; color:#fff; border:1px solid #444;">
            <option value="">-- Chọn --</option>
            <option value="sku" <?= ($_GET['sort'] ?? '')=='sku' ? 'selected' : '' ?>>Mã SKU</option>
            <option value="name" <?= ($_GET['sort'] ?? '')=='name' ? 'selected' : '' ?>>Tên sản phẩm</option>
            <option value="quantity" <?= ($_GET['sort'] ?? '')=='quantity' ? 'selected' : '' ?>>Số lượng</option>
            <option value="value" <?= ($_GET['sort'] ?? '')=='value' ? 'selected' : '' ?>>Giá trị tồn kho</option>
          </select>
          
        </form>
        

        <!-- Inventory Table -->
        <table class="inventory-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Mã SKU</th>
              <th>Tồn kho</th>
              <th>Tồn kho tối thiểu</th>
              <th>Trạng thái</th>
              <th>Tổng Giá trị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
          <?php 
          $filter = $_GET['filter'] ?? 'all';
          $filtered_products = array_filter($products, function($product) use ($filter) {
              switch ($filter) {
                  case 'low_stock':
                      return $product['is_low_stock'] && $product['quantity'] > 0;
                  case 'out_of_stock':
                      return $product['quantity'] == 0;
                  default:
                      return true;
              }
          });
          // Sắp xếp theo menu chọn
          if (!empty($_GET['sort'])) {
              usort($filtered_products, function($a, $b) {
                  switch ($_GET['sort']) {
                      case 'sku':
                          return strcmp($a['sku'], $b['sku']);
                      case 'name':
                          return strcmp($a['name'], $b['name']);
                      case 'quantity':
                          return $b['quantity'] <=> $a['quantity']; // giảm dần
                      case 'value':
                          $valueA = $a['quantity'] * $a['price'];
                          $valueB = $b['quantity'] * $b['price'];
                          return $valueB <=> $valueA; // giảm dần
                      default:
                          return 0;
                  }
              });
          }

          
          if (count($filtered_products) > 0): ?>
            <?php foreach($filtered_products as $product): ?>
              <tr class="<?= $product['quantity'] == 0 ? 'low-stock' : ($product['is_low_stock'] ? 'low-stock' : '') ?>">
                <td><?= $product['id'] ?></td>
                <td><?= htmlspecialchars($product['name']) ?></td>
                <td><?= htmlspecialchars($product['sku']) ?></td>
                <td>
                  <strong><?= $product['quantity'] ?></strong>
                  <?php if ($product['quantity'] == 0): ?>
                    <span style="color: #ff4444; font-size: 12px;">⚠️ Hết hàng</span>
                  <?php elseif ($product['is_low_stock']): ?>
                    <span style="color: #ffa500; font-size: 12px;">⚠️ Thấp</span>
                  <?php endif; ?>
                </td>
                <td><?= $product['min_quantity'] ?></td>
                <td>
                  <?php if ($product['quantity'] == 0): ?>
                    <span style="color: #ff4444;">❌ Hết hàng</span>
                  <?php elseif ($product['is_low_stock']): ?>
                    <span style="color: #ffa500;">⚠️ Tồn kho thấp</span>
                  <?php else: ?>
                    <span style="color: #1db954;">✅ Đủ hàng</span>
                  <?php endif; ?>
                </td>
                <td><?= number_format($product['quantity'] * $product['price'], 0, ',', '.') ?> ₫</td>
                <td>
                  <a href="stock_in.php?product_id=<?= $product['id'] ?>" style="color: #1db954;"> Nhập</a> | 
                  <a href="stock_out.php?product_id=<?= $product['id'] ?>" style="color: #ff6b35;"> Xuất</a> | 
                  <a href="stock_alert.php?product_id=<?= $product['id'] ?>" style="color: #ffa500;">⚙️ Cài đặt</a>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr>
              <td colspan="8" style="text-align: center; color: #b3b3b3;">
                <?php if ($filter == 'low_stock'): ?>
                  Không có sản phẩm nào có tồn kho thấp
                <?php elseif ($filter == 'out_of_stock'): ?>
                  Không có sản phẩm nào hết hàng
                <?php else: ?>
                  Không có sản phẩm nào
                <?php endif; ?>
              </td>
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
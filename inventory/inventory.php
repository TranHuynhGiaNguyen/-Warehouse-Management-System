<?php
require_once __DIR__ . '/../includes/auth.php'; 
error_reporting(E_ALL);
ini_set('display_errors', 1);
include __DIR__ . '/../config.php';


$sql = "SELECT p.*,
           COALESCE(sa.min_quantity, 5) AS min_quantity,
           CASE WHEN p.quantity <= COALESCE(sa.min_quantity, 5) THEN 1 ELSE 0 END AS is_low_stock
    FROM products p
    LEFT JOIN (
        SELECT product_id, MIN(min_quantity) AS min_quantity
        FROM stock_alerts
        WHERE is_active = 1
        GROUP BY product_id
    ) sa ON p.id = sa.product_id
    ORDER BY p.quantity ASC";


$result = $conn->query($sql);
if (!$result) {
    die("Lỗi truy vấn: " . $conn->error);
}


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
    .stat-card.secondary {
      border-left: 5px solid #9333ea;
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

    .import-export-section {
      background: linear-gradient(145deg, #1c1c1c, #111);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid #2a2a2a;
      margin: 20px 0;
    }

    .import-export-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }

    .import-export-card {
      background: #0f1419;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #333;
      text-align: center;
      transition: all 0.3s ease;
    }

    .import-export-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      border-color: #1db954;
    }

    .import-export-card .icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .import-export-card .title {
      color: #fff;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .import-export-card .description {
      color: #aaa;
      font-size: 13px;
      margin-bottom: 15px;
    }

    .quick-actions {
      background: #0f1419;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #333;
      margin: 20px 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
    }

    .quick-action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #ccc;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .quick-action-btn:hover {
      background: #2a2a2a;
      border-color: #1db954;
      color: #fff;
      transform: translateY(-1px);
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
        <div class="page-header">
          <h2>📋 Quản lý tồn kho</h2>
          <div class="actions-buttons">
            <a href="stock_in.php" class="btn btn-primary">📥 Nhập kho</a>
            <a href="stock_out.php" class="btn" style="background: #ff6b35; color: white;">📤 Xuất kho</a>
            <a href="stock_history.php" class="btn" style="background: #666; color: white;">📜 Lịch sử</a>
          </div>
        </div>

        <!-- Import/Export Section -->
        <div class="import-export-section">
          <h3 style="color: #fff; margin-bottom: 5px;">🔄 Import / Export dữ liệu</h3>
          <p style="color: #aaa; font-size: 14px; margin-bottom: 15px;">
            Nhập hoặc xuất dữ liệu tồn kho hàng loạt
          </p>
          
          <div class="import-export-grid">
            <a href="inventory_import.php" class="import-export-card" style="text-decoration: none;">
              <div class="icon">📥</div>
              <div class="title">Import Excel</div>
              <div class="description">Nhập dữ liệu từ file Excel (.xlsx, .xls)</div>
              <div class="btn btn-primary" style="padding: 8px 16px; font-size: 13px;">Chọn file</div>
            </a>
            
            <a href="inventory_export.php" class="import-export-card" style="text-decoration: none;">
              <div class="icon">📤</div>
              <div class="title">Export Excel</div>
              <div class="description">Xuất toàn bộ dữ liệu ra file Excel</div>
              <div class="btn" style="background: #1e90ff; color: white; padding: 8px 16px; font-size: 13px;">Tải xuống</div>
            </a>
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
          
          <div style="margin-left: auto; display: flex; gap: 10px;">
            <input type="text" name="search" placeholder="🔍 Tìm kiếm sản phẩm..." 
                   value="<?= htmlspecialchars($_GET['search'] ?? '') ?>"
                   style="padding: 8px 12px; border-radius: 6px; background: #111; color: #fff; border: 1px solid #444; min-width: 200px;">
            <button type="submit" class="btn btn-primary" style="padding: 8px 16px;">Tìm</button>
            <?php if (!empty($_GET['search'])): ?>
              <a href="?" class="btn" style="background: #666; color: white; padding: 8px 16px;">Xóa</a>
            <?php endif; ?>
          </div>
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
          $search = $_GET['search'] ?? '';
          
          $filtered_products = array_filter($products, function($product) use ($filter, $search) {
              // Filter theo loại
              $type_match = true;
              switch ($filter) {
                  case 'low_stock':
                      $type_match = $product['is_low_stock'] && $product['quantity'] > 0;
                      break;
                  case 'out_of_stock':
                      $type_match = $product['quantity'] == 0;
                      break;
                  default:
                      $type_match = true;
              }
              
              // Filter theo tìm kiếm
              $search_match = true;
              if (!empty($search)) {
                  $search_match = (
                      stripos($product['name'], $search) !== false ||
                      stripos($product['sku'], $search) !== false ||
                      stripos($product['category'] ?? '', $search) !== false
                  );
              }
              
              return $type_match && $search_match;
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
                <td>
                  <strong><?= htmlspecialchars($product['name']) ?></strong>
                  <?php if (!empty($product['category'])): ?>
                    <br><small style="color: #888;"><?= htmlspecialchars($product['category']) ?></small>
                  <?php endif; ?>
                </td>
                <td>
                  <code style="background: #333; padding: 2px 6px; border-radius: 3px; font-size: 12px;">
                    <?= htmlspecialchars($product['sku']) ?>
                  </code>
                </td>
                <td>
                  <strong style="font-size: 16px;"><?= $product['quantity'] ?></strong>
                  <?php if ($product['quantity'] == 0): ?>
                    <br><span style="color: #ff4444; font-size: 11px;">⚠️ Hết hàng</span>
                  <?php elseif ($product['is_low_stock']): ?>
                    <br><span style="color: #ffa500; font-size: 11px;">⚠️ Thấp</span>
                  <?php endif; ?>
                </td>
                <td><?= $product['min_quantity'] ?></td>
                <td>
                  <?php if ($product['quantity'] == 0): ?>
                    <span style="color: #ff4444; font-weight: bold;">❌ Hết hàng</span>
                  <?php elseif ($product['is_low_stock']): ?>
                    <span style="color: #ffa500; font-weight: bold;">⚠️ Tồn kho thấp</span>
                  <?php else: ?>
                    <span style="color: #1db954; font-weight: bold;">✅ Đủ hàng</span>
                  <?php endif; ?>
                </td>
                <td>
                  <strong><?= number_format($product['quantity'] * $product['price'], 0, ',', '.') ?> ₫</strong>
                  <br><small style="color: #888;">
                    <?= number_format($product['price'], 0, ',', '.') ?>₫/sp
                  </small>
                </td>
                <td>
                  <div style="display: flex; flex-direction: column; gap: 5px;">
                    <div>
                      <a href="stock_in.php?product_id=<?= $product['id'] ?>" 
                         style="color: #1db954; text-decoration: none; font-size: 13px;">
                        📥 Nhập
                      </a>
                      <span style="color: #666;"> | </span>
                      <a href="stock_out.php?product_id=<?= $product['id'] ?>" 
                         style="color: #ff6b35; text-decoration: none; font-size: 13px;">
                        📤 Xuất
                      </a>
                    </div>
                    <div>
                      <a href="stock_alert.php?product_id=<?= $product['id'] ?>" 
                         style="color: #ffa500; text-decoration: none; font-size: 13px;">
                        ⚙️ Cài đặt
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          <?php else: ?>
            <tr>
              <td colspan="8" style="text-align: center; color: #b3b3b3; padding: 40px;">
                <?php if (!empty($search)): ?>
                  🔍 Không tìm thấy sản phẩm nào với từ khóa "<?= htmlspecialchars($search) ?>"
                <?php elseif ($filter == 'low_stock'): ?>
                  ✅ Không có sản phẩm nào có tồn kho thấp
                <?php elseif ($filter == 'out_of_stock'): ?>
                  ✅ Không có sản phẩm nào hết hàng
                <?php else: ?>
                  📦 Không có sản phẩm nào
                <?php endif; ?>
              </td>
            </tr>
          <?php endif; ?>
          </tbody>
        </table>

        <!-- Pagination (if needed) -->
        <?php if (count($filtered_products) > 50): ?>
          <div style="text-align: center; margin-top: 20px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
            <p style="color: #aaa; margin: 0;">
              Hiển thị <?= min(50, count($filtered_products)) ?> / <?= count($filtered_products) ?> sản phẩm
            </p>
            <?php if (count($filtered_products) > 50): ?>
              <p style="color: #888; font-size: 14px; margin: 10px 0 0;">
                💡 Sử dụng tính năng tìm kiếm hoặc lọc để xem ít sản phẩm hơn
              </p>
            <?php endif; ?>
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>

<script>
// Auto-submit form when filter changes
document.addEventListener('DOMContentLoaded', function() {
    // Highlight search results
    const searchTerm = '<?= htmlspecialchars($_GET['search'] ?? '') ?>';
    if (searchTerm) {
        const cells = document.querySelectorAll('.inventory-table td');
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                cell.innerHTML = cell.innerHTML.replace(
                    new RegExp(`(${searchTerm})`, 'gi'), 
                    '<mark style="background: #ffa500; color: #000; padding: 1px 3px; border-radius: 2px;">$1</mark>'
                );
            }
        });
    }

    // Add loading effect to import buttons
    const importButtons = document.querySelectorAll('a[href*="import"]');
    importButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.opacity = '0.7';
            this.innerHTML = this.innerHTML.replace('📥', '⏳');
        });
    });
});

// Quick actions
const quickActions = document.querySelectorAll('.quick-action-btn');
quickActions.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.includes('action=')) {
            e.preventDefault();
            // Add loading state
            this.style.opacity = '0.7';
            this.innerHTML = '⏳ Đang xử lý...';
            
            // Simulate action (replace with actual functionality)
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        }
    });
});
</script>

</body>
</html>
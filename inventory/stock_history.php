<?php
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

include __DIR__ . '/../config.php';

// Pagination
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$limit = 20;
$offset = ($page - 1) * $limit;

// Filter
$product_filter = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
$type_filter = isset($_GET['type']) ? $_GET['type'] : '';
$date_from = isset($_GET['date_from']) ? $_GET['date_from'] : '';
$date_to = isset($_GET['date_to']) ? $_GET['date_to'] : '';

// Build WHERE clause
$where_conditions = [];
$params = [];
$param_types = '';

if ($product_filter > 0) {
    $where_conditions[] = "st.product_id = ?";
    $params[] = $product_filter;
    $param_types .= 'i';
}

if ($type_filter) {
    $where_conditions[] = "st.transaction_type = ?";
    $params[] = $type_filter;
    $param_types .= 's';
}

if ($date_from) {
    $where_conditions[] = "DATE(st.created_at) >= ?";
    $params[] = $date_from;
    $param_types .= 's';
}

if ($date_to) {
    $where_conditions[] = "DATE(st.created_at) <= ?";
    $params[] = $date_to;
    $param_types .= 's';
}

$where_clause = count($where_conditions) > 0 ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

// Get transactions
$sql = "SELECT st.*, p.name, p.sku 
        FROM stock_transactions st 
        JOIN products p ON st.product_id = p.id 
        $where_clause 
        ORDER BY st.created_at DESC 
        LIMIT ? OFFSET ?";

$params[] = $limit;
$params[] = $offset;
$param_types .= 'ii';

$stmt = $conn->prepare($sql);
if ($param_types) {
    $stmt->bind_param($param_types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

// Get total count for pagination
$count_sql = "SELECT COUNT(*) as total 
              FROM stock_transactions st 
              JOIN products p ON st.product_id = p.id 
              $where_clause";

if (count($where_conditions) > 0) {
    $count_params = array_slice($params, 0, -2); // Remove limit and offset
    $count_param_types = substr($param_types, 0, -2);
    $count_stmt = $conn->prepare($count_sql);
    $count_stmt->bind_param($count_param_types, ...$count_params);
    $count_stmt->execute();
    $count_result = $count_stmt->get_result();
} else {
    $count_result = $conn->query($count_sql);
}

$total_records = $count_result->fetch_assoc()['total'];
$total_pages = ceil($total_records / $limit);

// Get products for filter dropdown
$products_result = $conn->query("SELECT id, name, sku FROM products ORDER BY name");
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lịch sử tồn kho</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/stock_history.css?v=<?= time() ?>">
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
          <h2>📊 Lịch sử xuất nhập kho</h2>
          <a href="inventory.php" class="btn" style="background: #666; color: white;">← Quay lại</a>
        </div>

        <!-- Filters -->
        <form method="GET" class="filters">
          <div class="filter-group">
            <label>Sản phẩm:</label>
            <select name="product_id">
              <option value="">Tất cả sản phẩm</option>
              <?php while($product = $products_result->fetch_assoc()): ?>
                <option value="<?= $product['id'] ?>" <?= $product_filter == $product['id'] ? 'selected' : '' ?>>
                  <?= htmlspecialchars($product['name']) ?>
                </option>
              <?php endwhile; ?>
            </select>
          </div>

          <div class="filter-group">
            <label>Loại giao dịch:</label>
            <select name="type">
              <option value="">Tất cả</option>
              <option value="in" <?= $type_filter == 'in' ? 'selected' : '' ?>>Nhập kho</option>
              <option value="out" <?= $type_filter == 'out' ? 'selected' : '' ?>>Xuất kho</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Từ ngày:</label>
            <input type="date" name="date_from" value="<?= $date_from ?>">
          </div>

          <div class="filter-group">
            <label>Đến ngày:</label>
            <input type="date" name="date_to" value="<?= $date_to ?>">
          </div>

          <div class="filter-group">
            <button type="submit" class="btn btn-primary">🔍 Lọc</button>
          </div>

          <div class="filter-group">
            <a href="stock_history.php" class="btn" style="background: #666; color: white;">🔄 Reset</a>
          </div>
        </form>

        <!-- Summary -->
        <?php
        // Calculate summary for current filters
        $summary_sql = "SELECT 
                          transaction_type,
                          COUNT(*) as count,
                          SUM(quantity) as total_quantity
                        FROM stock_transactions st 
                        JOIN products p ON st.product_id = p.id 
                        $where_clause
                        GROUP BY transaction_type";
        
        $summary_params = array_slice($params, 0, -2); // Remove limit and offset
        $summary_param_types = substr($param_types, 0, -2);
        
        if (count($where_conditions) > 0) {
            $summary_stmt = $conn->prepare($summary_sql);
            $summary_stmt->bind_param($summary_param_types, ...$summary_params);
            $summary_stmt->execute();
            $summary_result = $summary_stmt->get_result();
        } else {
            $summary_result = $conn->query($summary_sql);
        }
        
        $summary = ['in' => ['count' => 0, 'quantity' => 0], 'out' => ['count' => 0, 'quantity' => 0]];
        while ($row = $summary_result->fetch_assoc()) {
            $summary[$row['transaction_type']] = [
                'count' => $row['count'],
                'quantity' => $row['total_quantity']
            ];
        }
        ?>

        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-number"><?= $summary['in']['count'] ?></div>
            <div class="summary-label">Lần nhập kho</div>
          </div>
          <div class="summary-card">
            <div class="summary-number"><?= number_format($summary['in']['quantity']) ?></div>
            <div class="summary-label">Tổng số lượng nhập</div>
          </div>
          <div class="summary-card out">
            <div class="summary-number"><?= $summary['out']['count'] ?></div>
            <div class="summary-label">Lần xuất kho</div>
          </div>
          <div class="summary-card out">
            <div class="summary-number"><?= number_format($summary['out']['quantity']) ?></div>
            <div class="summary-label">Tổng số lượng xuất</div>
          </div>
        </div>

        <!-- History Table -->
        <table class="inventory-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Sản phẩm</th>
              <th>Loại</th>
              <th>Số lượng</th>
              <th>Lý do</th>
              <th>Tham chiếu</th>
              <th>Người thực hiện</th>
            </tr>
          </thead>
          <tbody>
          <?php if ($result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
              <tr>
                <td><?= date('d/m/Y H:i', strtotime($row['created_at'])) ?></td>
                <td>
                  <strong><?= htmlspecialchars($row['name']) ?></strong><br>
                  <small style="color: #b3b3b3;"><?= htmlspecialchars($row['sku']) ?></small>
                </td>
                <td>
                  <?php if ($row['transaction_type'] == 'in'): ?>
                    <span class="transaction-in">📥 Nhập kho</span>
                  <?php else: ?>
                    <span class="transaction-out">📤 Xuất kho</span>
                  <?php endif; ?>
                </td>
                <td class="<?= $row['transaction_type'] == 'in' ? 'transaction-in' : 'transaction-out' ?>">
                  <strong><?= $row['transaction_type'] == 'in' ? '+' : '-' ?><?= $row['quantity'] ?></strong>
                </td>
                <td><?= htmlspecialchars($row['reason']) ?></td>
                <td>
                  <?= $row['reference'] ? htmlspecialchars($row['reference']) : '<span style="color: #666;">-</span>' ?>
                </td>
                <td><?= htmlspecialchars($row['created_by']) ?></td>
              </tr>
            <?php endwhile; ?>
          <?php else: ?>
            <tr>
              <td colspan="7" style="text-align: center; color: #b3b3b3;">Không có giao dịch nào</td>
            </tr>
          <?php endif; ?>
          </tbody>
        </table>

        <!-- Pagination -->
        <?php if ($total_pages > 1): ?>
          <div class="pagination">
            <?php if ($page > 1): ?>
              <a href="?<?= http_build_query(array_merge($_GET, ['page' => 1])) ?>">« Đầu</a>
              <a href="?<?= http_build_query(array_merge($_GET, ['page' => $page - 1])) ?>">‹ Trước</a>
            <?php endif; ?>

            <?php for ($i = max(1, $page - 2); $i <= min($total_pages, $page + 2); $i++): ?>
              <?php if ($i == $page): ?>
                <span class="current"><?= $i ?></span>
              <?php else: ?>
                <a href="?<?= http_build_query(array_merge($_GET, ['page' => $i])) ?>"><?= $i ?></a>
              <?php endif; ?>
            <?php endfor; ?>

            <?php if ($page < $total_pages): ?>
              <a href="?<?= http_build_query(array_merge($_GET, ['page' => $page + 1])) ?>">Sau ›</a>
              <a href="?<?= http_build_query(array_merge($_GET, ['page' => $total_pages])) ?>">Cuối »</a>
            <?php endif; ?>
          </div>
          
          <div style="text-align: center; margin-top: 10px; color: #b3b3b3; font-size: 14px;">
            Hiển thị <?= min($offset + 1, $total_records) ?> - <?= min($offset + $limit, $total_records) ?> của <?= $total_records ?> kết quả
          </div>
        <?php endif; ?>
      </div>
    </div>
  </div>
</div>

</body>
</html>
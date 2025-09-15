<?php
require_once __DIR__ . '/../includes/auth.php'; 
// Cấu hình kết nối database
$host = "localhost";
$user = "root";
$pass = "";
$db = "warehouse_db";

// Kết nối database
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}

// Set charset
$conn->set_charset("utf8mb4");

// Lấy dữ liệu thống kê tổng quan
function getInventoryStats($conn) {
    $stats = [];

    // Tổng số sản phẩm
    $result = $conn->query("SELECT COUNT(*) as total_products FROM products");
    $stats['total_products'] = $result->fetch_assoc()['total_products'];

    // Tổng giá trị kho
    $result = $conn->query("SELECT SUM(quantity * price) as total_value FROM products");
    $row = $result->fetch_assoc();
    $stats['total_value'] = $row['total_value'] ?: 0;

    // Sản phẩm hết hàng
    $result = $conn->query("SELECT COUNT(*) as out_of_stock FROM products WHERE quantity = 0");
    $stats['out_of_stock'] = $result->fetch_assoc()['out_of_stock'];

    // Sản phẩm sắp hết hàng (dưới mức tối thiểu)
    $result = $conn->query("
        SELECT COUNT(*) as low_stock 
        FROM products p 
        JOIN stock_alerts sa ON p.id = sa.product_id 
        WHERE p.quantity <= sa.min_quantity AND sa.is_active = 1
    ");
    $stats['low_stock'] = $result->fetch_assoc()['low_stock'];

    // Giao dịch trong tháng
    $result = $conn->query("
        SELECT COUNT(*) as monthly_transactions 
        FROM stock_transactions 
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    ");
    $stats['monthly_transactions'] = $result->fetch_assoc()['monthly_transactions'];

    return $stats;
}

// Lấy top sản phẩm có giá trị cao nhất
function getTopValueProducts($conn, $limit = 5) {
    $result = $conn->query("
        SELECT name, sku, quantity, price, (quantity * price) as total_value
        FROM products 
        ORDER BY total_value DESC 
        LIMIT $limit
    ");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Lấy sản phẩm cần nhập hàng
function getLowStockProducts($conn) {
    $result = $conn->query("
        SELECT p.name, p.sku, p.quantity, sa.min_quantity, p.price
        FROM products p 
        JOIN stock_alerts sa ON p.id = sa.product_id 
        WHERE p.quantity <= sa.min_quantity AND sa.is_active = 1
        ORDER BY (sa.min_quantity - p.quantity) DESC
    ");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Lấy lịch sử giao dịch gần đây
function getRecentTransactions($conn, $limit = 10) {
    $result = $conn->query("
        SELECT st.transaction_type, st.quantity, st.reason, st.created_at,
               p.name as product_name, p.sku, st.created_by
        FROM stock_transactions st
        JOIN products p ON st.product_id = p.id
        ORDER BY st.created_at DESC
        LIMIT $limit
    ");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Lấy thống kê theo tháng
function getMonthlyStats($conn) {
    $result = $conn->query("
        SELECT 
            MONTH(created_at) as month,
            YEAR(created_at) as year,
            transaction_type,
            SUM(quantity) as total_quantity,
            COUNT(*) as transaction_count
        FROM stock_transactions 
        WHERE created_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(created_at), MONTH(created_at), transaction_type
        ORDER BY year DESC, month DESC
    ");
    return $result->fetch_all(MYSQLI_ASSOC);
}

// Lấy dữ liệu
$stats = getInventoryStats($conn);
$topProducts = getTopValueProducts($conn);
$lowStockProducts = getLowStockProducts($conn);
$recentTransactions = getRecentTransactions($conn);
$monthlyStats = getMonthlyStats($conn);
?>

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Báo Cáo Kho Hàng</title>
    <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/report.css?v=<?= time() ?>">

</head>
<body>
    <div class="layout">
  <!-- Sidebar -->
  <?php include __DIR__ . '/../includes/sidebar.php'; ?>

  <!-- Main content -->
  <div class="main-content">
    <!-- Header -->
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div class="container">
        <div class="header">
            <h1>📊 Báo Cáo Quản Lý Kho Hàng</h1>
            <p>Ngày: <?php echo date('d/m/Y H:i'); ?></p>
        </div>

        <button class="export-btn" onclick="window.print()">🖨️ In Báo Cáo</button>
       <button class="btn btn-primary" onclick="window.location.href='export_excel.php'">📊 Xuất Excel</button>


        <!-- Thống kê tổng quan -->
        <div class="stats-grid">
            <div class="stat-card info">
                <h3>Tổng Số Sản Phẩm</h3>
                <div class="number"><?php echo number_format($stats['total_products']); ?></div>
            </div>
            <div class="stat-card success">
                <h3>Tổng Giá Trị Kho</h3>
                <div class="number currency"><?php echo number_format($stats['total_value']); ?>đ</div>
            </div>
            <div class="stat-card warning">
                <h3>Sản Phẩm Hết Hàng</h3>
                <div class="number"><?php echo $stats['out_of_stock']; ?></div>
            </div>
            <div class="stat-card warning">
                <h3>Sắp Hết Hàng</h3>
                <div class="number"><?php echo $stats['low_stock']; ?></div>
            </div>
            <div class="stat-card info">
                <h3>Giao Dịch Tháng Này</h3>
                <div class="number"><?php echo $stats['monthly_transactions']; ?></div>
            </div>
        </div>

        <!-- Top sản phẩm giá trị cao -->
        <div class="section">
            <h2>🏆 Top Sản Phẩm Giá Trị Cao Nhất</h2>
            <?php if (!empty($topProducts)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Sản Phẩm</th>
                            <th>Mã SKU</th>
                            <th>Số Lượng</th>
                            <th>Đơn Giá</th>
                            <th>Tổng Giá Trị</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($topProducts as $product): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($product['name']); ?></td>
                                <td><?php echo htmlspecialchars($product['sku']); ?></td>
                                <td><?php echo number_format($product['quantity']); ?></td>
                                <td class="currency"><?php echo number_format($product['price']); ?>đ</td>
                                <td class="currency"><?php echo number_format($product['total_value']); ?>đ</td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">Không có dữ liệu</div>
            <?php endif; ?>
        </div>

        <!-- Sản phẩm cần nhập hàng -->
        <div class="section">
            <h2>⚠️ Sản Phẩm Cần Nhập Hàng</h2>
            <?php if (!empty($lowStockProducts)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Tên Sản Phẩm</th>
                            <th>Mã SKU</th>
                            <th>Tồn Kho</th>
                            <th>Mức Tối Thiểu</th>
                            <th>Cần Nhập</th>
                            <th>Đơn Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($lowStockProducts as $product): ?>
                            <tr>
                                <td><?php echo htmlspecialchars($product['name']); ?></td>
                                <td><?php echo htmlspecialchars($product['sku']); ?></td>
                                <td class="low-stock"><?php echo number_format($product['quantity']); ?></td>
                                <td><?php echo number_format($product['min_quantity']); ?></td>
                                <td class="low-stock"><?php echo number_format($product['min_quantity'] - $product['quantity']); ?></td>
                                <td class="currency"><?php echo number_format($product['price']); ?>đ</td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">✅ Tất cả sản phẩm đều đủ hàng</div>
            <?php endif; ?>
        </div>

        <!-- Lịch sử giao dịch gần đây -->
        <div class="section">
            <h2>📝 Giao Dịch Gần Đây</h2>
            <?php if (!empty($recentTransactions)): ?>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Sản Phẩm</th>
                            <th>Loại GD</th>
                            <th>Số Lượng</th>
                            <th>Lý Do</th>
                            <th>Người Thực Hiện</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($recentTransactions as $trans): ?>
                            <tr>
                                <td><?php echo date('d/m/Y H:i', strtotime($trans['created_at'])); ?></td>
                                <td><?php echo htmlspecialchars($trans['product_name']); ?> (<?php echo $trans['sku']; ?>)</td>
                                <td class="<?php echo $trans['transaction_type'] == 'in' ? 'transaction-in' : 'transaction-out'; ?>">
                                    <?php echo $trans['transaction_type'] == 'in' ? '⬆️ Nhập' : '⬇️ Xuất'; ?>
                                </td>
                                <td><?php echo number_format($trans['quantity']); ?></td>
                                <td><?php echo htmlspecialchars($trans['reason']); ?></td>
                                <td><?php echo htmlspecialchars($trans['created_by']); ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            <?php else: ?>
                <div class="no-data">Chưa có giao dịch nào</div>
            <?php endif; ?>
        </div>
    </main>
</div>

<script>
    function exportToCSV() {
        // Tạo dữ liệu CSV từ các bảng trên trang
        let csv = [];
        let tables = document.querySelectorAll('.report-table');

        tables.forEach((table, index) => {
            let tableTitle = table.closest('.report-section').querySelector('h2').textContent;
            csv.push('\n' + tableTitle + '\n');

            let rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                let cols = row.querySelectorAll('th, td');
                let rowData = [];
                cols.forEach(col => {
                    rowData.push('"' + col.textContent.trim() + '"');
                });
                csv.push(rowData.join(','));
            });
            csv.push(''); 
        });

        // Tải file CSV
        let csvContent = csv.join('\n');
        let blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        let link = document.createElement('a');
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bao_cao_kho_hang_' + new Date().getTime() + '.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
</script>
</body>
</html>
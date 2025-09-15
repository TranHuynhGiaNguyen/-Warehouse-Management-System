<?php
require_once __DIR__ . '/../includes/auth.php'; 
require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Kết nối DB
$conn = new mysqli("localhost", "root", "", "warehouse_db");
$conn->set_charset("utf8mb4");

// === Các hàm lấy dữ liệu ===
function getInventoryStats($conn) {
    $stats = [];
    $stats['total_products'] = $conn->query("SELECT COUNT(*) as total FROM products")->fetch_assoc()['total'];
    $stats['total_value'] = $conn->query("SELECT SUM(quantity * price) as val FROM products")->fetch_assoc()['val'] ?: 0;
    $stats['out_of_stock'] = $conn->query("SELECT COUNT(*) as c FROM products WHERE quantity = 0")->fetch_assoc()['c'];
    $stats['low_stock'] = $conn->query("SELECT COUNT(*) as c FROM products p JOIN stock_alerts sa ON p.id=sa.product_id 
                                        WHERE p.quantity <= sa.min_quantity AND sa.is_active=1")->fetch_assoc()['c'];
    $stats['monthly_transactions'] = $conn->query("SELECT COUNT(*) as c FROM stock_transactions 
                                                  WHERE MONTH(created_at)=MONTH(CURRENT_DATE()) 
                                                  AND YEAR(created_at)=YEAR(CURRENT_DATE())")->fetch_assoc()['c'];
    return $stats;
}

function getTopValueProducts($conn) {
    return $conn->query("SELECT name, sku, quantity, price, (quantity*price) as total_value
                         FROM products ORDER BY total_value DESC LIMIT 5")->fetch_all(MYSQLI_ASSOC);
}

function getLowStockProducts($conn) {
    return $conn->query("SELECT p.name, p.sku, p.quantity, sa.min_quantity, p.price
                         FROM products p JOIN stock_alerts sa ON p.id=sa.product_id
                         WHERE p.quantity <= sa.min_quantity AND sa.is_active=1
                         ORDER BY (sa.min_quantity - p.quantity) DESC")->fetch_all(MYSQLI_ASSOC);
}

function getRecentTransactions($conn) {
    return $conn->query("SELECT st.transaction_type, st.quantity, st.reason, st.created_at,
                                p.name as product_name, p.sku, st.created_by
                         FROM stock_transactions st
                         JOIN products p ON st.product_id=p.id
                         ORDER BY st.created_at DESC LIMIT 10")->fetch_all(MYSQLI_ASSOC);
}

// Lấy dữ liệu
$stats = getInventoryStats($conn);
$topProducts = getTopValueProducts($conn);
$lowStockProducts = getLowStockProducts($conn);
$recentTransactions = getRecentTransactions($conn);

// === Tạo Excel ===
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$row = 1;

// --- Thống kê tổng quan ---
$sheet->setCellValue("A{$row}", "📊 Báo cáo kho hàng (" . date('d/m/Y H:i') . ")");
$sheet->mergeCells("A{$row}:F{$row}");
$sheet->getStyle("A{$row}")->getFont()->setBold(true)->setSize(14);
$row += 2;

$sheet->setCellValue("A{$row}", "Tổng số sản phẩm")->setCellValue("B{$row}", $stats['total_products']);
$sheet->setCellValue("C{$row}", "Tổng giá trị kho")->setCellValue("D{$row}", $stats['total_value']);
$sheet->setCellValue("E{$row}", "Sản phẩm hết hàng")->setCellValue("F{$row}", $stats['out_of_stock']);
$row++;
$sheet->setCellValue("A{$row}", "Sản phẩm sắp hết hàng")->setCellValue("B{$row}", $stats['low_stock']);
$sheet->setCellValue("C{$row}", "Giao dịch tháng này")->setCellValue("D{$row}", $stats['monthly_transactions']);
$row += 2;

// --- Top sản phẩm giá trị cao ---
$sheet->setCellValue("A{$row}", "🏆 Top sản phẩm giá trị cao nhất");
$sheet->mergeCells("A{$row}:E{$row}");
$sheet->getStyle("A{$row}")->getFont()->setBold(true);
$row++;

$headers = ["Tên sản phẩm", "SKU", "Số lượng", "Đơn giá", "Tổng giá trị"];
$sheet->fromArray($headers, null, "A{$row}");
$sheet->getStyle("A{$row}:E{$row}")->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
$sheet->getStyle("A{$row}:E{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1DB954');
$row++;

foreach ($topProducts as $p) {
    $sheet->fromArray([$p['name'], $p['sku'], $p['quantity'], $p['price'], $p['total_value']], null, "A{$row}");
    $row++;
}
$row += 2;

// --- Sản phẩm cần nhập hàng ---
$sheet->setCellValue("A{$row}", "⚠️ Sản phẩm cần nhập hàng");
$sheet->mergeCells("A{$row}:F{$row}");
$sheet->getStyle("A{$row}")->getFont()->setBold(true);
$row++;

$headers = ["Tên sản phẩm", "SKU", "Tồn kho", "Mức tối thiểu", "Cần nhập", "Đơn giá"];
$sheet->fromArray($headers, null, "A{$row}");
$sheet->getStyle("A{$row}:F{$row}")->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
$sheet->getStyle("A{$row}:F{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1DB954');
$row++;

foreach ($lowStockProducts as $p) {
    $sheet->fromArray([
        $p['name'], $p['sku'], $p['quantity'], $p['min_quantity'],
        $p['min_quantity'] - $p['quantity'], $p['price']
    ], null, "A{$row}");
    $row++;
}
$row += 2;

// --- Giao dịch gần đây ---
$sheet->setCellValue("A{$row}", "📝 Giao dịch gần đây");
$sheet->mergeCells("A{$row}:F{$row}");
$sheet->getStyle("A{$row}")->getFont()->setBold(true);
$row++;

$headers = ["Ngày", "Sản phẩm", "Loại GD", "Số lượng", "Lý do", "Người thực hiện"];
$sheet->fromArray($headers, null, "A{$row}");
$sheet->getStyle("A{$row}:F{$row}")->getFont()->setBold(true)->getColor()->setRGB('FFFFFF');
$sheet->getStyle("A{$row}:F{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1DB954');
$row++;

foreach ($recentTransactions as $t) {
    $sheet->fromArray([
        date('d/m/Y H:i', strtotime($t['created_at'])),
        $t['product_name'] . " ({$t['sku']})",
        $t['transaction_type'] == 'in' ? '⬆️ Nhập' : '⬇️ Xuất',
        $t['quantity'], $t['reason'], $t['created_by']
    ], null, "A{$row}");
    $row++;
}

// Auto width
foreach (range('A','F') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Xuất file
ob_clean();
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="report_' . date('Ymd_His') . '.xlsx"');
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;

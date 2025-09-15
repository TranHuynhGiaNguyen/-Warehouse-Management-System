<?php
require '../vendor/autoload.php';
require_once __DIR__ . '/../includes/auth.php'; 
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Kết nối database
$conn = new mysqli("localhost", "root", "", "warehouse_db");
if ($conn->connect_error) {
    die("Kết nối thất bại: " . $conn->connect_error);
}
$conn->set_charset("utf8mb4");

// Lấy dữ liệu sản phẩm
$result = $conn->query("SELECT name, sku, quantity, price, (quantity*price) as total_value FROM products");
$products = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];

// Tạo file Excel
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();

// Tiêu đề cột
$headers = ["Tên sản phẩm", "Mã SKU", "Số lượng", "Đơn giá", "Tổng giá trị"];
$col = 'A';
foreach ($headers as $header) {
    $sheet->setCellValue($col . '1', $header);
    $col++;
}

// Style cho header
$sheet->getStyle('A1:E1')->applyFromArray([
    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
    'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['rgb' => '1DB954']
    ],
    'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER],
    'borders' => [
        'allBorders' => ['borderStyle' => Border::BORDER_THIN]
    ]
]);

// Đổ dữ liệu
$row = 2;
foreach ($products as $p) {
    $sheet->setCellValue('A' . $row, $p['name']);
    $sheet->setCellValue('B' . $row, $p['sku']);
    $sheet->setCellValue('C' . $row, $p['quantity']);
    $sheet->setCellValue('D' . $row, $p['price']);
    $sheet->setCellValue('E' . $row, $p['total_value']);
    $row++;
}

// Tự động co giãn cột
foreach (range('A', 'E') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Ghi chú
$notes = [
    "📌 File này được xuất tự động từ hệ thống Quản Lý Kho.",
    "🕒 Ngày xuất: " . date('d/m/Y H:i')
];

if (!empty($notes)) {
    $noteRow = $row + 2;
    foreach ($notes as $note) {
        $sheet->setCellValue('A' . $noteRow, $note);
        $sheet->mergeCells('A' . $noteRow . ':E' . $noteRow);
        $sheet->getStyle('A' . $noteRow)->getFont()->setSize(10);
        $sheet->getStyle('A' . $noteRow)->getAlignment()->setWrapText(true);
        $noteRow++;
    }
}

// Xuất file Excel
ob_clean();
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="inventory_export_' . date('Ymd_His') . '.xlsx"');
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;

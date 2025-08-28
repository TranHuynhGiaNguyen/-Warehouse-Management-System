<?php
require __DIR__ . '/../vendor/autoload.php';
include __DIR__ . '/../config.php';

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Query dữ liệu từ DB
$sql = "SELECT p.sku, p.name, p.quantity, p.price, 
               COALESCE(sa.min_quantity, 5) as min_quantity
        FROM products p
        LEFT JOIN (
            SELECT product_id, MAX(min_quantity) as min_quantity
            FROM stock_alerts
            GROUP BY product_id
        ) sa ON p.id = sa.product_id";
$result = $conn->query($sql);

// Tạo file Excel mới
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle('Mẫu Import Tồn Kho');

// Header
$headers = [
    'A1' => 'SKU (Mã SP)',
    'B1' => 'Tên sản phẩm', 
    'C1' => 'Số lượng',
    'D1' => 'Giá',
    'E1' => 'Tồn kho tối thiểu',
    'F1' => 'Danh mục'
];
foreach ($headers as $cell => $value) {
    $sheet->setCellValue($cell, $value);
}

// Ghi dữ liệu
$row = 2;
if ($result && $result->num_rows > 0) {
    while ($product = $result->fetch_assoc()) {
        $sheet->setCellValue('A' . $row, $product['sku']);
        $sheet->setCellValue('B' . $row, $product['name']);
        $sheet->setCellValue('C' . $row, $product['quantity'] ?? 0);
        $sheet->setCellValue('D' . $row, $product['price'] ?? 0);
        $sheet->setCellValue('E' . $row, $product['min_quantity'] ?? 5);
        $sheet->setCellValue('F' . $row, ''); // Chưa có danh mục
        $row++;
    }
}

// Định dạng header
$headerRange = 'A1:F1';
$sheet->getStyle($headerRange)->applyFromArray([
    'font' => [
        'bold' => true,
        'color' => ['rgb' => 'FFFFFF'],
        'size' => 12
    ],
    'fill' => [
        'fillType' => Fill::FILL_SOLID,
        'startColor' => ['rgb' => '1DB954']
    ],
    'alignment' => [
        'horizontal' => Alignment::HORIZONTAL_CENTER,
        'vertical' => Alignment::VERTICAL_CENTER
    ],
    'borders' => [
        'allBorders' => [
            'borderStyle' => Border::BORDER_THIN,
            'color' => ['rgb' => '000000']
        ]
    ]
]);

// Định dạng dữ liệu
$dataRange = 'A2:F' . ($row - 1);
$sheet->getStyle($dataRange)->applyFromArray([
    'borders' => [
        'allBorders' => [
            'borderStyle' => Border::BORDER_THIN,
            'color' => ['rgb' => 'CCCCCC']
        ]
    ],
    'alignment' => [
        'vertical' => Alignment::VERTICAL_CENTER
    ]
]);

// Định dạng số
$sheet->getStyle('C2:D' . ($row - 1))->getNumberFormat()->setFormatCode('#,##0');
$sheet->getStyle('E2:E' . ($row - 1))->getNumberFormat()->setFormatCode('0');

// Auto-size column
foreach (range('A', 'F') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Thêm ghi chú
$noteRow = $row + 2;
$sheet->setCellValue('A' . $noteRow, 'GHI CHÚ:');
$sheet->getStyle('A' . $noteRow)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF0000'));

$noteRow++;
foreach ($notes as $note) {
    $sheet->setCellValue('A' . $noteRow, $note);
    $sheet->getStyle('A' . $noteRow)->getFont()->setSize(10);
    $noteRow++;
}

// Merge cells cho ghi chú
foreach (range($noteRow - count($notes), $noteRow - 1) as $r) {
    $sheet->mergeCells('A' . $r . ':F' . $r);
}

// Xuất file
$filename = 'Tồn kho_' . date('Ymd_His') . '.xlsx';
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header("Content-Disposition: attachment; filename=\"$filename\"");
header('Cache-Control: max-age=0');

$writer = new Xlsx($spreadsheet);
$writer->save('php://output');
exit;

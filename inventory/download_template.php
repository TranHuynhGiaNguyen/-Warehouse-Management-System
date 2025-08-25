<?php
require __DIR__ . '/../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

// Tạo spreadsheet mới
$spreadsheet = new Spreadsheet();
$sheet = $spreadsheet->getActiveSheet();
$sheet->setTitle('Mẫu Import Tồn Kho');

// Thiết lập tiêu đề
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

// Dữ liệu mẫu
$sampleData = [
    ['SP001', 'Áo thun nam', 100, 150000, 10, 'Thời trang'],
    ['SP002', 'Quần jean nữ', 50, 299000, 5, 'Thời trang'],
    ['SP003', 'Giày thể thao', 25, 599000, 3, 'Giày dép'],
    ['SP004', 'Túi xách', 15, 459000, 2, 'Phụ kiện'],
    ['SP005', 'Đồng hồ', 8, 899000, 1, 'Phụ kiện']
];

// Thêm dữ liệu mẫu
$row = 2;
foreach ($sampleData as $data) {
    $col = 'A';
    foreach ($data as $value) {
        $sheet->setCellValue($col . $row, $value);
        $col++;
    }
    $row++;
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

// Định dạng cột số
$sheet->getStyle('C2:D' . ($row - 1))->getNumberFormat()->setFormatCode('#,##0');
$sheet->getStyle('E2:E' . ($row - 1))->getNumberFormat()->setFormatCode('0');

// Tự động điều chỉnh độ rộng cột
foreach (range('A', 'F') as $col) {
    $sheet->getColumnDimension($col)->setAutoSize(true);
}

// Thêm ghi chú
$noteRow = $row + 2;
$sheet->setCellValue('A' . $noteRow, 'GHI CHÚ:');
$sheet->getStyle('A' . $noteRow)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF0000'));

$notes = [
    '• Cột SKU (Mã SP): Bắt buộc, không được trùng lặp',
    '• Cột Tên sản phẩm: Bắt buộc',
    '• Cột Số lượng: Bắt buộc, phải là số nguyên dương',
    '• Cột Giá: Bắt buộc, phải là số dương',
    '• Cột Tồn kho tối thiểu: Không bắt buộc (mặc định = 5)',
    '• Cột Danh mục: Không bắt buộc',
    '• Xóa các dòng dữ liệu mẫu này trước khi import'
];

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

// Thiết lập tên file
$filename = 'Mẫu import tồn kho' .'.xlsx';

// Output headers
header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
header('Content-Disposition: attachment;filename="' . $filename . '"');
header('Cache-Control: max-age=0');

// Tạo writer và xuất file
$writer = new Xlsx($spreadsheet);
$writer->save('php://output');

// Dọn dẹp
$spreadsheet->disconnectWorksheets();
unset($spreadsheet);
exit;
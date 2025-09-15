<?php
require_once __DIR__ . '/../includes/auth.php'; 
// Bật hiển thị lỗi để debug
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Kết nối DB
include __DIR__ . '/../config.php';

$message = '';
$error = '';
$import_results = [];

// Xử lý upload file
if ($_POST && isset($_FILES['excel_file'])) {
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $fileName = $_FILES['excel_file']['name'];
    $fileTmp = $_FILES['excel_file']['tmp_name'];
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    // Kiểm tra file Excel
    if (!in_array($fileExt, ['xlsx', 'xls'])) {
        $error = "Chỉ chấp nhận file Excel (.xlsx, .xls)";
    } else {
        $uploadPath = $uploadDir . uniqid() . '.' . $fileExt;
        
        if (move_uploaded_file($fileTmp, $uploadPath)) {
            // Sử dụng PhpSpreadsheet để đọc Excel
            require_once __DIR__ . '/../vendor/autoload.php';
            function parse_vnd_price($val): int {
            $s = trim((string)$val);
            $s = str_ireplace(['đ', 'vnd', ' '], '', $s);

        // hỗ trợ dạng 10k / 10.5k
        if (preg_match('/k$/i', $s)) {
            $num = preg_replace('/[^0-9\.,]/', '', rtrim($s, "kK"));
            $num = str_replace(',', '.', $num);           // 10,5 -> 10.5
            $num = (float)$num;
            return (int)round($num * 1000);
        }

        // mặc định: bỏ mọi ký tự không phải số (10.000 -> 10000, 20,000 -> 20000)
        $digits = preg_replace('/\D+/', '', $s);
        return $digits === '' ? 0 : (int)$digits;
    }
            
            try {
                $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader(ucfirst($fileExt));
                $spreadsheet = $reader->load($uploadPath);
                $worksheet = $spreadsheet->getActiveSheet();
                $rows = $worksheet->toArray();
                
                // Bỏ qua dòng đầu (header)
                array_shift($rows);
                
                $success_count = 0;
                $error_count = 0;
                $update_mode = $_POST['import_mode'] ?? 'update';
                
                foreach ($rows as $index => $row) {
                    // Bỏ qua dòng trống
                    if (empty(array_filter($row))) continue;
                    
                    $sku = trim($row[0] ?? '');
                    $name = trim($row[1] ?? '');
                    $quantity = intval($row[2] ?? 0);
                    $price = parse_vnd_price($row[3] ?? 0);

                    $min_quantity = intval($row[4] ?? 5);
                    
                    if (empty($sku)) {
                        $import_results[] = [
                            'row' => $index + 2,
                            'status' => 'error',
                            'message' => 'Thiếu mã SKU'
                        ];
                        $error_count++;
                        continue;
                    }
                    
                    // Kiểm tra sản phẩm đã tồn tại
                    $check_sql = "SELECT id, quantity FROM products WHERE sku = ?";
                    $check_stmt = $conn->prepare($check_sql);
                    $check_stmt->bind_param("s", $sku);
                    $check_stmt->execute();
                    $existing = $check_stmt->get_result()->fetch_assoc();
                    
                    if ($existing) {
                        if ($update_mode == 'skip') {
                            $import_results[] = [
                                'row' => $index + 2,
                                'status' => 'skipped',
                                'message' => "Sản phẩm đã tồn tại (SKU: $sku)"
                            ];
                            continue;
                        } else {
                            // Cập nhật sản phẩm
                            if ($update_mode == 'add') {
                                $new_quantity = $existing['quantity'] + $quantity;
                            } else {
                                $new_quantity = $quantity;
                            }
                            
                            $update_sql = "UPDATE products SET name = ?, quantity = ?, price = ? WHERE sku = ?";
                            $update_stmt = $conn->prepare($update_sql);
                            $update_stmt->bind_param("sids", $name, $new_quantity, $price, $sku);
                            
                            if ($update_stmt->execute()) {
                                // Cập nhật stock alert nếu có
                                $alert_sql = "INSERT INTO stock_alerts (product_id, min_quantity, is_active) 
                                           VALUES (?, ?, 1) 
                                           ON DUPLICATE KEY UPDATE min_quantity = ?";
                                $alert_stmt = $conn->prepare($alert_sql);
                                $alert_stmt->bind_param("iii", $existing['id'], $min_quantity, $min_quantity);
                                $alert_stmt->execute();
                                
                                // Ghi lại lịch sử nhập kho
                                $quantity_diff = $new_quantity - $existing['quantity'];
                                if ($quantity_diff > 0) {
                                    $history_sql = "INSERT INTO stock_transactions 
                                                    (product_id, transaction_type, quantity, reason, reference, created_by, created_at) 
                                                    VALUES (?, 'in', ?, 'Import từ Excel', NULL, 'admin', NOW())";
                                    $history_stmt = $conn->prepare($history_sql);
                                    $history_stmt->bind_param("ii", $existing['id'], $quantity_diff);
                                    $history_stmt->execute();
                                }
                                
                                $import_results[] = [
                                    'row' => $index + 2,
                                    'status' => 'updated',
                                    'message' => "Cập nhật thành công (SKU: $sku)"
                                ];
                                $success_count++;
                            } else {
                                $import_results[] = [
                                    'row' => $index + 2,
                                    'status' => 'error',
                                    'message' => "Lỗi cập nhật: " . $conn->error
                                ];
                                $error_count++;
                            }
                        }
                    } else {
                        // Tạo sản phẩm mới
                        $insert_sql = "INSERT INTO products (sku, name, quantity, price, created_at) 
                            VALUES (?, ?, ?, ?, NOW())";
                        $insert_stmt = $conn->prepare($insert_sql);
                        $insert_stmt->bind_param("ssid", $sku, $name, $quantity, $price);
                        
                        if ($insert_stmt->execute()) {
                            $product_id = $conn->insert_id;
                            
                            // Thêm stock alert
                            $alert_sql = "INSERT INTO stock_alerts (product_id, min_quantity, is_active) VALUES (?, ?, 1)";
                            $alert_stmt = $conn->prepare($alert_sql);
                            $alert_stmt->bind_param("ii", $product_id, $min_quantity);
                            $alert_stmt->execute();
                            
                            // Ghi lại lịch sử nhập kho
                            $history_sql = "INSERT INTO stock_transactions 
                                            (product_id, transaction_type, quantity, reason, reference, created_by, created_at) 
                                            VALUES (?, 'in', ?, 'Import từ Excel', NULL, 'admin', NOW())";
                            $history_stmt = $conn->prepare($history_sql);
                            $history_stmt->bind_param("ii", $product_id, $quantity);
                            $history_stmt->execute();
                            
                            $import_results[] = [
                                'row' => $index + 2,
                                'status' => 'created',
                                'message' => "Tạo mới thành công (SKU: $sku)"
                            ];
                            $success_count++;
                        } else {
                            $import_results[] = [
                                'row' => $index + 2,
                                'status' => 'error',
                                'message' => "Lỗi tạo sản phẩm: " . $conn->error
                            ];
                            $error_count++;
                        }
                    }
                }
                
                $message = "Import hoàn tất! Thành công: $success_count, Lỗi: $error_count";
                
                // Xóa file tạm
                unlink($uploadPath);
                
            } catch (Exception $e) {
                $error = "Lỗi đọc file Excel: " . $e->getMessage();
            }
        } else {
            $error = "Không thể upload file";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Import Excel - Quản lý tồn kho</title>
  <!-- CSS -->
  <link rel="stylesheet" href="../assets/css/style.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/header.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/sidebar.css?v=<?= time() ?>">
  <link rel="stylesheet" href="../assets/css/products.css?v=<?= time() ?>">
    <link rel="stylesheet" href="../assets/css/inventory_import.css?v=<?= time() ?>">
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
          <h2>📥 Import Excel - Tồn kho</h2>
          <div class="actions-buttons">
            <a href="inventory.php" class="btn" style="background: #666; color: white;">← Quay lại</a>
            <a href="#sample" class="btn btn-primary">📋 Mẫu Excel</a>
          </div>
        </div>

        <!-- Messages -->
        <?php if (!empty($message)): ?>
          <div class="alert success">
            ✅ <?= htmlspecialchars($message) ?>
          </div>
        <?php endif; ?>
        
        <?php if (!empty($error)): ?>
          <div class="alert error">
            ❌ <?= htmlspecialchars($error) ?>
          </div>
        <?php endif; ?>

        <!-- Import Form -->
        <form method="post" enctype="multipart/form-data" id="importForm">
          <!-- File Upload Area -->
          <div class="upload-area" id="uploadArea">
            <div class="upload-icon">📁</div>
            <div class="upload-text">Kéo thả file Excel hoặc click để chọn</div>
            <div class="upload-hint">Hỗ trợ: .xlsx, .xls (Tối đa 10MB)</div>
            <input type="file" name="excel_file" accept=".xlsx,.xls" class="file-input" id="fileInput" required>
          </div>

          <!-- Import Options -->
          <div class="import-options">
            <h3 style="color: #fff; margin-bottom: 15px;">⚙️ Tùy chọn Import</h3>
            
            <div class="option-group">
              <label>Xử lý sản phẩm trùng lặp:</label>
              <div class="radio-group">
                <div class="radio-option">
                  <input type="radio" name="import_mode" value="update" id="mode_update" checked>
                  <label for="mode_update">Ghi đè (Cập nhật số lượng)</label>
                </div>
                <div class="radio-option">
                  <input type="radio" name="import_mode" value="add" id="mode_add">
                  <label for="mode_add">Cộng dồn (Cộng thêm số lượng)</label>
                </div>
                <div class="radio-option">
                  <input type="radio" name="import_mode" value="skip" id="mode_skip">
                  <label for="mode_skip">Bỏ qua (Không thay đổi)</label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 16px;">
            🚀 Bắt đầu Import
          </button>
        </form>

        <!-- Import Results -->
        <?php if (!empty($import_results)): ?>
          <div class="results-container">
            <h3 style="color: #fff; margin-bottom: 15px;">📊 Kết quả Import</h3>
            
            <!-- Progress Summary -->
            <div style="margin-bottom: 20px;">
              <?php 
              $total = count($import_results);
              $success = count(array_filter($import_results, fn($r) => in_array($r['status'], ['created', 'updated'])));
              $errors = count(array_filter($import_results, fn($r) => $r['status'] == 'error'));
              $skipped = count(array_filter($import_results, fn($r) => $r['status'] == 'skipped'));
              $progress = $total > 0 ? ($success / $total) * 100 : 0;
              ?>
              
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #ccc; font-size: 14px;">
                <span>Tổng: <?= $total ?></span>
                <span>Thành công: <strong style="color: #1db954;"><?= $success ?></strong></span>
                <span>Lỗi: <strong style="color: #ff4444;"><?= $errors ?></strong></span>
                <span>Bỏ qua: <strong style="color: #666;"><?= $skipped ?></strong></span>
              </div>
              
              <div class="progress-bar">
                <div class="progress-fill" style="width: <?= $progress ?>%;"></div>
              </div>
            </div>

            <!-- Detailed Results -->
            <div style="max-height: 300px; overflow-y: auto;">
              <?php foreach ($import_results as $result): ?>
                <div class="result-item">
                  <span class="result-status <?= $result['status'] ?>">
                    <?= ucfirst($result['status']) ?>
                  </span>
                  <span style="color: #888; min-width: 60px;">Dòng <?= $result['row'] ?>:</span>
                  <span style="color: #ccc;"><?= htmlspecialchars($result['message']) ?></span>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endif; ?>

        <!-- Sample Template -->
        <div class="sample-table" id="sample">
          <h3 style="color: #fff; padding: 15px 15px 0;">📋 Mẫu dữ liệu Excel</h3>
          <p style="padding: 0 15px; color: #aaa; font-size: 14px;">
            File Excel của bạn cần có cấu trúc như bảng dưới đây (dòng đầu tiên là tiêu đề):
          </p>
          
          <table>
            <thead>
              <tr>
                <th>SKU (Mã SP) *</th>
                <th>Tên sản phẩm *</th>
                <th>Số lượng *</th>
                <th>Giá *</th>
                <th>Tồn kho tối thiểu</th>
                <th>Danh mục</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SP001</td>
                <td>Áo thun nam</td>
                <td>100</td>
                <td>150000</td>
                <td>10</td>
                <td>Thời trang</td>
              </tr>
              <tr>
                <td>SP002</td>
                <td>Quần jean nữ</td>
                <td>50</td>
                <td>299000</td>
                <td>5</td>
                <td>Thời trang</td>
              </tr>
              <tr>
                <td>SP003</td>
                <td>Giày thể thao</td>
                <td>25</td>
                <td>599000</td>
                <td>3</td>
                <td>Giày dép</td>
              </tr>
            </tbody>
          </table>
          
          <div style="padding: 15px; background: #0f1419; color: #aaa; font-size: 13px;">
            <strong>Lưu ý:</strong> Các cột có dấu (*) là bắt buộc. Nếu không có "Tồn kho tối thiểu", hệ thống sẽ dùng mặc định là 5.
          </div>
        </div>

        <!-- Download Template Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="download_template.php" class="btn" style="background: #1e90ff; color: white; padding: 12px 24px;">
            📥 Tải file mẫu Excel
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
// Drag and drop functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        updateFileName(files[0].name);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        updateFileName(e.target.files[0].name);
    }
});

function updateFileName(fileName) {
    const uploadText = uploadArea.querySelector('.upload-text');
    uploadText.textContent = `Đã chọn: ${fileName}`;
    uploadArea.style.borderColor = '#1db954';
    uploadArea.style.background = '#0a1a0f';
}

// Form submission with loading
document.getElementById('importForm').addEventListener('submit', function() {
    const button = this.querySelector('button[type="submit"]');
    button.innerHTML = '⏳ Đang xử lý...';
    button.disabled = true;
});
</script>

</body>
</html>